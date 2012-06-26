
Ext.ns( 'Common.ui.dashboard' );


/**
 * Dashboard
 *
 */
Common.ui.dashboard.Dashboard = Ext.extend( Ext.Viewport,
{
  layout: 'border',



  /**
   * Init component
   *
   */
  initComponent: function()
  {
    Common.ui.dashboard.Defaults.apply();

    var top = new Ext.Panel(
    {
      hidden: true,
      autoHeight: true,
      region: 'north',
      margins: '10 10 5 10',
      items: this.top_toolbar
    });

    //var center = new Ext.ux.SlidingTabPanel(
    var center = new Ext.TabPanel(
    {
      id: 'app_tabs',
      hidden: true,
      region: 'center',
      activeTab: 0,
      enableTabScroll: true,
      cls: 'main_panel',
      margins: '0 10 0 10',
      items: [],
      listeners:
      {
        scope: this,
        afterrender: function( cmp )
        {
          // Add css class to the header to allow customize it
          cmp.el.down( '.x-tab-panel-header' ).addClass( 'main_panel-header' );
        }
      }
      //,slideDuration: .15,
    });

    var bottom = new Ext.Panel(
    {
      hidden: true,
      autoHeight: true,
      region: 'south',
      margins: '5 10 10 10',
      items: this.bottom_toolbar
    });

    this.items = [ top, center, bottom ];

    Common.ui.dashboard.Dashboard.superclass.initComponent.apply( this, arguments );
  },



  /**
   * Starts the dashboard
   *
   */
  start: function()
  {
    this.get( 0 ).show();
    this.get( 1 ).show();
    this.get( 2 ).show();
    this.doLayout();
  }

});
