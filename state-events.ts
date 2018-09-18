export function initStateEvents(mqtt: any, state: any, devices: any) {
  const topicBindings: any = {};

  mqtt.on("message", (topic: string, data: any) => {
    const deviceId = topicBindings[topic].device.id;;
    const key = topicBindings[topic].key;

    state[deviceId][key] = data;
    console.log(state);
  });

  devices.forEach((d: any) => {
    if (!d.mqtt || !d.mqtt.in) return;

    Object.keys(d.mqtt.in).forEach(key => {
      const topic = d.mqtt.in[key];
      topicBindings[topic] = { device: d, key };
      mqtt.subscribe(topic);
    })
  })
}
