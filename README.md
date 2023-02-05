## pyrox

Proxy that runs on [Cloudflare Workers](https://workers.dev).

#### Setup

1. Install wrangler2. `npm install wrangler`.
2. Set a random secure string as the `JWT_KEY` secret. `npx wrangler secret put JWT_KEY`, responding to the prompt with the key.
3. Edit `wrangler.toml` to have an up to date `routes` key.
4. Deploy! `npx wrangler publish`.
