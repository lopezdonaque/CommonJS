
/**
 * #Examples:
 *
 * Available endpoint configurations:
 *     // 1. Endpoint from the same domain
 *     Common.api.Api.endpoint = '/endpoint.php';
 *
 *     // 2. Endpoint from distinct domain (cross-domain)
 *     Common.api.Api.endpoint = 'http://api.domain.com/';
 *
 *     // 2.1 Endpoint from distinct domain (cross-domain) + ajax proxy
 *     // Iframe transport causes continuous loadings while requests (in IE7) and
 *     // XDomainRequest has some restrictions and bugs (is deprecated in IE10)
 *     // so we recommend use an ajax proxy for IE<10
 *     Common.api.Api.endpoint = 'http://api.domain.com/';
 *     Common.api.Api.ajax_proxy = 'ajax_proxy.php'; // Required for IE<10
 *
 *
 * Configure authentication token:
 *     Common.api.Api.token = '89c57dfdc2dcb5d3380f9edce9d806459fee14fa';
 *
 *
 * Request example:
 *     var rpc = new Common.api.Rpc( 'users', 'get_user', [ 327 ] );
 *     rpc.on( Common.api.RpcEvents.SUCCESS, function( data ){ Common.Log.debug( 'success', data ); }, scope );
 *     rpc.on( Common.api.RpcEvents.ERROR, function( data ){ Common.Log.debug( 'error', data ); }, scope );
 *     rpc.request();
 *
 *
 * Using shorthands:
 *     var rpc = new Common.api.Rpc( 'users', 'get_user', [ 327 ] );
 *     rpc.on_success( function( data ){ Common.Log.debug( 'success', data ); }, scope );
 *     rpc.on_error( function( data ){ Common.Log.debug( 'error', data ); }, scope );
 *     rpc.request();
 *
 *
 * Using custom options on a single request:
 *     var options =
 *     {
 *       endpoint: 'http://api.domain.com/',
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
     * Ajax Proxy URL
     * It must be configured to avoid XDomainRequest restrictions and bugs
     *
     * @property {String}
     */
    ajax_proxy: null,


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

    this._detect_endpoint();

    var opts = options || {};

    this.token = opts.token || Common.api.Api.token;

    // Check if the token has been defined
    if( !this.token )
    {
      //throw '[Common.api.Rpc.constructor] User data or token should be defined';
    }

    this.callParent( arguments );
    return this;
  },



  /**
   * Request data
   */
  request: function()
  {
    if( !Common.utils.Url.isCrossDomain( this.endpoint ) )
    {
      this._request_with_xhr();
      return;
    }

    if( CommonExt.isIE6 || CommonExt.isIE7 )
    {
      this._request_with_iframe();
    }
    else if( CommonExt.isIE && CommonExt.ieVersion < 10 )
    {
      this._request_with_xdr();
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
    Common.Log.debug( '[Common.api.Rpc._request_with_xhr] Request with xhr: ', this.entity, this.method );

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
      failure: CommonExt.bind( function( resp )
      {
        // Check if it's user aborted (the user hit Esc or navigated away from the current page before an AJAX call was done)
        if( resp.getAllResponseHeaders && ( !resp.getAllResponseHeaders() || CommonExt.Object.getSize( resp.getAllResponseHeaders() ) == 0 ) )
        {
          return;
        }

        this._handle_failure();
      }, this )
    });
  },



  /**
   * Do request using XDomainRequest
   *
   * @private
   */
  _request_with_xdr: function()
  {
    Common.Log.debug( '[Common.api.Rpc._request_with_xdr] Request with xdr: ', this.entity, this.method );

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
    Common.Log.debug( '[Common.api.Rpc._request_with_iframe] Request with iframe: ', this.entity, this.method );

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
      token: this.token,
      entity: this.entity,
      method: this.method,

      // Workaround: We must to do a double encode to be sure all "undefined" are converted to "null"
      // See: http://www.sencha.com/forum/showthread.php?134699-Ext.encode()-error
      arguments: CommonExt.encode( CommonExt.decode( CommonExt.encode( this.args || [] ) ) )
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

    // Add debug parameters to the endpoint URL (used only for development)
    if( this.debug && !( CommonExt.isIE && CommonExt.ieVersion < 10 ) )
    {
      CommonExt.merge( params, Common.utils.Debug.getDebugParams() );
    }

    // ONLY to identify the request when is displayed in Firebug
    CommonExt.merge( params, { '_rid': this.entity + '-' + this.method } );

    if( this.nocache )
    {
      CommonExt.merge( params, { '_dc': new Date().getTime() } );
    }

    var url = CommonExt.urlAppend( this.endpoint, CommonExt.urlEncode( params ) );
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
      var response = CommonExt.decode( resp );
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
      Common.Log.debug( '[Common.api.Rpc._check_response] Success', response );
      this.fireEvent( Common.api.RpcEvents.SUCCESS, response, this );
      Common.api.RpcEvents.fireEvent( Common.api.RpcEvents.SUCCESS, response, this );
    }
  },



  /**
   * Destroys and clean transaction
   *
   * @private
   */
  _destroy_trans: function(){},



  /**
   * Handles timeout callback
   *
   * @private
   */
  _handle_failure: function()
  {
    Common.Log.warn( '[Common.api.Rpc._handle_failure] Timeout failure', this );

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
  },



  /**
   * Detects which endpoint should be used based on local and global configuration options
   *
   * @private
   */
  _detect_endpoint: function()
  {
    this.endpoint = this.endpoint || Common.api.Api.endpoint;
    this.ajax_proxy = this.ajax_proxy || Common.api.Api.ajax_proxy;

    if( Common.utils.Url.isCrossDomain( this.endpoint ) && CommonExt.isIE && CommonExt.ieVersion < 10 && this.ajax_proxy )
    {
      this.endpoint = this.ajax_proxy;
    }

    // Check if the Api endpoint has been defined
    if( !this.endpoint )
    {
      throw '[Common.api.Rpc._detect_endpoint] Endpoint is not defined';
    }
  }

});
