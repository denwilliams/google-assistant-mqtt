export function initState(devices: any) {
  // console.log("devices", devices);

  const state: any = devices.reduce((obj: any, device: any) => {
    obj[device.id] = { online: true };
    return obj;
  }, {});

  setInterval(() => console.log(state), 10000);

  return state;
}
