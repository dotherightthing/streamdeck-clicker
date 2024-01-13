/// <reference path="../libs/streamdeck/js/property-inspector.js" />
/// <reference path="../libs/streamdeck/js/utils.js" />

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
    const value = Utils.getFormValue(form);

    // persist form data
    $PI.setSettings(value);
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

  // set up toggles
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
  form.addEventListener('input', Utils.debounce(150, () => {
    const value = Utils.getFormValue(form);

    $PI.setSettings(value);
  }));

  // receive payload from plugin
  $PI.onDidReceiveSettings(action, (jsn2) => { // { action, context, device, event, payload }
    const { payload: payload2 } = jsn2; // { controller, coordinates, isInMultiAction, settings }
    const { settings: settings2 } = payload2;

    Utils.setFormValue(settings2, form);
  });
});
