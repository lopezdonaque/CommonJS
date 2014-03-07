
Ext.onReady( function()
{

  var textfield_top = new Ext.form.TextField(
  {
    fieldLabel: 'Field top',
    allowBlank: false,
    plugins:
    [
      new Common.ui.plugins.field.HelpText(
      {
        text: 'Help text with top alignment',
        align: 'top'
      })
    ]
  });


  var textfield_bottom = new Ext.form.TextField(
  {
    fieldLabel: 'Field bottom',
    allowBlank: false,
    plugins:
    [
      new Common.ui.plugins.field.HelpText(
      {
        text: 'Help text with bottom alignment',
        align: 'bottom'
      })
    ]
  });


  var textfield_top_and_bottom = new Ext.form.TextField(
  {
    fieldLabel: 'Field top and bottom',
    allowBlank: false,
    plugins:
    [
      new Common.ui.plugins.field.HelpText(
      {
        text: 'Help text with top alignment',
        align: 'top'
      }),

      new Common.ui.plugins.field.HelpText(
      {
        text: 'Help text with bottom alignment',
        align: 'bottom'
      })
    ]
  });


  new Ext.form.FormPanel(
  {
    renderTo: Ext.getBody(),
    items:
    [
      textfield_top,
      textfield_bottom,
      textfield_top_and_bottom
    ]
  });

});
