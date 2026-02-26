import type * as Party from "partykit/server";

export default class ShadowServer implements Party.Server {
  state: Record<string, unknown> = {};

  constructor(readonly room: Party.Room) {}

  async onStart() {
    // Load persisted state
    const stored = await this.room.storage.get<Record<string, unknown>>("state");
    if (stored) this.state = stored;
  }

  onConnect(conn: Party.Connection) {
    // Send current state to new connections immediately
    conn.send(JSON.stringify({ type: "state", data: this.state }));
  }

  async onRequest(req: Party.Request) {
    // POST — update from Shadow (authenticated)
    if (req.method === "POST") {
      const token = req.headers.get("authorization")?.replace("Bearer ", "");
      const expected = this.room.env.SHADOW_API_TOKEN as string;
      if (!expected || token !== expected) {
        return new Response("unauthorized", { status: 401 });
      }

      const body = await req.json() as Record<string, unknown>;
      this.state = { ...this.state, ...body, updatedAt: Date.now() };

      // Persist
      await this.room.storage.put("state", this.state);

      // Broadcast to all connected clients
      this.room.broadcast(JSON.stringify({ type: "state", data: this.state }));

      return new Response(JSON.stringify({ ok: true }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // GET — return current state (for fallback polling)
    if (req.method === "GET") {
      return new Response(JSON.stringify(this.state), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    return new Response("method not allowed", { status: 405 });
  }
}
