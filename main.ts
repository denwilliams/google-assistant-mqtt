import logger from "./logger";
import config from "./config";
import { createApp } from "./app";
import { loadDevices } from "./devices";
import { createMqtt } from "./mqtt";
import { initState } from "./state";
import { initStateEvents } from "./state-events";

async function main() {
  const devices = loadDevices();
  const mqtt = createMqtt(config);
  const state = initState(devices, config.dataDir);

  initStateEvents(mqtt, state, devices);
  const app = await createApp(config, mqtt, logger, devices, state);

  app.listen(3325, (err: any) => {
    if (err) console.error(err);
  });
}

main();
