import jsYaml from "js-yaml";
import { readFileSync } from "fs";
import { join } from "path";
const yamlConfig = jsYaml.safeLoad(
  readFileSync(join(__dirname, "config.yml"), "utf8")
);

const baseConfig = {};

const envConfig: any = {};
if (process.env.CLIENT_ID) {
  envConfig.clientId = process.env.CLIENT_ID;
}

const config = Object.assign({}, baseConfig, yamlConfig, envConfig);

// 290897619818-4m5i9minm7q6bpsackvst5iulhptf5h8.apps.googleusercontent.com
// 49X_a894e6xKipxKD3lG5smT

export default config;
