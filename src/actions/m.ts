import {
	action,
	DidReceiveSettingsEvent,
	KeyDownEvent,
	SingletonAction,
	WillAppearEvent
} from "@elgato/streamdeck";

import { cliclick } from 'cliclick';
import { getDesktopBounds } from 'helpers';

/**
 * m:x,y
 */
@action({ UUID: "com.dtrt.clicker.m" })
export class M extends SingletonAction<Settings> {
	// https://docs.elgato.com/sdk/plugins/events-received#willappear
	// void | Promise<void> - The return type of an async function or method must be the global Promise<T> type. Did you mean to write 'Promise<void>'?
	async onWillAppear(ev: WillAppearEvent<Settings>): Promise<void> {
		return ev.action.setTitle('Move');
	}

  /**
   * @function onDidReceiveSettings
   * @summary Callback for $PI.setSettings
   * @description Receives payload from Property Inspector, processes it, sends updated payload to Property Inspector
   * @param {DidReceiveSettingsEvent} ev - DidReceiveSettingsEvent
   * @returns {Promise} Promise
   * @see {@link https://docs.elgato.com/sdk/plugins/events-sent#setsettings|$PI.setSettings} - Property Inspector updates settings from user data
   * @see {@link https://docs.elgato.com/sdk/plugins/events-received#didreceivesettings|onDidReceiveSettings} - Plugin receives payload via callback, processes it
   * @see {@link https://docs.elgato.com/sdk/plugins/events-sent#sendtopropertyinspector|sendToPropertyInspector} - Plugin sends updated payload to Property Inspector
   * @see {@link https://docs.elgato.com/sdk/plugins/events-received#sendtopropertyinspector|$PI.onSendToPropertyInspector} - Property Inspector receives updated payload via callback, processes it (there is no $PI.onDidReceiveSettings)
   */
	async onDidReceiveSettings(ev: DidReceiveSettingsEvent<Settings>): Promise<void> {
		const { payload } = ev;
		const { settings: oldSettings } = payload;
		const { showBounds } = oldSettings;

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
	
			// send payload to property inspector
			ev.action.sendToPropertyInspector(newSettings);

			// persist settings
			ev.action.setSettings(newSettings);
		}
	}

	// https://docs.elgato.com/sdk/plugins/events-received#keydown
	async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		const settings = (({ easing, restore, wait, x, y }) => ({ easing, restore, wait, x, y }))(ev.payload.settings);

		await cliclick('m', settings);
	}
}

/**
 * Settings for {@link M}.
 */
type Settings = {
	displayHeight: number,
	displayLeft: number,
	displayTop: number,
	displayWidth: number,
	easing: number,
	restore: boolean,
	showBounds: string,
	wait: number,
	x: number,
	y: number
};
