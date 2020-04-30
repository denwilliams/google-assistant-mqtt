import { readFile, writeFile, existsSync } from "fs";
import { join } from "path";
import { promisify } from "util";

import states from "./initial-state";

const readFileAsync = promisify(readFile);

export async function initState(devices: any, dataDir: string) {
  // console.log("init devices", devices);

  const jsonPath = join(dataDir, "state.json");
  const loaded = existsSync(jsonPath)
    ? JSON.parse(await readFileAsync(jsonPath, "utf8"))
    : {};

  const state: any = devices.reduce((obj: any, device: any) => {
    const initial = device.traits
      .map((t: any) => t.replace("action.devices.traits.", ""))
      .reduce(
        (s: any, t: string) => Object.assign(s, states[t] || {}),
        loaded[device.id] || {
          online: true
        }
      );

    obj[device.id] = initial;
    return obj;
  }, {});

  // console.log(state);
  // setInterval(() => console.log(state), 10000);
  setInterval(
    () =>
      writeFile(jsonPath, JSON.stringify(state), err => {
        if (err) console.error(err);
      }),
    60000
  );

  return state;
}
