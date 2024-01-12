import { action, KeyDownEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";
import streamDeck, { LogLevel } from "@elgato/streamdeck";
const logger = streamDeck.logger.createScope("Clicker")
logger.setLevel(LogLevel.TRACE);

import { cliclick } from 'cliclick';

/**
 * rc:x,y
 */
@action({ UUID: "com.dtrt.clicker.rc" })
export class RC extends SingletonAction<Settings> {
	onWillAppear(ev: WillAppearEvent<Settings>): void | Promise<void> {
		return ev.action.setTitle(`Right-click`);
	}

	async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		const settings = (({ easing, restore, wait, x, y }) => ({ easing, restore, wait, x, y }))(ev.payload.settings);

		cliclick('rc', settings, logger);
	}
}

/**
 * Settings for {@link RC}
 */
type Settings = {
	easing: number,
	restore: boolean,
	wait: number,
	x: number,
	y: number
};
