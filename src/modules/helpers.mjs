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
 * @function getDisplays
 * @summary Get size and position of each display
 * @returns {Array} Displays
 */
export async function getDisplays() {
  let displaysStr = await shellCommand(`osascript applescript/displays.applescript`);

  // remove decimal place from values
  displaysStr = displaysStr.replaceAll('.0', '');

  // 0, 0, 2560, 1440, -1680, 0, 1680, 1050
  return displaysStr;
}

/**
 * @function getDesktopBounds
 * @summary Get bounds of the desktop
 * @returns {Bounds} Bounds
 */
export async function getDesktopBounds() {
  // // total size of desktop: -1680, 0, 2560, 1440
  // const boundsStr = await shellCommand(`osascript bounds/displays.applescript`);

  // if ((boundsStr === '') || (displaysStr === '')) {
  //   return {};
  // }

  // const [
  //   boundsLeft,
  //   boundsTop,
  //   boundsWidth,
  //   boundsHeight
  // ] = boundsStr.split(', ');

  /*
  TODO get vert offset of each display
  Generate radio buttons where user can choose their display 
  Adjust 0,0 relative values entered by user

  To get coordinate
  Shift + Command + 4 (SC4) = 1,1 = 90,652 (what does 1,1 mean?)
  ==> FIRST X-Y POINT = X: 90, Y: 652

  Current button = -1143,1045

  Display bounds =
  Top: 0
  Left: -1680
  Width: 2560
  Height: 1440

  Left -1680 - SC4 90 = 1590 ~= -1600
  So if relative to left edge of extended desktop then use
  DB Left + Supplied Mouse Left

  Can we get bounds of Traktor window?
  Can we get list of all display sizes?

  Settings > Display: 1680 x 1050
  Offset = DB Height 1440 - 1050 = 390
  390 + SC4 652 = 1042
  So if display size less than DB Height then use
  (DB Height - Display Height) + Supplied Mouse Top

  */
}
