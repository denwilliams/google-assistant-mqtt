# google-assistant-mqtt

Implementation of the Google Actions Smarthome interface for MQTT.

_NOTE: requests a resync 10 seconds after boot._

You need to create 2 config files. Examples are provided.

TODO: OAuth thing is really hacky and not safe to leave running. Project just a WIP at the moment.

## devices.yml

Contains a list of devices with their traits.

See `devices.example.yml` for an example.

```
- id: "light.white"
  type: "action.devices.types.LIGHT"
  traits:
    - "action.devices.traits.OnOff"
    - "action.devices.traits.Brightness"
  name:
    defaultNames:
      - "light one"
    name: "my light one"
    nicknames:
      - "my number 1 light"
  willReportState: false
  roomHint: "my room"
- id: "light.color"
  type: "action.devices.types.LIGHT"
  traits:
    - "action.devices.traits.OnOff"
    - "action.devices.traits.Brightness"
    - "action.devices.traits.ColorSpectrum"
    - "action.devices.traits.ColorTemperature"
  name:
    defaultNames:
      - "light two"
    name: "my light two"
    nicknames:
      - "my number 2 light"
  willReportState: false
  roomHint: "my room"
  attributes:
    temperatureMinK: 2000
    temperatureMaxK: 6500
    colorModel: "rgb"
```

## config.yml

Contains config for the service.

See `config.example.yml` for an example.

```
agentUserId: mqtt-home
clientId: mqtt-home
clientSecret: put_something_really_secret_here
googleApiKey: get_this_from_goole
code: for_hacky_oauth_thing_code
accessToken: for_hacky_oauth_thing_access
refreshToken: for_hacky_oauth_thing_refresh
googleProjectId: get_from_google
mqttUri: mqtt://localhost
mqttBaseTopic: mqtthome/
```
