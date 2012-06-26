
Ext.onReady( function()
{

  var notificator = new Common.ui.Notificator(
  {
    close_text: 'Close'
  });

 /* notificator.show_error( 'This is an error message' );
  notificator.show_success( 'This is a success message' );
  notificator.show_warning( 'This is a warning message' );

  notificator.show_by_type( 'This is an info message', 'info' );
  notificator.show_by_type( 'This is an info message', 'appointment' );*/

//  notificator.hide();


  // Show error example
  var show_error = new Ext.Button(
  {
    text: 'Show error',
    handler: function()
    {
      notificator.show_error( 'This is an error message' );
    }
  });

  // Show error as sticky example
  var show_error_sticky = new Ext.Button(
  {
    text: 'Show error as sticky',
    handler: function()
    {
      notificator.show_error( 'This is an error message', { sticky: true } );
    }
  });

  // Show success example
  var show_success = new Ext.Button(
  {
    text: 'Show success',
    handler: function()
    {
      notificator.show_success( 'This is a success message' );
    }
  });

  // Show custom icon
  var show_custom_icon = new Ext.Button(
  {
    text: 'Show custom icon',
    handler: function()
    {
      var options =
      {
        text: 'This is a message with a custom icon',
        close_button: false,
        icon:
        {
          src: 'images/user.png',
          height: '35px'
        }
      };

      notificator.show( options );
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
      show_error,
      show_error_sticky,
      show_success,
      show_custom_icon
    ]
  });

});
