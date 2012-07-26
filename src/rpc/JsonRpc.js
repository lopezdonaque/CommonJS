
/**
 * JsonRpc request
 *
 * Usage:
 *
 *     new Common.rpc.JsonRpc(
 *     {
 *       endpoint: 'http://domain.com/jsonrpc_test.php',
 *       method: 'add',
 *       params: [ 1, 2 ],
 *       listeners:
 *       {
 *         success: function( response ){ Common.Log.debug( 'Success', response ); },
 *         error: function( response ){ Common.Log.debug( 'Error', response ); },
 *         timeout: function( response ){ Common.Log.debug( 'Timeout', response ); }
 *       }
 *     }).request();
 *
 *
 * PHP endpoint example for same origin requests (NOT cross domain requests) (using Zend Framework):
 *
 *     require_once 'Zend/Loader/Autoloader.php';
 *     Zend_Loader_Autoloader::getInstance();
 *
 *     class Calculator
 *     {
 *       public function add( $x, $y ){ return $x + $y; }
 *       public function substract( $x, $y ){ return $x - $y; }
 *     }
 *
 *     $server = new Zend_Json_Server();
 *     $server->setClass( 'Calculator' );
 *     $server->handle();
 *
 */
CommonExt.define( 'Common.rpc.JsonRpc',
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
     * The number of milliseconds to wait for a response
     *
     * @property {Number}
     */
    timeout: 30000,


    /**
     * Endpoint URL
     *
     * @property {String}
     */
    endpoint: null,


    /**
     * Method to call
     *
     * @property {String}
     */
    method: null,


    /**
     * Parameters of the method
     *
     * @property {Array}
     */
    params: []
  },


  /**
   * Creates a new task object
   *
   * @param {Object} config
   */
  constructor: function( config )
  {
    this.id = ++Common.rpc.JsonRpc.ID;
    this.initConfig( config );

    this.addEvents(

      /**
       * Success event
       *
       * @event success
       */
      'success',

      /**
       * Error event
       *
       * @event error
       */
      'error',

      /**
       * Timeout event
       *
       * @event timeout
       */
      'timeout'
    );

    this.callParent( arguments );
    return this;
  },



  /**
   * Sends request
   *
   */
  request: function()
  {
    if( Common.utils.Url.isCrossDomain( this.endpoint ) )
    {
      if( CommonExt.isIE6 || CommonExt.isIE7 )
      {
        throw '[Common.rpc.JsonRpc.request] IE6 and IE7 does not support cross domain JsonRpc requests';
      }
      else if( CommonExt.isIE )
      {
        this._request_with_xdr();  // WARNING, xdr only allows text/plain, but jsonrpc requires application/json
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
   * Do request using XDomainRequest transport
   *
   * @private
   */
  _request_with_xdr: function()
  {
    Common.Log.debug( '[Common.rpc.JsonRpc._request_with_xdr] Request with xdr', this );

    new Common.io.Xdr(
    {
      url: this.endpoint,
      data: this._get_request_data(),
      timeout: this.timeout,
      listeners:
      {
        success: CommonExt.bind( this._success, this ),
        error: CommonExt.bind( this._error, this ),
        timeout: CommonExt.bind( this._timeout, this )
      }
    }).request();
  },



  /**
   * Do request using XmlHttpRequest (Ajax)
   *
   * @private
   */
  _request_with_xhr: function()
  {
    Common.Log.debug( '[Common.rpc.JsonRpc._request_with_xhr] Request with xhr', this );

    CommonExt.Ajax.request(
    {
      url: this.endpoint,
      timeout: this.timeout,
      headers:
      {
        'Content-Type': 'application/json'
      },
      method: 'post',
      params: this._get_request_data(),
      success: CommonExt.bind( function( resp ){ this._success( resp.responseText ); }, this ),
      failure: CommonExt.bind( this._error, this )
    });
  },



  /**
   * Returns all the parameters used by JsonRpc protocol to send with the request
   *
   * @private
   * @return {Object}
   */
  _get_request_data: function()
  {
    return CommonExt.encode({
      jsonrpc: '2.0',
      id: this.id,
      method: this.method,
      params: this.params
    });
  },



  /**
   * Success callback
   *
   * @param {String} response
   */
  _success: function( response )
  {
    var resp = CommonExt.decode( response );

    if( !resp.error )
    {
      this.fireEvent( 'success', resp.result, resp );
    }
    else
    {
      this.fireEvent( 'error', resp.error, resp );
    }
  },



  /**
   * Error callback
   *
   */
  _error: function()
  {
    this.fireEvent( 'error' );
  },



  /**
   * Timeout callback
   *
   */
  _timeout: function()
  {
    this.fireEvent( 'timeout' );
  }

});
