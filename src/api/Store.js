
/**
 * Base class to create custom ExtJS Api Stores
 *
 * The stores retrieves a list of entities.
 * Always sends a "list_options" as last parameter of the api method.
 *
 *
 * Search filters example:
 *
 *     this.store.search_filters =
 *     [
 *       // Search filter 1
 *       {
 *         filters:
 *         [
 *           {
 *             column: 'column_foo',
 *             operator: 'integer_not_equal',
 *             value: 3
 *           }
 *         ]
 *       },
 *
 *       // Search filter 2
 *       {
 *         filters:
 *         [
 *           {
 *             column: 'column_foo',
 *             operator: 'equals',
 *             value: 3
 *           },
 *           {
 *             column: 'column_var',
 *             operator: 'not_in',
 *             value: '3,4'
 *           }
 *         ]
 *       }
 *     ];
 *
 *
 * Search field filters example:
 *
 *     this.store.search_field_filters =
 *     [
 *       {
 *         column: 'name',
 *         operator: 'contains'
 *       },
 *       {
 *         column: 'surname',
 *         operator: 'contains'
 *       }
 *     ];
 *
 *
 * Group filters association example:
 *
 *     this.store.group_filters_association =
 *     {
 *       join_type: 'OR',
 *       group_filters:
 *       [
 *         // Group filter 1
 *         {
 *           filters:
 *           [
 *             {
 *               column: 'column_foo',
 *               operator: 'integer_not_equal',
 *               value: 3 // Proposal
 *             }
 *           ]
 *         },
 *
 *         // Group filter 2
 *         {
 *           join_type: 'AND',
 *           filters:
 *           [
 *             {
 *               column: 'column_foo',
 *               operator: 'equals',
 *               value: 3
 *             },
 *             {
 *               column: 'column_var',
 *               operator: 'not_in',
 *               value: '3,4' // Accepted
 *             }
 *           ]
 *         }
 *       ]
 *     };
 *
 */
Ext.define( 'Common.api.Store',
{
  extend: 'Ext.data.Store',
  autoLoad: false,
  remoteSort: true,


  /**
   * Filters to send inside list_options (Indexed by filter name only to find them for removing)
   *
   * @property {Object[]}
   */
  filters: {},


  /**
   * Search filters
   *
   * @property {Object[]}
   */
  search_filters: [],


  /**
   * Group filters association
   *
   * @var {Object}
   */
  group_filters_association: null,


  /**
   * Search field filters (array of filters without value, it is applied on each beforeload event).
   * The values is taken from "baseParams.query" of the grid search field.
   *
   * @property {Object[]}
   */
  search_field_filters: [],


  /**
   * List options
   *
   * @property {Object}
   */
  list_options: null,



  /**
   * Constructor
   *
   * @param {Object} config
   */
  constructor: function( config )
  {
    this.filters = config.filters || {};
    this.search_filters = config.search_filters || [];
    this.search_field_filters = config.search_field_filters || [];

    this.list_options =
    {
      page: 0,
      rows_per_page: null,
      sort_column: null,
      sort_type: null,
      filters: [],
      search_filters: [],
      group_filters_association: null
    };

    this.proxy = new Common.api.Proxy( config.proxy_config.entity, config.proxy_config.method, config.proxy_config.args );

    this.reader = new Ext.data.JsonReader(
    {
      idProperty: 'id',
      root: ( config.reader_config.root === undefined )? 'items' : config.reader_config.root,
      totalProperty: 'total_rows'
    }, config.reader_config.record );

    this.callParent( arguments );

    if( config.sortInfo )
    {
      this.setDefaultSort( config.sortInfo.field, config.sortInfo.direction );
    }

    this.on( 'beforeload', this._on_beforeload, this );
  },



  /**
   * Before load handler
   *
   * @param {Common.api.Store} store
   * @param {Object} options
   * @private
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

    this.list_options.rows_per_page = options.params.limit || store.baseParams.limit || this.list_options.rows_per_page;
    this.list_options.sort_column = options.params.sort || store.baseParams.sort;
    this.list_options.sort_type = options.params.dir || store.baseParams.dir;
    this.list_options.filters = CommonExt.Object.getValues( this.filters );
    this.list_options.group_filters_association = CommonExt.clone( this.group_filters_association );
    this.list_options.search_filters = CommonExt.Object.getValues( this.search_filters );

    // Prepare the search field filters of the store
    if( this.search_field_filters.length > 0 && store.baseParams.query )
    {
      // Prepare a new search filter
      var search_filter = { filters: this.search_field_filters };

      // Apply the same value for all filters of the new search filters
      CommonExt.Array.each( search_filter.filters, function( filter )
      {
        filter.value = store.baseParams.query;
      });

      // Add the new search filters to the search filters
      this.list_options.search_filters.push( search_filter );
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
   * @param {Object} arg
   * @private
   */
  _is_list_options: function( arg )
  {
    var is_list_options = false;

    if( CommonExt.isObject( arg ) )
    {
      CommonExt.Object.each( arg, function( key, value, obj )
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
   */
  remove_filters: function()
  {
    this.filters = {};
  }

});
