import jsYaml from "js-yaml";
import { readFile } from "fs";
import { join } from "path";
import { promisify } from "util";

const readFileAsync = promisify(readFile);

// import { states } from "./states";
// import { traitsConfig } from "./traits";

export async function loadDevices() {
  const contents = await readFileAsync(join(__dirname, "devices.yml"), "utf8");
  const devices = jsYaml.safeLoad(contents);

  // devices.forEach((d: any) => {
  //   const { mqtt, traits } = d;
  //   const { states: mqttStates, commands: mqttCommands } = mqtt;
  //   console.log(d.id, traits, mqttStates, mqttCommands);

  //   traits
  //     .map((trait: string) => trait.replace("action.devices.traits.", ""))
  //     .forEach((trait: string) => {
  //       console.log("\n", trait, traitsConfig);
  //       const conf = (traitsConfig as any)[trait];
  //       const { state, commands } = conf;
  //       console.log(d.id, state, commands);
  //     });
  // });

  return [...devices];
}
