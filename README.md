# google-assistant-mqtt

Implementation of the Google Actions Smarthome interface for MQTT.

_NOTE: requests a resync 10 seconds after boot._

You need to create 2 config files. Examples are provided.

TODO: OAuth thing is really hacky and not safe to leave running. Project just a WIP at the moment.

TODO: need to implement `willReportState:true`... believe it will be faster.

## devices.yml

Contains a list of devices with their traits.

[Refer to Device Types and Device Traits](https://developers.google.com/actions/smarthome/) to construct new devices.

- The device type seems to mostly just change the icon in the app.
- The device traits provide the commands, attributes and state available on the device.
- The documentation on device types has a good list of examples and common traits for that type, but you can mix it up as you want.
- Commands have associated phrases for triggering.

### Examples

#### Basic Switch

- The switch only has 1 trait: `OnOff`.
- The OnOff also has a command `OnOff` and a boolean state `on`.
- Turning the switch on/off via Google Assistant will call the `OnOff` command.
- When the `OnOff` command is run 2 MQTT events are fired:
  + Topic: `mqtthome/my_switch/OnOff` Body: `{"on":true}`
  + Topic: `mqtthome/my_switch/OnOff/on` Body: `true`

```yml
- id: "my_switch"
  type: "action.devices.types.SWITCH"
  traits:
    - "action.devices.traits.OnOff"
  name:
    defaultNames:
      - "my switch"
    name: "my switch"
    nicknames:
      - "my switch"
  willReportState: false
  roomHint: "Master Bedroom"
```

#### More Useful Switch

You could listen on the automatically fired events to toggle the actual switch.
Alternatively you can send additional events by setting `mqtt.out`.

- When the `OnOff` command is run an extra event is fired:
  + Topic: `switches/001/power` Body: `true`

```yml
- id: "my_switch"
  type: "action.devices.types.SWITCH"
  traits:
    - "action.devices.traits.OnOff"
  name:
    defaultNames:
      - "my switch"
    name: "my switch"
    nicknames:
      - "my switch"
  willReportState: false
  roomHint: "Master Bedroom"
  mqtt:
    out:
      "OnOff/on": "switches/001/power"
```

#### Synchronised State Switch

State is automatically remembered from past commands, but if the device is controlled from elsewhere, like a switch on the wall, we might need to sync state back.

- Assuming when a user physically toggles the switch an event on the `switches/001/power/status` is fired:
  + The `on` state will be updated to the value in the event.

```yml
- id: "my_switch"
  type: "action.devices.types.SWITCH"
  traits:
    - "action.devices.traits.OnOff"
  name:
    defaultNames:
      - "my switch"
    name: "my switch"
    nicknames:
      - "my switch"
  willReportState: false
  roomHint: "Master Bedroom"
  mqtt:
    out:
      "OnOff/on": "switches/001/power"
    in:
      "on": "switches/001/power/status"
```

### Run a Scene

The way Google intends these, I'd probably call them macros. 

```yml
- id: "scene.sleep"
  type: "action.devices.types.SCENE"
  traits:
    - "action.devices.traits.Scene"
  name:
    defaultNames:
      - "sleep scene"
      - "sleep mode"
    name: "sleep scene"
    nicknames:
      - "sleep scene"
      - "sleep mode"
  willReportState: false
  roomHint: "Scenes"
  attributes:
    sceneReversible: false
```

### Full Example

See `devices.example.yml` for more examples.

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
