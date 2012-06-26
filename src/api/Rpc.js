
/**
 * #Examples:
 *
 * Using global endpoint and user_data or token:
 *
 *     Common.api.Api.endpoint = 'http://webservices.domain.com/api';
 *     Common.api.Api.token = '89c57dfdc2dcb5d3380f9edce9d806459fee14fa';
 *     Common.api.Api.user_data =
 *     {
 *       client_cif: false,
 *       customer_id: 23,
 *       distributor_id: -1,
 *       parent_distributor_id: -1,
 *       user_id: 327
 *     };
 *
 *     var rpc = new Common.api.Rpc( 'users', 'get_user', [ 327 ] );
 *     rpc.on( Common.api.RpcEvents.SUCCESS, function( data ){ Common.Log.debug( 'success', data ); }, scope );
 *     rpc.on( Common.api.RpcEvents.ERROR, function( data ){ Common.Log.debug( 'error', data ); }, scope );
 *     rpc.request();
 *
 *
 * Using shorthands:
 *
 *     var rpc = new Common.api.Rpc( 'users', 'get_user', [ 327 ] );
 *     rpc.on_success( function( data ){ Common.Log.debug( 'success', data ); }, scope );
 *     rpc.on_error( function( data ){ Common.Log.debug( 'error', data ); }, scope );
 *     rpc.request();
 *
 *
 * Using custom endpoint and user_data:
 *
 *     var options =
 *     {
 *       endpoint: 'xx',
 *       user_data: { xx },
 *       token: '89c57dfdc2dcb5d3380f9edce9d806459fee14fa'
 *     };
 *     var rpc = new Common.api.Rpc( 'users', 'get_user', [ 25 ], options );
 *     rpc.on( Common.api.RpcEvents.SUCCESS, function( data ){ Common.Log.debug( 'success', data ); }, scope );
 *     rpc.on( Common.api.RpcEvents.ERROR, function( data ){ Common.Log.debug( 'error', data ); }, scope );
 *     rpc.request();
 *
 */
