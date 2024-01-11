import { action, KeyDownEvent, SingletonAction, WillAppearEvent } from "@elgato/streamdeck";
import { exec } from 'node:child_process';
import streamDeck, { LogLevel } from "@elgato/streamdeck";
const logger = streamDeck.logger.createScope("Clicker")
logger.setLevel(LogLevel.TRACE);

/**
 * rc:x,y
 */
@action({ UUID: "com.dtrt.clicker.rc" })
export class RC extends SingletonAction<Settings> {
	onWillAppear(ev: WillAppearEvent<Settings>): void | Promise<void> {
		return ev.action.setTitle(`Clicker\nRight-click`);
	}

	async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		const cmd = 'rc';
		const {
			easing,
			restore,
			wait,
			x,
			y
		} = ev.payload.settings;

		let shellStr = 'libs/cliclick/cliclick ';

		shellStr += restore ? '-r ' : '';
		shellStr += (easing > 0) ? `-e ${easing} ` : '';
		shellStr += `-w ${wait} `;
		shellStr += `${cmd}:=${x},=${y}`;

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
 * Settings for {@link RC}
 */
type Settings = {
	easing: number,
	restore: boolean,
	wait: number,
	x: number,
	y: number
};
