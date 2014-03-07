
/**
 * Adds submenu to grid or dataview
 *
 * The component must define the "Ext.menu.Menu" into "submenu" property.
 *
 */
CommonExt.define( 'Common.ui.plugins.component.Submenu',
{

  /**
   * Id to identify this plugin externally
   *
   * @var {String}
   */
  pluginId: 'submenu',


  /**
   * Component instance
   *
   * @property {Ext.GridPanel|Ext.DataView}
   * @private
   */
  _cmp: null,



  /**
   * Constructor
   *
   * @param {Object} options
   */
  constructor: function( options )
  {
    this.initConfig( options );
  },



  /**
   * Initializes the plugin
   *
   * @param {Ext.Component} cmp
   * @private
   */
  init: function( cmp )
  {
    // Store component instance
    this._cmp = cmp;

    if( !cmp.submenu )
    {
      return;
    }

    cmp.on( 'beforedestroy', this._on_beforedestroy_cmp );

    // Check if it's a grid or dataview
    if( cmp.selModel )
    {
      cmp.on( 'rowcontextmenu', this._on_rowcontextmenu_grid, this );
    }
    else
    {
      cmp.on( 'contextmenu', this._on_contextmenu_dataview, this );
    }
  },



  /**
   * Row context menu event handler
   *
   * @param {Ext.grid.GridPanel} cmp
   * @param {Number} rowIndex
   * @param {Ext.EventObject} e
   * @private
   */
  _on_rowcontextmenu_grid: function( cmp, rowIndex, e )
  {
    if( cmp.single_select !== false ) // TODO: Use some generic property from GridPanel
    {
      cmp.getSelectionModel().selectRow( rowIndex );
    }

    var current_selections = cmp.getSelectionModel().getSelections();

    // If less than two rows are selected OR the rowIndex is not a selected row
    if( current_selections.length < 2 || CommonExt.Array.pluck( current_selections, 'id' ).indexOf( cmp.getStore().getAt( rowIndex ).data.id ) == -1 )
    {
      cmp.getSelectionModel().selectRow( rowIndex );
    }

    e.stopEvent();

    var records = CommonExt.Array.pluck( cmp.getSelectionModel().getSelections(), 'json' );
    this._show_submenu( cmp, records, e.getXY() );
  },



  /**
   * Context menu event handler
   *
   * @param {Ext.DataView} cmp
   * @param {Number} index
   * @param {HTMLElement} node
   * @param {Ext.EventObject} e
   * @private
   */
  _on_contextmenu_dataview: function( cmp, index, node, e )
  {
    if( cmp.multiSelect !== true )
    {
      cmp.select( index );
    }

    var current_selections = cmp.getSelectedRecords();

    // If less than two items are selected OR the index is not a selected item
    if( current_selections.length < 2 || CommonExt.Array.pluck( current_selections, 'id' ).indexOf( cmp.getStore().getAt( index ).id ) == -1 )
    {
      cmp.select( index );
    }

    e.stopEvent();

    var records = CommonExt.Array.pluck( cmp.getSelectedRecords(), 'json' );
    this._show_submenu( cmp, records, e.getXY() );
  },



  /**
   * Shows submenu
   *
   * @param {Ext.grid.GridPanel|Ext.DataView} cmp
   * @param {Array} records
   * @param {Object} position
   * @return {Boolean}
   * @private
   */
  _show_submenu: function( cmp, records, position )
  {
    cmp.submenu.ctxRecords = records;

    // Check if exists "_prepare" method (to modify menu items - enable, disable, hide, etc.)
    if( cmp.submenu._prepare )
    {
      if( cmp.submenu._prepare.apply( cmp.submenu.scope || cmp.submenu, [ records ] ) === false )
      {
        return false;
      }
    }

    cmp.submenu.showAt( position );
    return true;
  },



  /**
   * Before destroy event handler
   *
   * @param {Ext.grid.GridPanel|Ext.DataView} cmp
   * @private
   */
  _on_beforedestroy_cmp: function( cmp )
  {
    // Remove the submenu
    if( cmp.submenu )
    {
      cmp.submenu.destroy();
    }
  }

});
