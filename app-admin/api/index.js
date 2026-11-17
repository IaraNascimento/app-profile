let server;

export default async function handler(req, res) {
  try {
    if (!server) {
      const { app } = await import("../dist/app-admin/server/server.mjs");

      server = app();
    }

    return server(req, res);
  } catch (error) {
    console.error("Angular SSR error:", error);

    return res
      .status(500)
      .send(error instanceof Error ? error.message : "Internal Server Error");
  }
}
