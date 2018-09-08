import { Handler } from "express";
import express from "express";

// Import the appropriate service
import { json } from "body-parser";
import { createAuthRouter } from "./auth";
import { createSmarthomeRouter } from "./smarthome";

export async function createApp(
  config: {
    agentUserId: string;
    clientId: string;
    clientSecret: string;
    accessToken: string;
    refreshToken: string;
    code: string;
    googleProjectId: string;
    googleApiKey: string;
  },
  mqtt: { send: Function },
  logger: any,
  devices: any,
  state: any
) {
  const authRouter = createAuthRouter(config, logger);
  const smarthomeRouter = await createSmarthomeRouter(
    config,
    mqtt,
    logger,
    devices,
    state
  );

  const auth: Handler = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) res.status(401).send();
    next();
  };

  const app = express()
    .use(json())
    .use("/auth", authRouter)
    .post("/fulfillment", auth, smarthomeRouter);

  return app;
}
