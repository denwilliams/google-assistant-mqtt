import jsYaml from "js-yaml";
import { readFileSync } from "fs";
import { join } from "path";

// import { states } from "./states";
// import { traitsConfig } from "./traits";

export function loadDevices() {
  const devices = jsYaml.safeLoad(
    readFileSync(join(__dirname, "devices.yml"), "utf8")
  );

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
