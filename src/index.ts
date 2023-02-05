import { verify, decode, JwtData } from '@tsndr/cloudflare-worker-jwt';

export default {
  async fetch(request: Request, { JWT_KEY }: { JWT_KEY: string }): Promise<Response> {
    const userAgent = request.headers.get('User-Agent');
    if (!userAgent) {
      return new Response("Expected a `User-Agent` header.", { status: 403 });
    }

    const url = new URL(request.url);
    const jwt = url.searchParams.get("jwt");
    if (!jwt) {
      return new Response("`jwt` expected as a query parameter.", { status: 400 });
    }

    // jwt verification
    const isValid = await verify(jwt, JWT_KEY);

    if (!isValid) {
      return new Response("Failed signature check.", { status: 403 });
    }

    const decodedJwt = decode(jwt) as JwtData & {
      payload: {
        url: string;
      }
    };

    const requestedUrl = new URL(decodedJwt.payload.url);

    const resp = await fetch(requestedUrl.toString(), { headers: new Headers({ 'User-Agent': userAgent }) });
    const newResp = new Response(resp.body, resp);  // ??
    newResp.headers.set("Content-Security-Policy", "default-src: 'self';")
    return newResp;
  }
};
