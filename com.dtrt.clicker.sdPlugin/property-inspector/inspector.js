/// <reference path="../libs/streamdeck/js/property-inspector.js" />
/// <reference path="../libs/streamdeck/js/utils.js" />

// const onChange = new Event('change');

/**
 * @function generateDisplayRadio
 * @summary Generate a radio button to select the desired display monitor
 * @param {Array} display - Display
 * @param {number} index - Index
 * @returns {HTMLElement} label - Label wrapping radio button
 */
function generateDisplayRadio(display, index) {
  const [ , , width, height ] = display;

  const widthNum = parseInt(width);
  const heightNum = parseInt(height);

  const label = document.createElement('label');
  const labelText = document.createTextNode(`Display ${index + 1} (${widthNum} x ${heightNum})`);
  const radio = document.createElement('input');

  radio.setAttribute('type', 'radio');
  radio.setAttribute('name', 'displaySelection');
  radio.setAttribute('id', `display-selection-${index}`)
  radio.setAttribute('value', display.toString());

  label.appendChild(labelText);
  label.appendChild(radio);

  return label;
}

/**
 * @function generateDisplayRadios
 * @summary Generate radio buttons to select the desired display monitor
 * @param {string} displaysStr - Comma separated list of displays and their properties
 */
function generateDisplayRadios(displaysStr) {
  const displayRadios = document.getElementsByName('displaySelection');

  if (displayRadios.length) {
    return;
  }

  // eslint-disable-next-line no-use-before-define
  const displaysOrderedByOffsetX = getDisplaysOrderedByOffsetX(displaysStr);

  const displayAlignmentRadios = document.getElementsByName('displayAlignment');

  displayAlignmentRadios.forEach(displayAlignmentRadio => {
    // eslint-disable-next-line no-use-before-define
    displayAlignmentRadio.addEventListener('change', Utils.debounce(150, handleDisplayArrangementRadioChange));
  });

  displaysOrderedByOffsetX.forEach((display, i) => {
    const radio = generateDisplayRadio(display, i);
    const radiosContainer = document.getElementById('displays-radios');

    // when checked, store the values for the selected radio so they can be accessed by cliclick.mjs
    // eslint-disable-next-line no-use-before-define
    radio.addEventListener('change', Utils.debounce(150, handleDisplayRadioChange));

    radiosContainer.appendChild(radio);
  });
}

/**
 * @function getDisplayArrays
 * @summary Generated nested arrays from comma separated string value generated by applescript
 * @param {string} displaysStr - Displays as a comma separated string (0.0, 0.0, 2560.0, 1440.0, -1680.0, 0.0, 1680.0, 1050.0)
 * @returns {Array} array of arrays
 */
function getDisplayArrays(displaysStr) {
  const displays = displaysStr.split(', ');
  const chunkSize = 4;

  // [ [ 0.0, 0.0, 2560.0, 1440.0 ], [ -1680.0, 0.0, 1680.0, 1050.0 ] ]
  return displays
    .map((element, index) => index % chunkSize === 0 ? displays.slice(index, index + chunkSize) : null)
    .filter(el => el !== null);
}

/**
 * @function getDisplaysOrderedByHeight
 * @summary Order displays for determining y offset of shorter display
 * @param {string} displaysStr - Displays as a comma separated string
 * @returns {Array} array of arrays
 */
function getDisplaysOrderedByHeight(displaysStr) {
  const displayArrs = getDisplayArrays(displaysStr);

  // [ [ 0.0, 0.0, 2560.0, 1440.0 ], [ -1680.0, 0.0, 1680.0, 1050.0 ] ]
  return [ ...displayArrs ].sort((a, b) => Number(b[3]) - Number(a[3]));
}

/**
 * @function getDisplaysOrderedByOffsetX
 * @summary Order displays for generating display radios arranged from left to right
 * @param {string} displaysStr - Displays as a comma separated string
 * @returns {Array} array of arrays
 */
function getDisplaysOrderedByOffsetX(displaysStr) {
  const displayArrs = getDisplayArrays(displaysStr);

  // [ [ -1680.0, 0.0, 1680.0, 1050.0 ], [ 0.0, 0.0, 2560.0, 1440.0 ] ]
  return [ ...displayArrs ].sort((a, b) => Number(a[0]) - Number(b[0]));
}

/**
 * @function handleFormInput
 * @summary Handle user input into form
 * @param {Event} ev - Event
 */
function handleFormInput(ev) {
  const form = document.getElementById('property-inspector');

  // radios handled separately as they set other input values first
  if (ev.target.name === 'displaySelection') {
    return;
  }

  const settings = Utils.getFormValue(form);

  $PI.setSettings(settings);
}

/**
 * @function handleDisplayArrangementRadioChange
 * @summary Handle user or automated click of one of the Display arrangement buttons
 * @param {Event} ev - Event
 * @todo Support values other than flush-top and flush-bottom (#16)
 */
