import {
  action,
  DidReceiveSettingsEvent,
  KeyDownEvent,
  SingletonAction
} from "@elgato/streamdeck";

import { cliclick } from 'cliclick';
import { getDesktopBounds } from 'helpers';

/**
 * Settings for {@link RC}
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
	x1: number,
	y1: number,
	x2: number,
	y2: number
};

/**
 * rc:x,y
 */
@action({ UUID: "com.dtrt.clicker.rc" })
export class RC extends SingletonAction<Settings> {
  /**
   * @function onDidReceiveSettings
   * @summary Callback for $PI.setSettings
   * @description Receives payload from Property Inspector, processes it, sends updated payload to Property Inspector
   * @param {DidReceiveSettingsEvent} ev - DidReceiveSettingsEvent
   * @returns {Promise} Promise
   * @see {@link https://docs.elgato.com/sdk/plugins/events-sent#setsettings} - Property Inspector persists form data in settings ($PI.setSettings)
   * @see {@link https://docs.elgato.com/sdk/plugins/events-received#didreceivesettings} - Plugin receives settings in callback payload (onDidReceiveSettings)
   * @see {@link https://docs.elgato.com/sdk/plugins/events-sent#setsettings} - Plugin updates settings, persists updated settings (setSettings)
   * @see {@link https://docs.elgato.com/sdk/plugins/events-received#didreceivesettings} - Property Inspector receives updated settings in callback payload ($PI.onDidReceiveSettings)
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

      // persist settings
      // property inspector runs callback
      ev.action.setSettings(newSettings);
    }
  }

  // https://docs.elgato.com/sdk/plugins/events-received#keydown
  async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
    const settings = (({ easing, restore, wait, x1, y1, x2, y2 }) => ({ easing, restore, wait, x1, y1, x2, y2 }))(ev.payload.settings);

    await cliclick('rc', settings);
  }
}
