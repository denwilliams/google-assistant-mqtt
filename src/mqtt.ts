import mqttUsvc from "mqtt-usvc";

export async function createMqtt(config: {
  mqttUri: string;
  mqttBaseTopic: string;
}) {
  const service = await mqttUsvc.create({
    mqtt: {
      uri: config.mqttUri,
      prefix: config.mqttBaseTopic,
      subscriptions: []
    },
    service: {}
  });
  return service;
}
