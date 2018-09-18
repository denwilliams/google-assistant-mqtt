# google-assistant-mqtt

Implementation of the Google Actions Smarthome interface for MQTT.

_NOTE: requests a resync 10 seconds after boot._

You need to create 2 config files. Examples are provided.

TODO: OAuth thing is really hacky and not safe to leave running. Project just a WIP at the moment.

## devices.yml

Contains a list of devices with their traits.

See `devices.example.yml` for an example.

```yml
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

```yml
# This is supposed to uniquely identify the account in your system.
# Makes sense for something like Hue cloud, but because you'll be the only user just make something constant.
agentUserId: mqtt-home

# Make up something for client credentials.
# You'll have to enter this in Google when setting things up.
clientId: mqtt-home
clientSecret: put_something_really_secret_here

# This is required to authenticate with Google
googleProjectId: get_from_google
# This is required to request a resync
googleApiKey: get_this_from_goole

# This is required for the OAuth flow.
# Just put something longish and random here.
code: for_hacky_oauth_thing_code
# The hacky OAuth implementation will _always_ return the same access token.
# (Even when refreshing)
accessToken: for_hacky_oauth_thing_access
# The hacky OAuth implementation will _always_ return the same refresh token.
refreshToken: for_hacky_oauth_thing_refresh

# MQTT target
mqttUri: mqtt://localhost
# Automatically published events will be prefixed with this.
mqttBaseTopic: mqtthome/
```
