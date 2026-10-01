// Vercel Build Output API function entry.
//
// The Build Output Node launcher invokes the default export as a classic Node
// `(req, res)` handler — NOT a web handler. TanStack Start emits a portable web
// fetch handler (dist/server/server.js), so we adapt: Node IncomingMessage → web
// Request, run the fetch handler, stream the web Response back onto ServerResponse.
// Node 22 has global Request/Response/Headers/ReadableStream.
//
// Bundled (with its deps + the SSR handler's dynamic ./assets chunks) into
// .vercel/output/functions/render.func/index.mjs by build-vercel.sh.
import type { IncomingMessage, ServerResponse } from "node:http";

import handler from "./dist/server/server.js";

const fetchHandler = handler as {
  fetch: (request: Request) => Response | Promise<Response>;
};

/**
 * A launcher may hand us the raw IncomingMessage, or it may have read and parsed
 * the body for us first and left it on `req.body` (Vercel's Node launcher does
 * exactly that: it buffers the request, consumes the stream and sets `req.body`).
 * Passing the IncomingMessage itself as a web Request body is the fragile case:
 * once a launcher has drained it, `await request.text()` reads an empty string,
 * JSON.parse throws, and a perfectly good enquiry is answered as unreadable.
 *
 * So the body is built defensively: use what the launcher already parsed when it
 * is there, and only drain the stream ourselves when it is not.
 */
type LauncherRequest = IncomingMessage & { body?: unknown; rawBody?: unknown };

/** The launcher's parsed body, as something a web Request will accept. */
function launcherBody(body: unknown): string | Uint8Array | null {
  if (body == null) return null;
  if (typeof body === "string") return body;
  if (Buffer.isBuffer(body)) return body;
  if (body instanceof Uint8Array) return body;
  if (body instanceof ArrayBuffer) return new Uint8Array(body);
  // An already parsed JSON body (the usual case on the host) is re-serialised
  // back to the bytes the route expects to read.
  if (typeof body === "object") return JSON.stringify(body);
  return String(body);
}

/** The stream is ours to read: this is the plain Node server case. */
function drainBody(req: IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer | string) =>
      chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk),
    );
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

const toWebRequest = async (req: LauncherRequest): Promise<Request> => {
  const host = req.headers.host ?? "localhost";
  const proto = (req.headers["x-forwarded-proto"] as string | undefined) ?? "https";
  const url = `${proto}://${host}${req.url ?? "/"}`;
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (Array.isArray(value)) for (const v of value) headers.append(key, v);
    else if (value != null) headers.set(key, value);
  }
  const method = req.method ?? "GET";

  // GET and HEAD stay bodyless, as they must.
  let body: string | Uint8Array | null = null;
  if (method !== "GET" && method !== "HEAD") {
    body = launcherBody(req.body) ?? launcherBody(req.rawBody);
    // Nothing parsed for us: read the stream, unless a launcher already
    // consumed it (readableEnded, or no longer readable at all), in which case
    // there is nothing left to read and waiting on it would hang the request.
    if (body === null && !req.readableEnded && req.readable) body = await drainBody(req);
    if (body !== null) {
      // The body we are handing on is the one that counts, so the length and
      // framing headers are rewritten to match it.
      headers.set(
        "content-length",
        String(typeof body === "string" ? Buffer.byteLength(body) : body.byteLength),
      );
      headers.delete("transfer-encoding");
    }
  }

  // `body` is a string or bytes here, both of which the Request constructor
  // accepts; the cast is only for the generic Uint8Array typing in lib.dom.
  return new Request(url, {
    method,
    headers,
    ...(body !== null ? { body: body as BodyInit } : {}),
  });
};

export default async function vercelHandler(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  try {
    const webRes = await fetchHandler.fetch(await toWebRequest(req));
    res.statusCode = webRes.status;
    webRes.headers.forEach((value, key) => res.setHeader(key, value));
    if (webRes.body) {
      const reader = webRes.body.getReader();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
    }
    res.end();
  } catch (error) {
    // Log the detail server-side (captured by the host's function logs); never
    // return a stack trace to the public visitor of the site.
    console.error("[team-site] SSR request failed", error);
    res.statusCode = 500;
    res.setHeader("content-type", "text/plain");
    res.end("Internal Server Error");
  }
}
