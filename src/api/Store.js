
/**
 * Base class to create custom ExtJS Api Stores
 *
 * The stores retrieves a list of entities.
 * Always sends a "list_options" as last parameter of the api method.
 *
 */
Common.api.Store = Ext.extend( Ext.data.Store,
{
  autoLoad: false,
  remoteSort: true,


  /**
   * Filters to send inside list_options
   * Associative array indexed by filter name
   *
   * @property {Object[]}
   */
  filters: {},


  /**
   * Search filters
   *
   * @property {Object}
   */
  search_filters: {},


  /**
   * List options
   *
   * @property {Object}
   */
  list_options:
  {
    page: null,
    rows_per_page: null,
    sort_column: null,
    sort_type: null,
    filters: [],
    search_filters: []
  },



  /**
   * Constructor
   *
   * @param {Object} config
   */
  constructor: function( config )
  {
    this.filters = config.filters || {};
    this.search_filters = config.search_filters || {};
    this.list_options =
    {
      page: 0,
      rows_per_page: null,
      sort_column: null,
      sort_type: null,
      filters: [],
      search_filters: []
    };

    this.proxy = new Common.api.Proxy( config.proxy_config.entity, config.proxy_config.method, config.proxy_config.args );

    this.reader = new Ext.data.JsonReader(
    {
      idProperty: 'id',
      root: ( config.reader_config.root === undefined )? 'items' : config.reader_config.root,
      totalProperty: 'total_rows'
    }, config.reader_config.record );

    Common.api.Store.superclass.constructor.call( this, arguments );

    if( config.sortInfo )
    {
      this.setDefaultSort( config.sortInfo.field, config.sortInfo.direction );
    }

    this.on( 'beforeload', this._on_beforeload, this );
  },



  /**
   * Before load handler
   *
   * @private
   * @param {Common.api.Store} store
   * @param {Object} options
   */
  _on_beforeload: function( store, options )
  {
    Common.Log.debug( '[Common.api.Store._on_beforeload] Before load', arguments );

    if( !options.params.start )
    {
      this.list_options.page = 1;
    }
    else
    {
      this.list_options.page = ( options.params.start == 0 ) ? 1 : Math.floor( options.params.start / options.params.limit ) + 1;
    }

    this.list_options.rows_per_page = options.params.limit || store.baseParams.limit;
    this.list_options.sort_column = options.params.sort || store.baseParams.sort;
    this.list_options.sort_type = options.params.dir || store.baseParams.dir;
    this.list_options.filters = CommonExt.Object.getValues( this.filters );
    this.list_options.search_filters = this.search_filters;

    // Prepare the search filters of the store
    if( this.list_options.search_filters.length > 0 )
    {
      var search_value = store.baseParams.query || ''; // TODO: When the value is '', the filter should not be sent
      Ext.each( this.list_options.search_filters[ 0 ].filters, function( item, index, allItems )
      {
        item.value = search_value;
      });
    }

    // Check if the last argument is a list_options, to remove it before add the new list_options
    var args = this.proxy._args;
    if( args.length > 0 && this._is_list_options( args[ args.length - 1 ] ) )
    {
      CommonExt.Array.erase( args, -1, 1 );
    }

    args.push( this.list_options );
  },



  /**
   * Returns if the argument is a list_options
   *
   * @private
   * @param {Object} arg
   */
  _is_list_options: function( arg )
  {
    var is_list_options = false;

    if( Ext.isObject( arg ) )
    {
      Ext.iterate( arg, function( key, value, obj )
      {
        if( [ 'page', 'rows_per_page', 'sort_column', 'sort_type', 'filters', 'search_filters' ].indexOf( key ) != -1 )
        {
          is_list_options = true;
        }
      }, this );
    }

    return is_list_options;
  },



  /**
   * Sets filter
   *
   * @param {String} name
   * @param {String} field
   * @param {String} operator Operators like: equals, not_equals, bigger, lower, etc.
   * @param {String} value
   */
  set_filter: function( name, field, operator, value )
  {
    this.filters[ name ] =
    {
      column: field,
      operator: operator,
      value: value
    };
  },



  /**
   * Sets xpath filter
   *
   * @param {String} name
   * @param {String} field
   * @param {String} query
   */
  set_filter_xpath: function( name, field, query )
  {
    this.filters[ name ] =
    {
      column: field,
      xpath_query: query
    };
  },



  /**
   * Removes a filter
   *
   * @param {String} name
   */
  remove_filter: function( name )
  {
    delete this.filters[ name ];
  },



  /**
   * Removes all filters
   *
   */
  remove_filters: function()
  {
    this.filters = {};
  }

});
