/// <reference path="../libs/streamdeck/js/property-inspector.js" />
/// <reference path="../libs/streamdeck/js/utils.js" />

// extract global settings values from the form
// function name emulates Utils.getFormValue
function getGlobalValue() {
  const globalInputs = document.querySelectorAll('[data-global]');
  const globalValues = {};

  globalInputs.forEach(globalInput => {
    const { global: key } = globalInput.dataset;

    globalValues[key] = globalInput.value;
  });

  console.log('getGlobalValue', JSON.stringify(globalValues));

  return globalValues;
}

// populate the form with global settings
function setGlobalValue(globalSettings) {
  console.log('setGlobalValue', JSON.stringify(globalSettings));

  const keys = Object.keys(globalSettings);

  keys.forEach(key => {
    document.querySelector(`[data-global="${key}"]`).value = globalSettings[key];
  });
}

function handleGlobalValueChange(event) {
  const oldGlobalSettings = getGlobalValue();
  const newGlobalSettings = oldGlobalSettings;

  console.log('handleGlobalValueChange', event);

  const { target } = event;

  newGlobalSettings[key] = target.value;

  console.log('setGlobalSettings', JSON.stringify(newGlobalSettings));

  $PI.setGlobalSettings(newGlobalSettings);
}

/**
 * @function handleToggleClick
 * @summary Handle user or automated click of a toggle control
 * @param {Event} ev - Event
 */
function handleToggleClick(ev) {
  console.log('handleToggleClick', ev);

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

    if (inputElement.dataset.global) {
      // get the updated global data from [data-global] elements in the form
      const value = getGlobalValue();

      $PI.setGlobalSettings(value);
    } else {
      // get the updated form data
      const value = Utils.getFormValue(form);

      // persist form data
      $PI.setSettings(value);
    }
  }

  layoutElement.removeAttribute('hidden');
}

$PI.onConnected(jsn => {
  const { actionInfo, uuid } = jsn;
  const { action, payload } = actionInfo;
  const { settings } = payload;

  console.log('jsn', JSON.stringify(jsn));

  console.log('onConnected', JSON.stringify(payload));

  const form = document.getElementById('property-inspector');
  const globalInputs = document.querySelectorAll('[data-global]'); // globalInputs may not have a name attribute else they will be included in persisted form data
  const globalSettings = $PI.getGlobalSettings();
  const toggles = document.querySelectorAll('[data-toggle-input][data-toggle-layout][data-toggle-parent]');

  console.log('globalSettings', JSON.stringify(globalSettings)); // undefined

  // reinstate values
  Utils.setFormValue(settings, form);

  // set up toggles
  toggles.forEach(toggle => {
    const { toggleInput: inputId } = toggle.dataset;
    const inputElement = document.getElementById(inputId);

    console.log('add event listener to toggle');
    toggle.addEventListener('click', handleToggleClick, { once: true });

    console.log('inputElement.value = ' + inputElement.value);
    console.log('inputElement.value type = ' + typeof inputElement.value);

    // auto-show if previously toggled
    if (inputElement.value === 'true') {
      console.log('handleToggleClick');

      handleToggleClick({
        target: toggle
      });
    }
  });

  // persist global data
  globalInputs.forEach(globalInput => {
    globalInput.addEventListener('change', Utils.debounce(150, handleGlobalValueChange));
  });

  // persist form data
  form.addEventListener('input', Utils.debounce(150, () => {
    const value = Utils.getFormValue(form);

    $PI.setSettings(value);
  }));

  // receive payload from plugin
  $PI.onDidReceiveGlobalSettings(jsn3 => { // { event, payload }
    const { payload } = jsn3;
    const { settings: globalSettings } = payload;

    setGlobalValue(globalSettings);
  });

  // receive payload from plugin
  $PI.onDidReceiveSettings(action, (jsn2) => { // { action, context, device, event, payload }
    const { payload: payload2 } = jsn2; // { controller, coordinates, isInMultiAction, settings }
    const { settings: settings2 } = payload2;

    Utils.setFormValue(settings2, form);
  });
});
