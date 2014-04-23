
Ext.onReady( function()
{

  // Clock
  new Ext.Panel(
  {
    renderTo: Ext.getBody(),
    padding: 20,
    layout: 'hbox',
    items:
    [
      {
        xtype: 'container',
        width: 100,
        html: 'Clock: <div id="clock">--:--:--</div>'
      },

      new Ext.Button(
      {
        id: 'start_clock_button',
        text: 'Start clock',
        handler: function( cmp )
        {
          window.timer_clock = new Common.utils.Timer(
          {
            display_object_id: 'clock',
            display_format: '{H}:{M}:{S}',
            starts_at: new Date(),
            offset: new Date().getTimezoneOffset() * -1
          });
          window.timer_clock.start();

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
          window.timer_clock.stop();
          cmp.disable();
          Ext.getCmp( 'start_clock_button' ).enable();
        }
      })

    ]
  });


  // Chronometer
  new Ext.Panel(
  {
    renderTo: Ext.getBody(),
    padding: 20,
    layout: 'hbox',
    items:
    [
      {
        xtype: 'container',
        width: 100,
        html: 'Chronometer: <div id="chronometer">--:--:--:--</div>'
      },

      new Ext.Button(
      {
        id: 'start_chronometer_button',
        text: 'Start chronometer',
        handler: function( cmp )
        {
          window.timer_chronometer = new Common.utils.Timer(
          {
            frequency: 1,
            display_object_id: 'chronometer',
            display_format: '{H}:{M}:{S}:{m}'
           // starts_at: 0
          });
          window.timer_chronometer.start();

          cmp.disable();
          Ext.getCmp( 'stop_chronometer_button' ).enable();
        }
      }),

      new Ext.Button(
      {
        id: 'stop_chronometer_button',
        text: 'Stop chronometer',
        disabled: true,
        handler: function( cmp )
        {
          window.timer_chronometer.stop();
          cmp.disable();
          Ext.getCmp( 'start_chronometer_button' ).enable();
        }
      })

    ]
  });


});
