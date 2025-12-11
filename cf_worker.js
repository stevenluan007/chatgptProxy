const UPSTREAM = 'https://api.openai.com';

addEventListener('fetch', event => {
  event.respondWith(handle(event.request));
});

async function handle(request) {
  const url = new URL(request.url);
  url.protocol = 'https:';               // 确保 https
  url.host = new URL(UPSTREAM).host;     // 指向官方 API

  // 克隆请求头，保留 Authorization/Content-Type 等
  const headers = new Headers(request.headers);

  const upstreamReq = new Request(url.toString(), {
    method: request.method,
    headers,
    body: request.method === 'GET' || request.method === 'HEAD' ? undefined : request.body,
    redirect: 'follow',
  });

  const resp = await fetch(upstreamReq);

  // 处理 CORS
  const corsResp = new Response(resp.body, resp);
  const origin = request.headers.get('Origin') || '*';
  corsResp.headers.set('Access-Control-Allow-Origin', origin);
  corsResp.headers.set('Access-Control-Allow-Credentials', 'true');
  corsResp.headers.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  corsResp.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  return corsResp;
}

