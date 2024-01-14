import {
	action,
	KeyDownEvent,
	SingletonAction,
	WillAppearEvent
} from "@elgato/streamdeck";

import { cliclick } from 'cliclick';

/**
 * c:x,y
 */
@action({ UUID: "com.dtrt.clicker.c" })
export class C extends SingletonAction<Settings> {
	// https://docs.elgato.com/sdk/plugins/events-received#willappear
	// void | Promise<void> - The return type of an async function or method must be the global Promise<T> type. Did you mean to write 'Promise<void>'?
	async onWillAppear(ev: WillAppearEvent<Settings>): Promise<void> {
		return ev.action.setTitle('Click');
	}

	// https://docs.elgato.com/sdk/plugins/events-received#keydown
	async onKeyDown(ev: KeyDownEvent<Settings>): Promise<void> {
		const settings = (({ easing, restore, wait, x, y }) => ({ easing, restore, wait, x, y }))(ev.payload.settings);

		await cliclick('c', settings);
	}
}

/**
 * Settings for {@link C}
 */
type Settings = {
	displayHeight: number,
	displayLeft: number,
	displayTop: number,
	displayWidth: number,
	easing: number,
	restore: boolean,
	wait: number,
	x: number,
	y: number
};
