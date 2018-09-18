const mqttUsvc = require("mqtt-usvc");

export function createMqtt(config: { mqttUri: string; mqttBaseTopic: string }) {
  const service = mqttUsvc.create({
    mqtt: {
      uri: config.mqttUri,
      // prefix: config.mqttBaseTopic,
      subscriptions: []
    },
    service: {}
  });
  return service;
}
