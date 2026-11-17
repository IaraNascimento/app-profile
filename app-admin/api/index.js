export default async function handler(req, res) {
  try {
    const { reqHandler } = await import("../dist/app-admin/server/server.mjs");

    return reqHandler(req, res);
  } catch (error) {
    console.error("Angular SSR error:", error);

    return res.status(500).send("Internal Server Error");
  }
}
