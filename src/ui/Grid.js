
/**
 * Base class to create grids
 *
 * Configure action button:
 *
 *     Common.ui.Grid.prototype.action_button_config.tooltip = 'View actions';
 *     Common.ui.Grid.prototype.action_button_config.iconCls = 'fugue fugue-alarm-clock';
 *
 * Use search field filters of the store to automatically add a search field and use its value as the value of each filter:
 *
 *     store.search_field_filters =
 *     [
 *       {
 *         column: 'name',
 *         operator: 'equals'
 *       },
 *       {
 *         column: 'surname',
 *         operator: 'equals'
 *       }
 *     ];
 *
 */
Ext.define( 'Common.ui.Grid',
{
  extend: 'Ext.grid.GridPanel',
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
   * Submenu to show on row contextmenu event
   *
   * @property {Ext.menu.Menu}
   */
  submenu: null,


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
   * Event to start loading if auto_load is true
   *
   * @property {String}
   */
  auto_load_event: 'afterrender',


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
    iconCls: 'common-grid-action-menu-icon'
  },



  /**
   * Init component
   *
   * @private
   */
  initComponent: function()
  {
    // Add submenu plugin
    if( CommonExt.isArray( this.plugins ) )
    {
      this.plugins.push( new Common.ui.plugins.component.Submenu() );
    }
    else if( this.plugins )
    {
      this.plugins = [ this.plugins, new Common.ui.plugins.component.Submenu() ];
    }
    else
    {
      this.plugins = [ new Common.ui.plugins.component.Submenu() ];
    }

    // Events
    this.on( 'afterrender', this._on_afterrender_grid );

    if( this.auto_load )
    {
      this.on( this.auto_load_event, function(){ this.store.load(); }, this, { single: true } );
    }

    // Columns model
    var columns = this._get_columns();

    if( this.submenu )
    {
      if( this.show_action_button )
      {
        var c_actions =
        {
          align: 'center',
          header: '&nbsp;',
          width: 40,
          fixed: true,
          scope: this,
          renderer: Common.utils.Format.component_renderer( this._action_button_renderer, this )
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
    else if( !this.selModel )
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
      // Check if list_options is defined and bbar is a component with pageSize
      if( store.list_options && this.getBottomToolbar().pageSize )
      {
        store.list_options.rows_per_page = this.getBottomToolbar().pageSize;
      }
    }, this );

    // Page sizer
    if( this.page_sizer )
    {
      var plugin_resizer = new Ext.ux.plugin.PagingToolbarResizer(
      {
        options: [ 5, 10, 15, 20, 25 ],
        prependCombo: true,
        displayText: Common.Langs.get( 'per_page' )
      });

      default_pagination_options.plugins = [ plugin_resizer ];
    }

    this.bbar = this.bbar || new Ext.PagingToolbar( default_pagination_options );
    this.callParent( arguments );
  },



  /**
   * Returns the top toolbar
   *
   * @return {Ext.Toolbar}
   * @private
   */
  _get_top_toolbar: function()
  {
    // Check if exists some top toolbar action
    if( this.left_actions.length == 0 && this.right_actions.length == 0 && ( !this.store.search_field_filters || this.store.search_field_filters.length == 0 ) )
    {
      return null;
    }

    var items = [];

    // LEFT ACTIONS
    if( this.left_actions.length > 0 )
    {
      items = items.concat( this.left_actions );
    }

    // SEPARATOR
    items.push( new Ext.Toolbar.Fill() );


    // RIGHT ACTIONS
    if( this.right_actions.length > 0 )
    {
      items = items.concat( this.right_actions );
    }

    // SEARCH FIELD FILTERS
    if( this.store.search_field_filters && this.store.search_field_filters.length > 0 )
    {
      this._search_field = new Ext.ux.form.SearchField(
      {
        width: 180,
        store: this.store,
        emptyText: Common.Langs.get( 'search' )
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
   * After render event handler
   *
   * @param {Ext.grid.GridPanel} cmp
   * @private
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
   * @param {String} value
   * @param {Object} metaData
   * @param {Object} record
   * @param {Number} rowIndex
   * @return {Ext.Button}
   * @private
   */
  _action_button_renderer: function( value, metaData, record, rowIndex )
  {
    return new Ext.Button( CommonExt.Object.merge( this.action_button_config,
    {
      scope: this,
      handler: function( cmp )
      {
        // Select button row
        this.getSelectionModel().selectRow( rowIndex );

        // Get button position
        var pos = cmp.getEl().getXY();

        // Add button height to "y" position
        pos[ 1 ] += cmp.getSize().height + 2;

        // Show submenu
        var records = CommonExt.Array.pluck( this.getSelectionModel().getSelections(), 'json' );
        this._submenu_plugin = CommonExt.Array.findBy( this.plugins, function( plugin ){ return plugin.pluginId == 'submenu'; } );
        this._submenu_plugin._show_submenu( this, records, pos );
      }
    }));
  },



  /**
   * Enables a button when at least one row is selected
   *
   * @param {Ext.Button} cmp
   * @private
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