function handleDisplayArrangementRadioChange(ev) {
  const form = document.getElementById('property-inspector');
  const selectedDisplayRadio = [ ...document.getElementsByName('displaySelection') ].filter(el => el.checked);

  const radio = selectedDisplayRadio[0];

  // copy of code from handleDisplayRadioChange
  const settings = Utils.getFormValue(form);
  const { displays, displayAlignment } = settings; // displays is set by c.ts applescript

  const [ offsetX, , width, height ] = radio.value.split(',');

  const displaysOrderedByHeight = getDisplaysOrderedByHeight(displays);

  const [ , , , tallestHeight ] = displaysOrderedByHeight[0];

  const newSettings = Object.assign(settings, {
    displayOffsetX: parseInt(offsetX),
    displayOffsetY: (displayAlignment === 'bottom') ? parseInt(tallestHeight) - parseInt(height) : 0,
    displayWidth: parseInt(width),
    displayHeight: parseInt(height)
  });

  // if user clicked button then update the settings
  // otherwise use the settings from last time the button was clicked
  // else infinite loop because $PI.setSettings calls onDidReceiveSettings which calls $PI.onDidReceiveSettings
  if (ev.isTrusted) {
    $PI.setSettings(newSettings);
  }
}

/**
 * @function handleDisplayRadioChange
 * @summary Handle user or automated click of one of the Display selection buttons
 * @param {Event} ev - Event
 */
function handleDisplayRadioChange(ev) {
  const form = document.getElementById('property-inspector');
  const radio = ev.target;
  const settings = Utils.getFormValue(form);
  const { displays, displayAlignment } = settings; // displays is set by c.ts applescript

  const [ offsetX, , width, height ] = radio.value.split(',');

  const displaysOrderedByHeight = getDisplaysOrderedByHeight(displays);

  const [ , , , tallestHeight ] = displaysOrderedByHeight[0];

  const newSettings = Object.assign(settings, {
    displayOffsetX: parseInt(offsetX),
    displayOffsetY: (displayAlignment === 'bottom') ? parseInt(tallestHeight) - parseInt(height) : 0,
    displayWidth: parseInt(width),
    displayHeight: parseInt(height)
  });

  // if user clicked button then update the settings
  // otherwise use the settings from last time the button was clicked
  // else infinite loop because $PI.setSettings calls onDidReceiveSettings which calls $PI.onDidReceiveSettings
  if (ev.isTrusted) {
    $PI.setSettings(newSettings);
  }
}

/**
 * @function handleToggleClick
 * @summary Handle user or automated click of a toggle control
 * @param {Event} ev - Event
 */
function handleToggleClick(ev) {
  const form = document.getElementById('property-inspector');
  const toggle = ev.target;
  const {
    toggleInput: inputId,
    toggleLayout: layoutId,
    toggleParent: parentId
  } = toggle.dataset;
  const inputElement = document.getElementById(inputId);
  const layoutElement = document.getElementById(layoutId);
  const parentElement = document.getElementById(parentId);

  // data-toggle-parent

  toggle.setAttribute('disabled', true);
  parentElement.setAttribute('hidden', true);

  if (inputElement.value !== 'true') {
    // set flag for processing in plugin callback
    inputElement.value = 'true';

    // get the updated form data
    const settings = Utils.getFormValue(form);

    // persist form data
    $PI.setSettings(settings);
  }

  layoutElement.removeAttribute('hidden');
}

$PI.onConnected(jsn => {
  const { actionInfo } = jsn;
  const { action, payload } = actionInfo;
  const { settings } = payload;
  const form = document.getElementById('property-inspector');
  const toggles = document.querySelectorAll('[data-toggle-input][data-toggle-layout]');

  // reinstate values
  Utils.setFormValue(settings, form);

  // set up toggles onload
  toggles.forEach(toggle => {
    const { toggleInput: inputId } = toggle.dataset;
    const inputElement = document.getElementById(inputId);

    toggle.addEventListener('click', handleToggleClick, { once: true });

    // auto-show if previously toggled
    if (inputElement.value === 'true') {
      toggle.click();
    }
  });

  // persist form data
  form.addEventListener('input', Utils.debounce(150, handleFormInput));

  const { showDisplays, displays, displayOffsetX, displayWidth, displayHeight } = settings;

  if ((showDisplays === 'true') && (displays !== '')) {
    generateDisplayRadios(displays);

    if ((parseInt(displayWidth) !== 'NaN') && (parseInt(displayHeight) !== 'NaN')) {
      // displayOffsetY is generated so that value won't ever match the raw data of zero
      const displayOffsetY = 0;

      const selectRadioWithValue = [
        displayOffsetX,
        displayOffsetY,
        displayWidth,
        displayHeight
      ].toString();

      const radioToSelect = document.querySelector(`[name="displaySelection"][value="${selectRadioWithValue}"]`);

      radioToSelect.checked = true;
      // radioToSelect.dispatchEvent(onChange); // may be redundant as fields already populated
    }
  }

  // receive payload from plugin eg c.ts after it has run the applescript
  $PI.onDidReceiveSettings(action, (jsn2) => { // { action, context, device, event, payload }
    const { payload: payload2 } = jsn2; // { controller, coordinates, isInMultiAction, settings }
    const { settings: settings2 } = payload2;
    const form = document.getElementById('property-inspector');

    // displays is a hidden input which captures applescript output as a comma separated string
    const { displays } = settings2;

    generateDisplayRadios(displays);

    Utils.setFormValue(settings2, form); // triggered by radio onChange
  });
});
