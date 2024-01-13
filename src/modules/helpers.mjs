import { execa } from 'execa';
import streamDeck from "@elgato/streamdeck";
const logger = streamDeck.logger.createScope("Clicker")

/**
 * @typedef {object} Bounds
 * @property {number} left - The distance in pixels from the left side of the screen to the left side of the Finder window. This will be negative if a second display is arranged to the left of your main display.
 * @property {number} top - The distance in pixels from the top of the screen to the top of the Finder window.
 * @property {number} width - The distance in pixels from the left side of the screen to the right side of the Finder window.
 * @property {number} height - The distance in pixels from the top of the (tallest) screen to the bottom of the Finder window.
 * @see {@link https://macosxautomation.com/applescript/firsttutorial/11.html}
 */

/**
 * @function shellCommand
 * @param {string} command - Command to run
 * @returns {string} Command output
 */
export async function shellCommand(command) {
  // https://github.com/sindresorhus/execa#handling-errors
  try {
    const { stdout } = await execa(command, { shell: true });

    return stdout;
  } catch (error) {
    logger.error(error); // error|info|warn

    return '';
  }
}

/**
 * @function getDesktopBounds
 * @summary Get bounds of the desktop
 * @returns {Bounds} Bounds
 */
export async function getDesktopBounds() {
  const command = `osascript -e 'tell app "Finder" to get bounds of window of desktop'`;
  const boundsStr = await shellCommand(command);

  let bounds = {};

  if (boundsStr !== '') {
    const [ left, top, width, height ] = boundsStr.split(', ');

    bounds = {
      left,
      top,
      width,
      height
    };
  }

  return bounds;
}
