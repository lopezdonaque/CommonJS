
/**
 * XDomainRequest transport
 *
 *
 * Usage:
 *     new Common.io.Xdr(
 *     {
 *       url: 'http://domain.com/xdr_test.php',
 *       data:
 *       {
 *         foo1: 'xx',
 *         foo2: 'yy'
 *       },
 *       listeners:
 *       {
 *         success: function( response ){ Common.Log.debug( 'Success', response ); },
 *         error: function( response ){ Common.Log.debug( 'Error', response ); },
 *         timeout: function( response ){ Common.Log.debug( 'Timeout', response ); },
 *       }
 *     }).request();
 *
 */
CommonExt.define( 'Common.io.Xdr',
{
  extend: 'CommonExt.util.Observable',

  config:
  {
    /**
     * The number of milliseconds to wait for a response
     *
     * @property {Number}
     */
    timeout: 30000,


    /**
     * URL
     *
     * @property {String}
     */
    url: null,


    /**
     * Data to send to server
     *
     * @property {Object/String}
     */
    data: null
  },



  /**
   * Creates a new instance
   *
   * @param {Object} config
   */
  constructor: function( config )
  {
    this.initConfig( config );
    this._id = Ext.id();

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
    // Prepare xdr cache
    window.xdr_cache = window.xdr_cache || {};

    var xdr = new XDomainRequest();
    xdr.open( 'POST', this.url );
    xdr.timeout = this.timeout;
    xdr.onload = CommonExt.bind( this._load, this );
    xdr.onerror = CommonExt.bind( this._error, this );
    xdr.ontimeout = CommonExt.bind( this._timeout, this );

    window.xdr_cache[ this._id ] = xdr;

    xdr.send( Ext.isString( this.data ) ? this.data : CommonExt.encode( this.data ) );
  },



  /**
   * Load callback
   *
   * @private
   */
   _load: function()
  {
    var xdr = window.xdr_cache[ this._id ];
    this.fireEvent( 'success', xdr.responseText );
    this._clean();
  },



  /**
   * Error callback
   *
   * @private
   */
   _error: function()
  {
    this.fireEvent( 'error', null );
    this._clean();
  },



  /**
   * Timeout callback
   *
   * @private
   */
  _timeout: function()
  {
    this.fireEvent( 'timeout', null );
    this._clean();
  },



  /**
   * Cleans xdr object
   *
   * @private
   */
  _clean: function()
  {
    var xdr = window.xdr_cache[ this._id ];
    xdr.onload = xdr.onerror = xdr.ontimeout = Ext.emptyFn;
    xdr = undefined;
    delete window.xdr_cache[ this._id ];
  }

});

