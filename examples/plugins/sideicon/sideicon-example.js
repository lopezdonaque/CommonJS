
Ext.onReady( function()
{

  var textfield = new Ext.form.TextField(
  {
    fieldLabel: 'TextField',
    allowBlank: false,
    plugins:
    [
      new Common.ui.plugins.field.SideIcon(
      {
        iconConfig:
        {
          cls: 'x-tool x-tool-help',
          clsOnOver: 'x-tool-help-over',
          tooltip: 'Tooltip text'
        },
        listeners:
        {
          click: function( field )
          {
            alert( 'On icon click' );
          }
        }
      })
    ]
  });


  var datefield = new Ext.form.DateField(
  {
    fieldLabel: 'DateField (TriggerField)',
    allowBlank: false,
    plugins:
    [
      new Common.ui.plugins.field.SideIcon(
      {
        iconConfig:
        {
          cls: 'x-tool x-tool-help',
          clsOnOver: 'x-tool-help-over',
          tooltip: 'Tooltip text'
        },
        listeners:
        {
          click: function( field )
          {
            alert( 'On icon click' );
          }
        }
      })
    ]
  });


  new Ext.form.FormPanel(
  {
    renderTo: Ext.getBody(),
    defaults: { msgTarget: 'side' },
    items:
    [
      textfield,
      datefield
    ]
  });

});
