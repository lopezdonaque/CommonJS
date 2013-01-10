
Ext.ns( 'Common.ui.dashboard' );


/**
 * Dashboard
 *
 * Usage:
 *     var dashboard = new Common.ui.dashboard.Dashboard(
 *     {
 *       top:
 *       {
 *         margins: '10',
 *         items: new Ext.Toolbar()
 *       },
 *       bottom:
 *       {
 *         margins: '5',
 *         items: new Ext.Toolbar()
 *       },
 *       center:
 *       {
 *         cls: 'foo',
 *         margins: '5'
 *       }
 *     });
 *
 *     dashboard.start();
 *
 */
Common.ui.dashboard.Dashboard = Ext.extend( Ext.Viewport,
{
  layout: 'border',


  /**
   * Applications container id
   *
   * @var {String}
   */
  apps_container_id: 'app_tabs',



  /**
   * Init component
   *
   * @private
   */
  initComponent: function()
  {
    Common.ui.dashboard.Defaults.apply();

    var top = new Ext.Panel( CommonExt.merge(
    {
      hidden: true,
      autoHeight: true,
      region: 'north',
      margins: '10 10 5 10',
      items: []
    }, this.top ) );

    //var center = new Ext.ux.SlidingTabPanel(
    var center = new Ext.TabPanel( CommonExt.merge(
    {
      id: this.apps_container_id,
      hidden: true,
      region: 'center',
      activeTab: 0,
      enableTabScroll: true,
      margins: '0 10 0 10',
      items: []
      //,slideDuration: .15,
    }, this.center ) );

    var bottom = new Ext.Panel( CommonExt.merge(
    {
      hidden: true,
      autoHeight: true,
      region: 'south',
      margins: '5 10 10 10',
      items: this.bottom_toolbar
    }, this.bottom ) );

    this.items = [ top, center, bottom ];

    Common.ui.dashboard.Dashboard.superclass.initComponent.apply( this, arguments );
  },



  /**
   * Starts the dashboard
   */
  start: function()
  {
    this.get( 0 ).show();
    this.get( 1 ).show();
    this.get( 2 ).show();
    this.doLayout();
  }

});
