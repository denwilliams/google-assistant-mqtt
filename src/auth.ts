import { Router } from "express";
import { urlencoded } from "body-parser";

export function createAuthRouter(
  config: {
    clientId: string;
    clientSecret: string;
    accessToken: string;
    refreshToken: string;
    code: string;
    googleProjectId: string;
  },
  logger: any
) {
  const router = Router();

  router.get("/", (req, res) => {
    const { client_id, redirect_uri, response_type, scope, state } = req.query;
    console.log("DEBUG", client_id, redirect_uri, response_type, scope, state);

    if (client_id !== config.clientId) {
      return res.status(401).send("invalid client_id");
    }

    if (
      redirect_uri !==
      `https://oauth-redirect.googleusercontent.com/r/${config.googleProjectId}`
    ) {
      return res.status(401).send("invalid redirect_uri");
    }

    if (response_type !== "code") {
      return res.status(500).send("Unexpected response_type " + response_type);
    }

    res.redirect(redirect_uri + `?code=${config.code}&state=${state}`);
  });

  router.post("/token", urlencoded({ extended: false }), (req, res) => {
    console.log("TOKEN", req.body);
    const {
      client_id,
      client_secret,
      grant_type,
      code,
      refresh_token
    } = req.body;

    if (
      client_id !== config.clientId ||
      client_secret !== config.clientSecret
    ) {
      return res.send(400).json({ error: "invalid_grant" });
    }

    if (grant_type === "authorization_code") {
      if (code !== config.code) {
        return res.send(400).json({ error: "invalid_grant" });
      }
      res.json({
        token_type: "Bearer",
        access_token: config.accessToken,
        refresh_token: config.refreshToken,
        expires_in: 60000
      });
    } else if (grant_type === "refresh_token") {
      if (refresh_token !== config.refreshToken) {
        return res.send(400).json({ error: "invalid_grant" });
      }
      res.json({
        token_type: "Bearer",
        access_token: config.accessToken,
        expires_in: 60000
      });
    } else {
      res.send(400).json({ error: "invalid_grant" });
    }
  });

  return router;
}
