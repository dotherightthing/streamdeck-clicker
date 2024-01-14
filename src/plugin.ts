import streamDeck, {
  DidReceiveGlobalSettingsEvent,
  SettingsClient
} from '@elgato/streamdeck'; // streamDeck, { LogLevel }

import { C } from './actions/c';
import { DC } from './actions/dc';
import { M } from './actions/m';
import { RC } from './actions/rc';
import { TC } from './actions/tc';

import { getDesktopBounds } from 'helpers';

export class PluginSettings extends SettingsClient<GlobalSettings> {
	async onDidReceiveGlobalSettings(ev: DidReceiveGlobalSettingsEvent<GlobalSettings>): Promise<void> {
		const { payload } = ev;
		const { settings } = payload;
		const { showBounds } = settings;

		const oldSettings = ev.action.getSettings();

		if (showBounds === 'true') {
			const {
				left: displayLeft,
				top: displayTop,
				width: displayWidth,
				height: displayHeight
			} = await getDesktopBounds();
	
			const newSettings = Object.assign(oldSettings, {
				displayLeft,
				displayTop,
				displayWidth,
				displayHeight
			});
	
			// persist settings
			// property inspector runs callback
			ev.action.setSettings(newSettings);
	}
}

// Enable 'trace' logging so that all messages between the Stream Deck and the plugin are recorded
// streamDeck.logger.setLevel(LogLevel.TRACE);

// Register the actions.
streamDeck.actions.registerAction(new C());
streamDeck.actions.registerAction(new DC());
streamDeck.actions.registerAction(new M());
streamDeck.actions.registerAction(new RC());
streamDeck.actions.registerAction(new TC());

// Connect to the Stream Deck.
streamDeck.connect();

/**
 * Settings for {@link C}
 */
type GlobalSettings = {
	showBounds: string
}
