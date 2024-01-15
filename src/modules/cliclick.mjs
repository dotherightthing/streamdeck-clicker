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
    x1 = 0,
    y1 = 0,
    x2 = '',
    y2 = '',
  } = settings;

  const waitNum = ((wait === '') || (wait < 20)) ? 20 : wait;
  let command = 'libs/cliclick/cliclick';

  // If you need to specify absolute negative values in case you have a setup with a second display arranged to the left of your main display, prefix the number with “=”, for instance “c:100,=-200”.
  const xStr1 = (x1 < 0) ? `=${x1}` : x1;
  const yStr1 = (y1 < 0) ? `=${y1}` : y1;

  command += restore ? ' -r' : '';
  command += (easing > 0) ? ` -e ${easing}` : '';
  command += ` m:${xStr1},${yStr1} w:${waitNum} ${cmd}:+0,+0 w:${waitNum}`;

  if ((x2 !== '') && (y2 !== '')) {
    const xStr2 = (x2 < 0) ? `=${x2}` : x2;
    const yStr2 = (y2 < 0) ? `=${y2}` : y2;

    command += ` m:${xStr2},${yStr2} w:${waitNum} ${cmd}:+0,+0 w:${waitNum}`;
  }

  const output = await shellCommand(command);

  return output;
}
