import {
  smarthome,
  Headers,
  SmartHomeV1ExecuteResponse,
  SmartHomeV1QueryResponse,
  SmartHomeV1SyncResponse,
  SmartHomeV1DisconnectResponse,
  SmartHomeV1ExecuteRequest,
  SmartHomeV1QueryRequest,
  SmartHomeV1SyncRequest,
  SmartHomeV1QueryRequestInputs,
  SmartHomeV1SyncDevices,
  SmartHomeV1ExecuteResponseCommands
} from "actions-on-google";
import { BuiltinFrameworkMetadata } from "actions-on-google/dist/framework";

export async function createSmarthomeRouter(
  config: { agentUserId: string; googleApiKey: string },
  mqtt: { send: Function },
  logger: any,
  devices: any,
  state: any
) {
  const { agentUserId, googleApiKey } = config;
  // console.log(devices);

  // Create an app instance
  const app = smarthome({
    // debug: true,
    debug: false,
    key: googleApiKey
  }); // "AIzaSyAexZw0UcY70IZb8VtALL6OMdYCXxZjukk"
  // jwt: {} // needed for report state

  setTimeout(async () => {
    await app.requestSync(agentUserId);
  }, 10000);

  // Register handlers for Smart Home intents

  app.onExecute(
    async (
      body: SmartHomeV1ExecuteRequest,
      headers: Headers,
      framework: BuiltinFrameworkMetadata
    ) => {
      // logger.info("EXEC", body.inputs[0].payload.commands[0]);
      logger.info("EXEC");
      const results: SmartHomeV1ExecuteResponseCommands[] = await Promise.all(
        body.inputs[0].payload.commands.map(c => {
          const { devices: requestDevices, execution: executions } = c;
          let states;

          for (const requestDevice of requestDevices) {
            const { id, customData } = requestDevice;

            // console.log(devices);
            const device: any = devices.find((x: any) => x.id === id);
            // const { mqtt: deviceMqtt } = device;

            for (const execution of executions) {
              const { command, params } = execution;

              // this just assumes success
              states = params;

              mqtt.send(
                `${id}/${command.replace("action.devices.commands.", "")}`,
                params
              );

              state[id] = Object.assign(state[id], params);

              // const topic = deviceMqtt[command];

              // console.log(
              //   "\n",
              //   "\n",
              //   id,
              //   "->",
              //   command,
              //   "->",
              //   params,
              //   "\n",
              //   topic,
              //   "->",
              //   params,
              //   "\n",
              //   "\n"
              // );
            }
          }

          const response: SmartHomeV1ExecuteResponseCommands = {
            ids: requestDevices.map(d => d.id),
            status: "SUCCESS",
            states
          };
          return response;
        })
      );
      const response: SmartHomeV1ExecuteResponse = {
        requestId: body.requestId,
        payload: { commands: results }
      };
      return response;
    }
  );

  app.onQuery(
    (
      body: SmartHomeV1QueryRequest,
      headers: Headers,
      framework: BuiltinFrameworkMetadata
    ) => {
      logger.info("QUERY");
      const devicesInput = body.inputs
        .map(i => i.payload.devices)
        .reduce((arr, ds) => arr.concat(ds), []);

      const deviceIds = devicesInput.map(d => d.id);
      const results: any = {};
      deviceIds.forEach(id => {
        const device = devices.find((d: any) => d.id === id);

        // results[id] = { online: true, on: true, brightness: 80, color: { name: "cerulean", spectrumRGB: 31655 } };
        results[id] = state[id];
      });

      const response: SmartHomeV1QueryResponse = {
        requestId: body.requestId,
        payload: {
          devices: results
        }
      };
      return response;
    }
  );

  app.onSync(
    (
      body: SmartHomeV1SyncRequest,
      headers: Headers,
      framework: BuiltinFrameworkMetadata
    ) => {
      logger.info("SYNCING");
      // console.log(devices);
      const response: SmartHomeV1SyncResponse = {
        requestId: body.requestId,
        payload: {
          agentUserId: agentUserId,
          devices: devices.map((d: any) =>
            Object.assign({}, d, { mqtt: undefined })
          )
        }
      };
      return response;
    }
  );

  // app.onDisconnect((body, headers) => {
  //   const response: SmartHomeV1DisconnectResponse = {
  //   };
  //   return response;
  // });

  // async requestSync(agentUserId) {
  //   // this: SmartHomeApp

  //   if (!options || !this.key) {
  //     throw new Error(`An API key was not specified. ` +
  //       `Please visit https://console.cloud.google.com/apis/api/homegraph.googleapis.com/overview`)
  //   }

  //   return await makeApiCall(`/v1/devices:requestSync?key=${encodeURIComponent(this.key)}`, {
  //     agent_user_id: agentUserId,
  //   })
  // }

  return app;
}
