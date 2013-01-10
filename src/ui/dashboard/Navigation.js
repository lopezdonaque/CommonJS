
/**
 * Dashboard navigation manager
 *
 */
CommonExt.define( 'Common.ui.dashboard.Navigation',
{
  singleton: true,


  /**
   * Navigates to other application tab
   *
   * @param {String} app_name
   * @param {Function} obj
   * @param {Object} params
   * @param {Object=} options
   * @param {String} options.title Application tab title
   * @param {String} options.iconCls Application tab icon class
   * @param {Boolean} options.allow_close Defines if the application tab is closable
   * @param {Boolean} options.force Forces to recreate the application tab if it is already opened
   * @param {Boolean} options.activate Forces to active the application tab
   */
  go_to: function( app_name, obj, params, options )
  {
    Common.Log.debug( '[Common.ui.dashboard.Navigation.go_to] Navigation', app_name, obj, params, options );

    var _options =
    {
      title: null,
      iconCls: null,
      allow_close: true,
      force: false,
      activate: true
    };

    _options = CommonExt.merge( _options, options );

    // Check if the app_panel exists and create it
    if( !( app_panel = Ext.getCmp( app_name ) ) )
    {
      var app_panel = new Ext.Panel(
      {
        id: app_name,
        title: _options.title || Common.Langs.get( app_name ),
        closable: !( _options.allow_close === false ),
        iconCls: _options.iconCls,
        layout: 'fit', // Fills space when exists only ONE item inside
        cls: 'app_tab', // Used to identify it by the child elements using "xx.el.dom.up( '.app_tab' )"
        style:
        {
          padding: '5px'
        }
      });

      Ext.getCmp( Common.ui.dashboard.Dashboard.prototype.apps_container_id ).add( app_panel );
    }

    // Active the app panel
    if( _options.activate !== false )
    {
      Ext.getCmp( Common.ui.dashboard.Dashboard.prototype.apps_container_id ).setActiveTab( app_panel );
    }

    // Check if we must to force object reload
    if( !app_panel.items || app_panel.items.length == 0 || _options.force === true )
    {
      // Remove app panel contents
      app_panel.removeAll();

      // Add the obj inside the app panel
      app_panel.add( new obj( params || {} ) );

      // Force render the hidden child components of the tab
      app_panel.doLayout( false, true );
    }
  }

});
