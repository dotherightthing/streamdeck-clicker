import { action, KeyDownEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";
import { exec } from 'node:child_process';
import streamDeck, { LogLevel } from "@elgato/streamdeck";
const logger = streamDeck.logger.createScope("Clicker")
logger.setLevel(LogLevel.TRACE);

/**
 * t:text
 */
@action({ UUID: "com.dtrt.clicker.t" })
export class T extends SingletonAction<Settings> {
	onWillAppear(ev: WillAppearEvent<Settings>): void | Promise<void> {
		return ev.action.setTitle(`Clicker\nText`);
	}

	async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		const cmd = 't';
		const {
			text = '',
			wait
		} = ev.payload.settings;

		let shellStr = 'libs/cliclick/cliclick ';

		shellStr += `-w ${wait} `;
		shellStr += `${cmd}:'${text}'`; // If the text includes space(s), it must be enclosed in quotes.

		exec(shellStr, (error, stdout, stderr) => {
			if (error) {
				logger.error(error.message);
				return;
			}

			if (stderr) {
				logger.error(stderr);
				return;
			}

			logger.info(stdout);
		});
	}
}

/**
 * Settings for {@link T}.
 */
type Settings = {
	text: string,
	wait: number
};