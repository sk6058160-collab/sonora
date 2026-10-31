// Cloudflare Worker: Spotify search proxy (Client Credentials). NOT deployed.
// Set secrets: wrangler secret put SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET, then `wrangler deploy`.
// Frontend: GET https://<worker>/search?q=... returns Spotify search JSON.
let tok, exp = 0;
export default { async fetch(req, env) {
  const cors = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };
  const q = new URL(req.url).searchParams.get('q');
  if (!q) return new Response('{"error":"q required"}', { status: 400, headers: cors });
  if (!tok || Date.now() > exp) {
    const r = await fetch('https://accounts.spotify.com/api/token', { method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: 'Basic ' + btoa(env.SPOTIFY_CLIENT_ID + ':' + env.SPOTIFY_CLIENT_SECRET) },
      body: 'grant_type=client_credentials' });
    const j = await r.json(); if (!j.access_token) return new Response('{"error":"auth failed"}', { status: 502, headers: cors });
    tok = j.access_token; exp = Date.now() + (j.expires_in - 60) * 1000;
  }
  const r = await fetch('https://api.spotify.com/v1/search?type=track,album,playlist&limit=15&q=' + encodeURIComponent(q), { headers: { Authorization: 'Bearer ' + tok } });
  return new Response(await r.text(), { status: r.status, headers: cors });
}};
