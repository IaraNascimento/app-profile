export default async function handler(req, res) {
  try {
    const serverModule = await import("../dist/app-admin/server/server.mjs");

    console.log("SSR exports:", Object.keys(serverModule));
    console.log("Default export:", typeof serverModule.default);
    console.log("reqHandler:", typeof serverModule.reqHandler);

    if (typeof serverModule.reqHandler === "function") {
      return serverModule.reqHandler(req, res);
    }

    if (typeof serverModule.default === "function") {
      return serverModule.default(req, res);
    }

    throw new Error("No compatible SSR handler exported");
  } catch (error) {
    console.error("Angular SSR error:", error);

    return res
      .status(500)
      .send(error instanceof Error ? error.message : "Internal Server Error");
  }
}
