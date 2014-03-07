
Ext.onReady( function()
{

  var checkbox_dispatcher = new Ext.form.Checkbox(
  {
    id: 'checkbox',
    fieldLabel: 'Field dispatcher',
    plugins: [ new Common.ui.plugins.toggler.Dispatcher( { start: true } ) ]
  });

  var textfield_checkbox_observer = new Ext.form.TextField(
  {
    id: 'textfield_checkbox_observer',
    fieldLabel: 'Field observer to checkbox',
    plugins:
    [
      new Common.ui.plugins.toggler.Observer( { observers: [ { key_dispatcher: checkbox_dispatcher.getId(), value: true } ] } )
    ]
  });

  var combo = new Ext.form.ComboBox(
  {
    id: 'combo',
    fieldLabel: 'Combo dispatcher and observer',
    store: [ [ 1, 'Option 1' ], [ 2, 'Option 2' ] ],
    forceSelection: true,
    autoSelect: true,
    triggerAction: 'all',
    editable: false,
    value: 1,
    plugins:
    [
      new Common.ui.plugins.toggler.Dispatcher(),
      new Common.ui.plugins.toggler.Observer( { observers: [ { key_dispatcher: checkbox_dispatcher.getId(), value: true } ] } )
    ]
  });

  var textfield_checkbox_and_combo_observer1 = new Ext.form.TextField(
  {
    id: 'textfield_checkbox_and_combo_observer1',
    fieldLabel: 'Field observer to checkbox and combo (1)',
    plugins:
    [
      new Common.ui.plugins.toggler.Observer(
      {
        observers:
        [
          { key_dispatcher: combo.getId(), value: 1 },
          { key_dispatcher: checkbox_dispatcher.getId(), value: true }
        ]
      })
    ]
  });


  var textfield_checkbox_and_combo_observer2 = new Ext.form.TextField(
  {
    id: 'textfield_checkbox_and_combo_observer2',
    fieldLabel: 'Field observer to checkbox and combo (2)',
    plugins:
    [
      new Common.ui.plugins.toggler.Observer(
      {
        observers:
        [
          { key_dispatcher: combo.getId(), value: 2 },
          { key_dispatcher: checkbox_dispatcher.getId(), value: true }
        ]
      })
    ]
  });

  new Ext.form.FormPanel(
  {
    renderTo: Ext.getBody(),
    labelWidth: 250,
    items:
    [
      checkbox_dispatcher,
      textfield_checkbox_observer,
      combo,
      textfield_checkbox_and_combo_observer1,
      textfield_checkbox_and_combo_observer2,

      new Ext.Button(
      {
        text: 'Set checkbox value',
        handler: function(){ checkbox_dispatcher.setValue( !checkbox_dispatcher.getValue() ); }
      })
    ]
  });

});
