
/**
 * Manages "getUserMedia" browser permissions
 *
 * Usage:
 *
 *     new Common.utils.UserMediaChecker(
 *     {
 *       wait_request: 2000, // Wait time untils the request event if fired
 *       listeners:
 *       {
 *         scope: this,
 *         request: function(){ console.log( 'request' ); },
 *         denied:
 *         {
 *           scope: this,
 *           delay: 2000, // Delay to be sure the checking permissions modal is readable
 *           fn: function(){ console.log( 'denied' ); }
 *         },
 *         allowed:
 *         {
 *           scope: this,
 *           delay: 2000, // Delay to be sure the checking permissions modal is readable
 *           fn: function(){ console.log( 'allowed' ); }
 *         },
 *         unsupported: function(){ console.log( 'unsupported' ); }
 *       }
 *     }).start();
 *
 */
CommonExt.define( 'Common.utils.UserMediaChecker',
{
  extend: 'CommonExt.util.Observable',
  config:
  {

    /**
     * Time to wait to trigger that the navigator if requesting the user for media permissions
     *
     * If permissions are already accepted, the navigator may take some time to respond.
     *
     * @var {Number}
     */
    wait_request: 500,


    /**
     * The media types that support the LocalMediaStream object returned in the successCallback
     *
     * @var {Object}
     */
    constraints:
    {
      audio: true,
      video: true
    }
  },



  /**
   * Constructor
   *
   * @param {Object} config
   */
  constructor: function( config )
  {
    this.initConfig( config );
    this.addEvents(

      /**
       * @event allowed
       * Event fired when permissions are allowed
       */
      'allowed',

      /**
       * @event denied
       * Event fired when permissions are denied
       */
      'denied',

      /**
       * @event permission
       * Event fired when permissions are requested
       */
      'request',

      /**
       * @event unsupported
       * Event fired when "getUserMedia" is not supported by the browser
       */
      'unsupported'
    );

    this.callParent( arguments );
    return this;
  },



  /**
   * Starts request for permissions
   */
  start: function()
  {
    if( !this.hasMedia() )
    {
      this.fireEvent( 'unsupported' );
      return;
    }

    this._request();

    // Use a timeout to don't fire event if permissions are already accepted
    this._timeout_id = CommonExt.defer( function(){ this.fireEvent( 'request' ); }, this.config.wait_request, this );

    // Some browsers hide the permissions dialog on user clicks or browser focusout, so we must force dialog again since permissions are allowed or denied
    if( CommonExt.firefoxVersion > 0 )
    {
      this._prepare_force_dialog();
    }
  },



  /**
   * Returns user media function
   *
   * @return {Object}
   */
  getMedia: function()
  {
    return navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
  },



  /**
   * Returns if the browser has user media function
   *
   * @return {Boolean}
   */
  hasMedia: function()
  {
    return this.getMedia() ? true : false;
  },



  /**
   * Request
   *
   * @private
   */
  _request: function()
  {
    this.getMedia().apply( navigator, [ this.config.constraints, CommonExt.bind( this._request_success, this ), CommonExt.bind( this._request_error, this ) ] );
  },



  /**
   * Request success event handler
   *
   * @param {Object} localMediaStream
   * @private
   */
  _request_success: function( localMediaStream )
  {
    localMediaStream.stop(); // Stop to avoid favicon media indicator on Chrome
    clearTimeout( this._timeout_id );

    if( !this._status )
    {
      this.fireEvent( 'allowed' );
      this._status = 'allowed';
    }
  },



  /**
   * Request error event handler
   *
   * @param {String} error
   * @private
   */
  _request_error: function( error )
  {
    clearTimeout( this._timeout_id );

    if( !this._status )
    {
      this.fireEvent( 'denied', error );
      this._status = 'denied';
    }
  },



  /**
   * Prepares events to force dialog appears
   *
   * @private
   */
  _prepare_force_dialog: function()
  {
    CommonExt.getBody().on( 'click',  this._request, this );
    this.on( 'allowed', function(){ CommonExt.getBody().un( 'click', this._request, this ); }, this );
    this.on( 'denied', function(){ CommonExt.getBody().un( 'click', this._request, this ); }, this );
  }

});

