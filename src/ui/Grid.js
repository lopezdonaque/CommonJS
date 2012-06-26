
Ext.ns( 'Common.ui' );


/**
 * Base class to create grids
 *
 * Configure action button:
 *     Common.ui.Grid.prototype.action_button_config.tooltip = 'View actions';
 *     Common.ui.Grid.prototype.action_button_config.iconCls = 'fugue fugue-alarm-clock';
 *
 */
Common.ui.Grid = Ext.extend( Ext.grid.GridPanel,
{
  stateful: false,


  /**
   * Top toolbar left items
   *
   * @property {Array}
   */
  left_actions: [],


  /**
   * Top toolbar right items
   *
   * @property {Array}
   */
  right_actions: [],


  /**
   * Row context menu
   *
   * @property {Ext.menu.Menu}
   */
  submenu: null,


  /**
   * Filter to search grid records
   *
   * @property {Array}
   */
  search_filters: null,


  /**
   * Defines if the grid autorefresh data
   *
   * @property {Boolean}
   */
  autorefresh: false,


  /**
   * Autorefresh interval (milliseconds)
   *
   * @property {Number}
   */
  autorefresh_interval: 120000,


  /**
   * Defines if the pagination will be displayed or not
   *
   * @property {Boolean}
   */
  hide_paging_toolbar: false,


  /**
   * Pagination options
   *
   * @property {Object}
   */
  pagination: {},


  /**
   * Default page size constant
   *
   * @property {Number}
   */
  DEFAULT_PAGE_SIZE: 10,


  /**
   * Defines if only one row could be selected
   *
   * @property {Boolean}
   */
  single_select: true,


  /**
   * Defines if the combo page resizer will be added
   *
   * @property {Boolean}
   */
  page_sizer: true,


  /**
   * Defines if the action button must be displayed
   *
   * @property {Boolean}
   */
  show_action_button: true,


  /**
   * Auto load stores after render
   *
   * @property {Boolean}
   */
  auto_load: true,


  /**
   * Action button configuration options
   *
   * @property {Object}
   */
  action_button_config:
  {
    text: '',
    tooltip: '',
    cls: 'x-btn-without-bg',
    iconCls: 'fugue fugue-gear--arrow'
  },



  /**
   * Init component
   *
   */
  initComponent: function()
  {
    // Events
    this.on( 'beforedestroy', this._on_beforedestroy_grid );
    this.on( 'afterrender', this._on_afterrender_grid );

    if( this.auto_load )
    {
      this.on( 'afterrender', function(){ this.store.load(); } );
    }

    // Columns model
    var columns = this._get_columns();

    if( this.submenu )
    {
      this.on( 'rowcontextmenu', this._on_rowcontextmenu_grid, this );

      if( this.show_action_button )
      {
        var c_actions =
        {
          align: 'center',
          width: 40,
          fixed: true,
          scope: this,
          renderer: this._action_button_renderer
        };

        columns.push( c_actions );
      }
    }

    this.colModel = new Ext.grid.ColumnModel(
    {
      columns: columns
    });


    // Selection model
    if( this.selModel == 'none' )
    {
      this.selModel = null;
    }
    else if( ! this.selModel )
    {
      this.selModel = new Ext.grid.RowSelectionModel(
      {
        singleSelect: this.single_select
      });
    }


    // Top toolbar
    this.tbar = this._get_top_toolbar();


    // Pagination
    var default_pagination_options =
    {
      pageSize: this.DEFAULT_PAGE_SIZE,
      store: this.store,
      displayInfo: true,
      displayMsg: Common.Langs.get( 'showing_records' ),
      emptyMsg: Common.Langs.get( 'no_records_found' ),
      hidden: this.hide_paging_toolbar
    };

    Ext.apply( default_pagination_options, this.pagination );


    this.store.on( 'beforeload', function( store, options )
    {
//TODO: dejar solo el list_options cuando se haya eliminado el dashboard.jsonstore
      if( store.list_options && this.page_sizer && !this.hide_paging_toolbar )
      {
        store.list_options.rows_per_page = this.getBottomToolbar().pageSize;
      }
      else
      {
        store.baseParams.limit = this.getBottomToolbar().pageSize;
      }
    }, this );


    // Page sizer
    if( this.page_sizer )
    {
      var plugin_resizer = new Ext.ux.plugin.PagingToolbarResizer(
      {
        options : [ 5, 10, 15, 20, 25 ],
        prependCombo: true,
        displayText: Common.Langs.get( 'per_page' )
      });

      default_pagination_options.plugins = [ plugin_resizer ];
    }

    this.bbar = new Ext.PagingToolbar( default_pagination_options );

    // Call parent
    Common.ui.Grid.superclass.initComponent.apply( this, arguments );
  },



  /**
   * Returns the top toolbar
   *
   * @private
   * @return {Ext.Toolbar}
   */
  _get_top_toolbar: function()
  {
    //check if exists some top toolbar action
    if( this.left_actions.length == 0 && this.right_actions.length == 0 && this.search_filters == null )
    {
      return null;
    }

    var items = [];

    //LEFT ACTIONS
    if( this.left_actions.length > 0 )
    {
      items = items.concat( this.left_actions );
    }

    //SEPARATOR
    items.push( new Ext.Toolbar.Fill() );


    //RIGHT ACTIONS
    if( this.right_actions.length > 0 )
    {
      items = items.concat( this.right_actions );
    }

    //SEARCH FILTER
    if( this.search_filters )
    {
      this._search_field = new Ext.ux.form.SearchField(
      {
        width: 180,
        store: this.store,
        emptyText: Common.Langs.get( 'search' ),
        listeners:
        {
          scope: this,
          added: function()
          {
            var search_filter =
            {
              filters: this.search_filters
            };

            this.store.search_filters = [ search_filter ];
          }
        }
      });

      if( this.right_actions.length > 0 )
      {
        items.push( new Ext.Toolbar.Separator() );
      }

      items.push( this._search_field );
    }

    return new Ext.Toolbar(
    {
      items: items,
      grid: this // Manually added reference to grid component
    });
  },



  /**
   * Row context menu event handler
   *
   * @private
   * @param {Ext.grid.GridPanel} grid
   * @param {Number} rowIndex
   * @param {Ext.EventObject} e
   */
  _on_rowcontextmenu_grid: function( grid, rowIndex, e )
  {
    Common.Log.debug( '[Common.ui.Grid._on_rowcontextmenu_grid] Row context menu - Submenu: ', this.submenu );

    if( this.submenu.singleSelect !== false )
    {
      this.getSelectionModel().selectRow( rowIndex );
    }

    var current_selections = grid.getSelectionModel().getSelections();

    // If less than two rows are selected OR the rowIndex is not a selected row
    if( current_selections.length < 2 || CommonExt.Array.pluck( current_selections, 'id' ).indexOf( grid.getStore().getAt( rowIndex ).data.id ) == -1 )
    {
      grid.getSelectionModel().selectRow( rowIndex );
    }

    e.stopEvent();

    this._show_submenu( e.getXY() );
  },



  /**
   * Before destroy event handler
   *
   * @private
   * @param {Ext.grid.GridPanel} cmp
   */
  _on_beforedestroy_grid: function( cmp )
  {
    // Remove the submenu
    if( cmp.submenu )
    {
      cmp.submenu.destroy();
    }
  },



  /**
   * After render event handler
   *
   * @private
   * @param {Ext.grid.GridPanel} cmp
   */
  _on_afterrender_grid: function( cmp )
  {
    Common.Log.debug( '[Common.ui.Grid._on_afterrender_grid] After render' );

    if( this.autorefresh === true )
    {
      this._prepare_auto_reload();
    }
  },



  /**
   * Shows submenu
   *
   * @private
   * @param {Object} position
   * @return {Boolean}
   */
  _show_submenu: function( position )
  {
    var records = CommonExt.Array.pluck( this.getSelectionModel().getSelections(), 'data' );
    this.submenu.ctxRecords = records;

    // Check if exists "_prepare" method (to modify menu items - enable, disable, hide, etc.)
    if( this.submenu._prepare )
    {
      if( this.submenu._prepare( records ) === false )
      {
        return false;
      }
    }

    this.submenu.showAt( position );
    return true;
  },



  /**
   * Prepares auto reload
   * Creates a new task to reload grid each 2 minutes
   *
   * @private
   */
  _prepare_auto_reload: function()
  {
    Common.Log.debug( '[Common.ui.Grid._prepare_auto_reload] Prepare auto reload' );

    this.interval_id = setInterval( CommonExt.bind( this._reload_task, this ), this.autorefresh_interval );

    //set listener to restart task on each load
    this.store.on( 'load', function()
    {
      clearInterval( this.interval_id );
      this.interval_id = setInterval( CommonExt.bind( this._reload_task, this ), this.autorefresh_interval );
    }, this );
  },



  /**
   * Reload task
   *
   * @private
   */
  _reload_task: function()
  {
    Common.Log.debug( '[Common.ui.Grid._reload_task] Reload task' );
    this.store.reload();
  },



  /**
   * Renders action button
   *
   * @private
   * @param {String} value
   * @param {Object} metaData
   * @param {Object} record
   * @param {Number} rowIndex
   * @param {Number} colIndex
   * @param {Object} store
   * @return {String}
   */
  _action_button_renderer: function( value, metaData, record, rowIndex, colIndex, store )
  {
    var id = Ext.id();
    CommonExt.Function.defer( this._create_action_button, 25, this, [ id, rowIndex ] );
    return '<div id="' + id + '"></div>';
  },



  /**
   * Creates action button
   *
   * @private
   * @param {String} id
   * @param {Number} rowIndex
   */
  _create_action_button: function( id, rowIndex )
  {
    //Common.Log.debug( '[Common.ui.Grid._create_action_button] Create action button', id, rowIndex );

    if( !Ext.DomQuery.selectNode( '#' + id ) )
    {
      return false;
    }

    var config = CommonExt.Object.merge( this.action_button_config,
    {
      renderTo: id,
      scope: this,
      handler: function( cmp )
      {
        // Select button row
        this.getSelectionModel().selectRow( rowIndex );

        // Get button position
        var pos = cmp.getEl().getXY();

        // Add button height to "y" position
        pos[ 1 ] += cmp.getSize().height + 2;

        // Show menu at position
        this._show_submenu( pos );
      }
    });

    var button = new Ext.Button( config );

    // The button is not part of the grid items, so we must to destroy it when the grid is destroyed
    this.on( 'beforedestroy', function(){ button.destroy(); } );
  },



  /**
   * Enables a button when at least one row is selected
   *
   * @private
   * @param {Ext.Button} cmp
   */
  _enable_on_selected: function( cmp )
  {
    // Add listener
    this.getSelectionModel().on( 'selectionchange', function( sm, cmp )
    {
      cmp.setDisabled( ( sm.getSelections().length <= 0 ) );
    }.createDelegate( this, [ cmp ], true ) );

    // Enable or disable the first time
    cmp.setDisabled( ( this.getSelectionModel().getSelections().length <= 0 ) );
  }

});
