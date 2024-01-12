/**
 * @see {@link ../libs/streamdeck/js/property-inspector.js}
 * @see {@link ../libs/streamdeck/js/utils.js}
 */
$PI.onConnected(jsn => {
  const { actionInfo } = jsn;
  const { payload } = actionInfo;
  const { settings } = payload;
  const form = document.getElementById('property-inspector');

  // reinstate previously entered values
  Utils.setFormValue(settings, form);

  form.addEventListener(
    'input',
    Utils.debounce(150, () => {
      const value = Utils.getFormValue(form);
      $PI.setSettings(value);
    })
  );
});
