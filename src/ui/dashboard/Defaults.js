
/**
 * Dashboard default configuration
 *
 * Usage:
 *     Common.ui.dashboard.Defaults.apply();
 *
 */
Common.ui.dashboard.Defaults =
{

  /**
   * Applies some default configuration options
   *
   */
  apply: function()
  {
    Ext.apply( Ext.FormPanel.prototype,
    {
      labelWidth: 150,
      labelAlign: 'right',
      labelPad: 15,
      defaults: { msgTarget: 'side' },
      monitorValid: true,
      buttonAlign: 'center',
      border: false,
      autoHeight: true, // Use autoHeight to dont show a scroll between controls and form buttons
      autoScroll: false // If you need autoScroll, use it in the parent Panel
    });

    Ext.apply( Ext.Panel.prototype,
    {
      buttonAlign: 'center',
      forceLayout: true,
      autoScroll: true,

      defaults: { msgTarget: 'side' },

      // Applied on layout form
      labelWidth: 150,
      labelAlign: 'right',
      labelPad: 15
    });

    Ext.apply( Ext.grid.GridPanel.prototype,
    {
      loadMask: true,
      columnLines: true,
      enableColumnHide: false,
      enableColumnMove: false,
      enableColumnResize: true,
      enableHdMenu: false,

      autoHeight: false, // Use autoHeight false because Grids are usually used in Panels with layout 'fit'
      border: false
    });

    Ext.apply( Ext.Window.prototype,
    {
      resizable: false,
      draggable: true,
      buttonAlign: 'right'
    });

    Ext.apply( Ext.TabPanel.prototype,
    {
      deferredRender: false,
      layoutOnTabChange: false,
      activeTab: 0
    });


    // WORKAROUND: fix bug on IE - When two modals are opened and try to close one, "Invalid argument" error is raised
    if( Ext.isIE )
    {
      Ext.useShims = true; //automatic IFrame backgrounds
      Ext.form.ComboBox.prototype.shadow = false;
      Ext.Panel.prototype.shadow = false;
      Ext.menu.Menu.prototype.shadow = false;
    }



    var cookie_provider = new Ext.state.CookieProvider(
    {
      expires: new Date( new Date().getTime() + ( 1000 * 60 * 60 * 24 * 30 ) ) //30 days from now
    });
    Ext.state.Manager.setProvider( cookie_provider );



    // Disable Esc key
    new Ext.KeyMap( document,
    {
      key: Ext.EventObject.ESC,
      stopEvent: true,
      fn: function()
      {
        Common.Log.debug( '[Common.ui.dashboard.Defaults] Esc key is disabled' );
      }
    });



    Ext.apply( Ext.grid.GridView.prototype,
    {
      emptyText: '<p style="line-height: 35px; padding-left: 10px;">' + Common.Langs.get( 'no_records_found' ) + '</p>'
    });

    Ext.apply( Ext.DataView.prototype,
    {
      emptyText: '<p style="line-height: 35px; padding-left: 10px;">' + Common.Langs.get( 'no_records_found' ) + '</p>'
    });


    Common.ui.overrides.FormFieldRequired.apply();
    Common.ui.overrides.FormFieldIcon.apply();
    Common.ui.overrides.HelpText.apply();
    Common.ui.overrides.FieldFocus.apply();
    Common.ui.overrides.VTypes.apply();
  }

};

