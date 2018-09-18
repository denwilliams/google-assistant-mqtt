const initialState: any = {
  OnOff: { on: false },
  Brightness: { brightness: 100 },
  ColorTemperature: {
    color: {
      name: "warm white",
      temperature: 25000
    }
  },
  StartStop: {
    isRunning: false,
    isPaused: false
  },
  TemperatureSetting: {
    thermostatMode: "cool",
    thermostatTemperatureSetpoint: 22
    // thermostatTemperatureSetpointHigh: 0,
    // thermostatTemperatureSetpointLow: 0,
    // thermostatTemperatureAmbient: 0,
    // thermostatHumidityAmbient: 0
  }
};

export default initialState;
