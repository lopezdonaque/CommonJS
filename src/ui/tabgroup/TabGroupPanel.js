
/**
 * Tab Group Panel
 * This panel must be added always in a TabPanel.
 * It creates a card layout container with buttons inside the tab element to navigate over them.
 *
 * The items inside must define a component to be used as subtab.
 *
 * Requirements:
 * - The TabPanel must be configured with "deferredRender: false"
 *
 */
Ext.define( 'Common.ui.tabgroup.TabGroupPanel',
{
  extend: 'Ext.Container',
  layout: 'card',
  cls: 'common-tabgroup-tabgrouppanel',


  /**
   * TabPanel container
   *
   * @property {Ext.TabPanel}
   * @private
   */
  _tabpanel: null,


  /**
   * Tab container
   *
   * @property {Ext.Container}
   * @private
   */
  _tabcontainer: null,


  /**
   * Subtabs
   *
   * @property {Array}
   * @private
   */
  _subtabs: null,


  /**
   * Active subtab
   *
   * @property {Object}
   */
  activeSubtab: null,



  /**
   * Init component
   *
   * @private
   */
  initComponent: function()
  {
    this._subtabs = [];
    this.stack = new Ext.TabPanel.AccessStack();
    this.on( 'afterrender', this._build, this );
    this.on( 'beforedestroy', this._destroySubtabs, this );
    this.callParent( arguments );
  },



  /**
   * Build
   *
   * @private
   */
  _build: function()
  {
    // Find the TabPanel and the tab container
    this._tabpanel = this.findParentByType( 'tabpanel' );
    for( var p = this; ( p != null ) && p.ownerCt.getXType() != 'tabpanel'; p = p.ownerCt );
    this._tabcontainer = p;

    // Events to listen afterrender
    this.on( 'add', this._beforeAdd, this );
    this.on( 'beforeremove', this._beforeRemove, this );

    this._createSubtabs();

    // Set the active subtab
    if( !CommonExt.isEmpty( this.activeSubtab ) )
    {
      this.setActiveSubtab( this.activeSubtab );
    }
  },



  /**
   * Before add handler
   *
   * @param {Common.ui.tabgroup.TabGroupPanel} cmp
   * @param {Ext.Container} addCmp
   * @param {Number} index
   * @private
   */
  _beforeAdd: function( cmp, addCmp, index )
  {
    // Check if it's a direct child component
    if( this.items.get( index ) == addCmp )
    {
      this._addSubtab( addCmp, index );
    }
  },



  /**
   * Creates the subtabs
   *
   * @private
   */
  _createSubtabs: function()
  {
    // Add class to personalize tab element
    this._getSubtabsContainer().addClass( 'common-tabgroup-tab' );

    // If title and iconCls are not configured, remove tab element contents to avoid spaces
    if( !this.title && !this.iconCls )
    {
      this._getSubtabsContainer().update( '' );
    }

    // Add subtab of each item
    this.items.each( this._addSubtab, this );
  },



  /**
   * Adds a subtab
   *
   * @param {Object} item
   * @param {Number} index
   * @private
   */
  _addSubtab: function( item, index )
  {
    var subtab = item.subtab;

    // Add circular relation between subtab and ownerCt
    subtab.relatedCt = item;

    // Set closable
    if( item.closable === true )
    {
      subtab.addClass( 'common-tabgroup-tabgroupbutton-closable' );
    }

    item.addClass( 'common-tabgroup-panel' );

    subtab.on( 'click', this._subtabClick, this );
    subtab.on( 'close', this._subtabClose, this );

    subtab.render( this._getSubtabsContainer() );

    this._subtabs.push( subtab );

    // Call to "autoScrollTabs" of the TabPanel to show the tabscroll if required
    this._tabpanel.autoScrollTabs();
  },



  /**
   * Remove component handler
   *
   * @param {Common.ui.tabgroup.TabGroupPanel} cmp
   * @param {Ext.Container} removeCmp
   * @private
   */
  _beforeRemove: function( cmp, removeCmp )
  {
    removeCmp.subtab.destroy();

    CommonExt.Array.remove( this._subtabs, removeCmp.subtab );

    if( this._subtabs.length == 0 )
    {
      this._tabcontainer.destroy();
    }
    else
    {
      // TODO: Create a stack to know previous tabs navigation
      this.setActiveSubtab( this._subtabs[0].relatedCt );
    }
  },



  /**
   * Subtab click handler
   *
   * @param {Ext.Component} subtab
   * @private
   */
  _subtabClick: function( subtab )
  {
    this.setActiveSubtab( subtab.relatedCt );
  },



  /**
   * Sets the active subtab
   *
   * @param {Object|Number} item Child object or index
   */
  setActiveSubtab: function( item )
  {
    item = this.getComponent( item );
    this.activeSubtab = item;
    this.getLayout().setActiveItem( item );

    CommonExt.Array.each( this._subtabs, function( subtab )
    {
      var method = ( subtab.relatedCt == item ) ? 'addClass' : 'removeClass';
      subtab[ method ]( 'common-tabgroup-tabgroupbutton-active' );
    }, this );
  },



  /**
   * Subtab close handler
   *
   * @param {Ext.Component} subtab
   * @private
   */
  _subtabClose: function( subtab )
  {
    subtab.relatedCt.destroy();
  },



  /**
   * Returns an element of the original tab element to create subtabs inside it
   *
   * @return {Ext.Element}
   * @private
   */
  _getSubtabsContainer: function()
  {
    if( !this._tabEl )
    {
      this._tabEl = Ext.get( this._tabpanel.getTabEl( this._tabcontainer ) ).child( '.x-tab-strip-inner' );
    }

    return this._tabEl;
  },



  /**
   * Destroys all the subtabs before destroy the component
   *
   * @private
   */
  _destroySubtabs: function()
  {
    CommonExt.Array.each( this._subtabs, function( subtab )
    {
      subtab.destroy();
    });
  }

});
