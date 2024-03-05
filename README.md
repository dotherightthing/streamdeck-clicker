# streamdeck-clicker

Stream Deck plugin to automate the mouse in macOS.

## Development

### Install

```sh
streamdeck link com.dtrt.clicker.sdPlugin/
```

If you receive the error *Linking failed* due to a UUID clash

```sh
cd ~/Library/Application\ Support/com.elgato.StreamDeck/plugins/ && unlink com.dtrt.clicker.sdPlugin/
```

### Watch for code changes

```sh
# rebuild and restart the plugin after code changes
# note: you may have to delete the instance from the button and drag a new one in to see changes to `States` or Property Inspector
npm run watch
```

To quit Stream Deck app, use the icon in the top right menu bar.

### Logging

#### Node

```ts
import streamDeck, { LogLevel } from "@elgato/streamdeck";
const logger = streamDeck.logger.createScope("Clicker")
logger.setLevel(LogLevel.TRACE);

logger.error('...');
logger.info('...');
```

#### Frontend

```js
console.log('...');
```

1. Open Property Inspector inside Stream Deck
2. View the console at <http://localhost:23654/>
3. Select *com.dtrt.clicker Property Inspector*

### Debug UI

The default debugger is available at <http://localhost:23654/> but it can be slow to debug layout here.

Since all paths are relative, another option is to open `/com.dtrt.clicker.sdPlugin/property-inspector/inspector.html` directly in a web browser.

## Links

* [Create a Stream Deck Plugin to Interact with Webhooks](https://www.thepolyglotdeveloper.com/2020/07/create-stream-deck-plugin-interact-webhooks/)
* [streamdeck-plugin-template](https://github.com/elgatosf/streamdeck-plugin-template) - official frontend JS template
* How to add the library to plugins incl those using the Node SDK: [Get the latest library: Add Submodule](https://github.com/elgatosf/streamdeck-plugin-template#add-submodule)
* [SDK documentation](https://docs.elgato.com/sdk/plugins/overview)
* Plugin showing all supported HTML elements: [Samples: PISamples](https://docs.elgato.com/sdk/plugins/samples/pisamples)
* [Marketplace Makers Discord channel](https://discord.gg/GehBUcu627)
* [MVF1-Streamdeck](https://github.com/f1-tools/MVF1-Streamdeck/blob/main/com.f1-tools.mvf1.sdPlugin/actions/property-inspector/inspector.js) shows how Property Inspector events are done

## Tips

* Node methods are namedspaced, see `com.dtrt.clicker.sdPlugin/bin/plugin.js`

## Attributions

* [v5.1](https://github.com/BlueM/cliclick/releases/tag/5.1) of [cliclick](https://github.com/BlueM/cliclick) - thanks @BlueM for a wonderful library!
* [@elgato/cli](https://github.com/elgatosf/cli) for plugin scaffolding
* [Stream Deck SDK for Node.js (Beta)](https://github.com/elgatosf/streamdeck)
* [Pure CSS Custom Checkbox Style](https://moderncss.dev/pure-css-custom-checkbox-style/)
* Icons created using [Button Creator for Stream Deck](https://apps.apple.com/us/app/button-creator-for-stream-deck/id1559303865?mt=12)l, [SF Symbols](https://developer.apple.com/sf-symbols/) and [Inkscape](https://inkscape.org/)