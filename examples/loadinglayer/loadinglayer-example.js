
Ext.onReady( function()
{

  window.language_resources =
  {
    '':
    {
      'loading': 'Loading'
    }
  };


  // Show
  var show_button = new Ext.Button(
  {
    text: 'Show loading layer',
    handler: function()
    {
      Common.ui.loading.LoadingLayer.show();
    }
  });

  // Show with custom text
  var show_custom_button = new Ext.Button(
  {
    text: 'Show with custom text',
    handler: function()
    {
      Common.ui.loading.LoadingLayer.show( 'Custom text' );
    }
  });

  // Hide
  var hide_button = new Ext.Button(
  {
    text: 'Hide',
    handler: function()
    {
      Common.ui.loading.LoadingLayer.hide();
    }
  });


  new Ext.Panel(
  {
    renderTo: Ext.getBody(),
    style: 'margin-top: 200px;',
    width: 500,
    defaults:
    {
      style: 'margin: 10px;'
    },
    items:
    [
      show_button,
      show_custom_button,
      hide_button
    ]
  });

});