CommonExt.define( 'Common.api.Rpc',
{
  extend: 'CommonExt.util.Observable',
  statics:
  {
    /**
     * Transaction id
     *
     * @property {Number}
     */
    ID: 1
  },

  config:
  {
    /**
     * The number of milliseconds to wait for a response.
     *
     * @property {Number}
     */
    timeout: 30000,


    /**
     * Api endpoint
     *
     * @property {String}
     */
    endpoint: null,


    /**
     * User data
     *
     * @property {Object}
     */
    user_data: null,


    /**
     * Authentication token
     *
     * @property {String}
     */
    token: null,


    /**
     * Entity
     *
     * @property {String}
     */
    entity: null,


    /**
     * Method to call
     *
     * @property {String}
     */
    method: null,


    /**
     * Arguments of the method
     *
     * @property {Array}
     */
    args: [],


    /**
     * Return format (json or xml)
     *
     * @property {String}
     */
    format: 'json',


    /**
     * Disable caching by adding a unique parameter name to the request
     *
     * @property {Boolean}
     */
    nocache: true,


    /**
     * Defines if debug is enabled
     *
     * @property {Boolean}
     */
    debug: true
  },



  /**
   * Constructor
   *
   * @param {String} entity
   * @param {String} method
   * @param {Array} args
   * @param {Object} options
   * @return {Common.api.Rpc}
   */
  constructor: function( entity, method, args, options )
  {
    this.initConfig( options );

    this.entity = entity;
    this.method = method;
    this.args = args;

    var opts = options || {};

    this.endpoint = opts.endpoint || Common.api.Api.endpoint;

    // Check if the Api endpoint has been defined
    if( !this.endpoint )
    {
      throw '[Common.api.Rpc.constructor] Endpoint is not defined';
    }

    this.user_data = opts.user_data || Common.api.Api.user_data;
    this.token = opts.token || Common.api.Api.token;

    // Check if the user data or token has been defined
    if( !this.user_data && !this.token )
    {
      //throw '[Common.api.Rpc.constructor] User data or token should be defined';
    }

    this.callParent( arguments );
    return this;
  },



  /**
   * Request data
   *
   * @param {Object=} options
   */
  request: function( options )
  {
    if( Common.utils.Url.isCrossDomain( this.endpoint ) )
    {
      if( Ext.isIE6 || Ext.isIE7 )
      {
        this._request_with_iframe();
      }
      else if( Ext.isIE )
      {
        this._request_with_xdr();
      }
      else
      {
        this._request_with_xhr();
      }
    }
    else
    {
      this._request_with_xhr();
    }
  },



  /**
   * Do request using XmlHttpRequest (Ajax) (cross domain)
   *
   * @private
   */
  _request_with_xhr: function()
  {
    Common.Log.debug( '[Common.api.Rpc.request] Request with xhr: ', this.entity, this.method );

    var data = this._get_request_data();
    this.fireEvent( 'beforerequest', { data: data } );

    // Use ExtJS4 because ExtJS3 with prototype adapter could not detect 404, 500, etc. errors
    CommonExt.Ajax.request(
    {
      url: this._get_builded_url(),
      method: 'post',
      timeout: this.timeout,
      params: data,
      success: CommonExt.bind( function( resp ){ this._check_response( resp.responseText ); }, this ),
      failure: CommonExt.bind( this._handle_failure, this )
    });
  },



  /**
   * Do request using XDomainRequest
   *
   * @private
   */
  _request_with_xdr: function()
  {
    Common.Log.debug( '[Common.api.Rpc.request] Request with xdr: ', this.entity, this.method );

    var data = this._get_request_data();
    this.fireEvent( 'beforerequest', { data: data } );

    new Common.io.Xdr(
    {
      url: this._get_builded_url(),
      data: data,
      timeout: this.timeout,
      listeners:
      {
        success: CommonExt.bind( this._check_response, this ),
        error: CommonExt.bind( this._handle_failure, this ),
        timeout: CommonExt.bind( this._handle_failure, this )
      }
    }).request();
  },



  /**
   * Do request using iframe transport
   *
   * @private
   */
  _request_with_iframe: function()
  {
    Common.Log.debug( '[Common.api.Rpc.request] Request with iframe: ', this.entity, this.method );

    var data = this._get_request_data();
    this.fireEvent( 'beforerequest', { data: data } );

    new Common.io.Iframe(
    {
      url: this._get_builded_url(),
      data: data,
      timeout: this.timeout,
      listeners:
      {
        success: CommonExt.bind( this._check_response, this ),
        error: CommonExt.bind( this._handle_failure, this ),
        timeout: CommonExt.bind( this._handle_failure, this )
      }
    }).request();
  },



  /**
   * Returns request data to send
   *
   * @return {Object}
   */
  _get_request_data: function()
  {
    this._id = ++Common.api.Rpc.ID;

    return {
      transaction_id: this._id,
      format: this.format,
      entity: this.entity,
      method: this.method,
      arguments: CommonExt.encode( this.args || [] ),
      user_data: CommonExt.encode( this.user_data ),
      token: this.token
    };
  },



  /**
   * Builds and returns URL
   *
   * @private
   * @return {String}
   */
  _get_builded_url: function()
  {
    var params = {};

    // Debug parameters (used only for development)
    if( this.debug )
    {
      Ext.apply( params, Common.utils.Debug.getDebugParams() );
    }

    var url = this.endpoint;

    url = Ext.urlAppend( url, Ext.urlEncode( params ) );

    if( this.nocache )
    {
      url = Ext.urlAppend( url, '_dc=' + ( new Date().getTime() ) );
    }

    return url;
  },



  /**
   * Checks response
   *
   * @private
   * @param {String} resp
   */
  _check_response: function( resp )
  {
    // Check if the response is a valid json string
    try
    {
      var response = Ext.decode( resp );
    }
    catch( e )
    {
      var response = { error: true };
    }

    if( response && response.error === true )
    {
      this.fireEvent( Common.api.RpcEvents.ERROR, response, this );
      Common.api.RpcEvents.fireEvent( Common.api.RpcEvents.ERROR, response, this );
    }
    else
    {
      Common.Log.debug( '[Common.api.Rpc._check_response] Success', '\n', this, '\n', response );
      this.fireEvent( Common.api.RpcEvents.SUCCESS, response, this );
      Common.api.RpcEvents.fireEvent( Common.api.RpcEvents.SUCCESS, response, this );
    }
  },



  /**
   * Destroys and clean transaction
   *
   * @private
   */
  _destroy_trans: function()
  {

  },



  /**
   * Handles timeout callback
   *
   * @private
   */
  _handle_failure: function()
  {
    Common.Log.warning( '[Common.api.Rpc._handle_failure] Timeout failure', this );

    this._destroy_trans();
    this.trans = false;
    this.fireEvent( Common.api.RpcEvents.ERROR, null );
    Common.api.RpcEvents.fireEvent( Common.api.RpcEvents.ERROR, {} );
  },



  /**
   * Shorthand for success listener
   *
   * @param {Function} callback
   * @param {Object=} scope
   */
  on_success: function( callback, scope )
  {
    this.on( Common.api.RpcEvents.SUCCESS, callback, scope );
  },



  /**
   * Shorthand for error listener
   *
   * @param {Function} callback
   * @param {Object=} scope
   */
  on_error: function( callback, scope )
  {
    this.on( Common.api.RpcEvents.ERROR, callback, scope );
  }

});
