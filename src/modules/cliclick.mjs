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
    displayOffsetX,
    displayOffsetY,
    easing = 0,
    restore = false,
    wait = 20,
    x1 = 0,
    y1 = 0,
    x2,
    y2,
  } = settings;

  const waitNum = ((wait === '') || (wait < 20)) ? 20 : wait;

  let command = '';

  if (((parseInt(x1) !== 'NaN') && (parseInt(y1) !== 'NaN')) || ((parseInt(x2) !== 'NaN') && (parseInt(y2) !== 'NaN'))) {
    command += 'libs/cliclick/cliclick';
    command += restore ? ' -r' : '';
    command += (easing > 0) ? ` -e ${easing}` : '';
  }

  if ((parseInt(x1) !== 'NaN') && (parseInt(y1) !== 'NaN')) {
    // TODO x1 and y1 use number inputs and number variables but without Number() are of type string
    const x1Offset = Number(x1) + Number(displayOffsetX);
    const y1Offset = Number(y1) + Number(displayOffsetY);

    // If you need to specify absolute negative values in case you have a setup with a second display arranged to the left of your main display, prefix the number with “=”, for instance “c:100,=-200”.
    const xStr1 = (x1Offset < 0) ? `=${x1Offset}` : x1Offset;
    const yStr1 = (y1Offset < 0) ? `=${y1Offset}` : y1Offset;

    command += ` m:${xStr1},${yStr1} w:${waitNum} ${cmd}:+0,+0 w:${waitNum}`;
  }

  if ((parseInt(x2) !== 'NaN') && (parseInt(y2) !== 'NaN')) {
    const x2Offset = parseInt(x2) + parseInt(displayOffsetX);
    const y2Offset = parseInt(y2) + parseInt(displayOffsetY);

    const xStr2 = (x2Offset < 0) ? `=${x2Offset}` : x2Offset;
    const yStr2 = (y2Offset < 0) ? `=${y2Offset}` : y2Offset;

    command += ` m:${xStr2},${yStr2} w:${waitNum} ${cmd}:+0,+0 w:${waitNum}`;
  }

  const output = await shellCommand(command);

  return output;
}
