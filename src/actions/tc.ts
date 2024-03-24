import {
  action,
  DidReceiveSettingsEvent,
  KeyDownEvent,
  SingletonAction
} from "@elgato/streamdeck";

import { cliclick } from 'cliclick';
import { getDisplays } from 'helpers';

/**
 * Settings for {@link TC}
 */
type Settings = {
  displays: string,
	displayLeft: number,
  displayOffsetX: number,
  displayOffsetY: number,
  displayWidth: number,
  displayHeight: number,
	displayTop: number,
	easing: number,
	restore: boolean,
	showDisplays: string,
	wait: number,
	x: number,
	y: number,
	x1: number,
	y1: number,
	x2: number,
	y2: number
};

/**
 * tc:x,y
 */
@action({ UUID: "com.dtrt.clicker.tc" })
export class TC extends SingletonAction<Settings> {
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
    const { showDisplays } = oldSettings;

    let displays = '';

    if (showDisplays === 'true') {
      displays = await getDisplays();

      const newSettings = Object.assign(oldSettings, {
        displays
      });

      // persist settings
      // property inspector runs callback
      ev.action.setSettings(newSettings);
    }
  }

  // https://docs.elgato.com/sdk/plugins/events-received#keydown
  async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
    const settings = (({
      displayOffsetX,
      displayOffsetY,
      displayWidth,
      displayHeight,
      easing,
      restore,
      wait,
      x1,
      y1,
      x2,
      y2
    }) => ({
      displayOffsetX,
      displayOffsetY,
      displayWidth,
      displayHeight,
      easing,
      restore,
      wait,
      x1,
      y1,
      x2,
      y2
    }))(ev.payload.settings);

    await cliclick('tc', settings);
  }
}
