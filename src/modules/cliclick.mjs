import { shellCommand } from 'helpers';

/**
 * @function cliclick
 * @summary Build string and run it as a shell command
 * @param {string} cmd - cliclick command
 * @param {object} settings - Settings from Stream Deck Property Inspector
 * @returns {string} Command output
 */
export async function cliclick(cmd, settings) {
  const {
    easing = 0,
    restore = false,
    wait = 20,
    x = 0,
    y = 0
  } = settings;

  let command = 'libs/cliclick/cliclick';

  // If you need to specify absolute negative values in case you have a setup with a second display arranged to the left of your main display, prefix the number with “=”, for instance “c:100,=-200”.
  let xStr = (x < 0) ? `=${x}` : x;
  let yStr = (y < 0) ? `=${y}` : y;

  command += restore ? ' -r' : '';
  command += (easing > 0) ? ` -e ${easing}` : '';
  command += ` -w ${wait}`;
  command += ` ${cmd}:${xStr},${yStr}`;

  return await shellCommand(command);
}
