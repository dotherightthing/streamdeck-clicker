import { exec } from 'node:child_process';

/**
 * @function cliclick
 * @summary Build string and run it as a shell command
 * @param {string} cmd - cliclick command
 * @param {object} settings - Settings from Stream Deck Property Inspector
 * @param {streamDeck.logger} logger - Logger class
 * @returns {boolean}
 */
export function cliclick(cmd, settings, logger) {
	const {
		easing,
		restore,
		wait,
		x,
		y
	} = settings;

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

	return;
}
