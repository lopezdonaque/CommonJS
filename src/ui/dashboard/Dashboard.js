
/**
 * Dashboard
 *
 * Usage:
 *     var dashboard = new Common.ui.dashboard.Dashboard(
 *     {
 *       top:
 *       {
 *         margins: '10',
 *         extraCls: 'your-top-css-class',
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
 *       },
 *       left:
 *       {
 *         forceHidden: true,
 *         collapsible: false,
 *         html: 'aaaa'
 *       }
 *     });
 *
 *     dashboard.start();
 *
 */
Ext.define( 'Common.ui.dashboard.Dashboard',
{
  extend: 'Ext.Viewport',
  layout: 'border',
  cls: 'common-ui-dashboard',


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
    this.items = [];

    if( this.top )
    {
      this.items.push( this._top = new Ext.Panel( CommonExt.merge(
      {
        hidden: true,
        region: 'north',
        cls: 'common-ui-dashboard-top ' + ( this.top.extraCls || '' ),
        margins: '10 10 5 10',
        items: []
      }, this.top ) ) );
    }

    if( this.right )
    {
      this.items.push( this._right = new Ext.Panel( CommonExt.merge(
      {
        hidden: true,
        region: 'east',
        cls: 'common-ui-dashboard-right ' + ( this.right.extraCls || '' ),
        width: 200,
        margins: '10 10 10 5',
        items: []
      }, this.right ) ) );
    }

    if( this.bottom )
    {
      this.items.push( this._bottom = new Ext.Panel( CommonExt.merge(
      {
        hidden: true,
        region: 'south',
        cls: 'common-ui-dashboard-bottom ' + ( this.bottom.extraCls || '' ),
        margins: '5 10 10 10',
        items: []
      }, this.bottom ) ) );
    }

    if( this.left )
    {
      this.items.push( this._left = new Ext.Panel( CommonExt.merge(
      {
        hidden: true,
        region: 'west',
        cls: 'common-ui-dashboard-left ' + ( this.left.extraCls || '' ),
        width: 200,
        margins: '0 0 0 10',
        items: []
      }, this.left ) ) );
    }

    this.items.push( this._center = new Ext.TabPanel( CommonExt.merge(
    {
      id: this.apps_container_id,
      hidden: true,
      region: 'center',
      cls: 'common-ui-dashboard-center ' + ( this.center ? this.center.extraCls || '' : '' ),
      activeTab: 0,
      enableTabScroll: true,
      margins: '0 10 0 10',
      items: []
    }, this.center ) ) );

    this.callParent( arguments );
  },



  /**
   * Starts the dashboard
   */
  start: function()
  {
    this.items.each( function( item )
    {
      if( item.forceHidden !== true )
      {
        item.show();
      }
    });

    this.doLayout();
  }

});
