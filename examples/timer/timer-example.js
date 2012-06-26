
Ext.onReady( function()
{

  new Ext.Panel(
  {
    renderTo: Ext.getBody(),
    items:
    [
      {
        height: 50,
        html : '<div id="clock">--:--:--</div>'
      },

      {
        items:
        [
          new Ext.Button(
          {
            id: 'start_clock_button',
            text: 'Start clock',
            handler: function( cmp )
            {
              window.timer1 = new Common.utils.Timer(
              {
                display_object_id: 'clock',
                display_format: '{H}:{M}:{S}'
              });
              window.timer1.start();

              cmp.disable();
              Ext.getCmp( 'stop_clock_button' ).enable();
            }
          }),

          new Ext.Button(
          {
            id: 'stop_clock_button',
            text: 'Stop clock',
            disabled: true,
            handler: function( cmp )
            {
              window.timer1.stop();
              cmp.disable();
              Ext.getCmp( 'start_clock_button' ).enable();
            }
          })
        ]
      }
    ]
  })


});
