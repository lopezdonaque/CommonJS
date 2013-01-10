
/**
 * Manages Internet connection
 *
 * #Examples:
 *
 *     Common.utils.ConnectionChecker.init(
 *     {
 *       method: 'img',
 *       url: Ext.BLANK_IMAGE_URL
 *     });
 *
 *     Common.utils.ConnectionChecker.on( 'online', function(){} );
 *     Common.utils.ConnectionChecker.on( 'offline', function(){} );
 *
 *     Common.utils.ConnectionChecker.start_checker();
 *
 */
CommonExt.define( 'Common.utils.ConnectionChecker',
{
  singleton: true,
  extend: 'CommonExt.util.Observable',


  options:
  {

    /**
     * Check method (xhr or img)
     *
     * @property {String}
     */
    check_method: 'img',


    /**
     * URL to check Internet connection
     *
     * @property {String}
     */
    url: null,


    /**
     * Interval to check connection
     *
     * @property {String}
     */
    interval: 5000
  },


  /**
   * Defines if it is online
   *
   * @private
   * @property {Boolean}
   */
  is_online: true,



  /**
   * Initializes the object
   *
   * @param {Object=} options
   */
  init: function( options )
  {
    CommonExt.merge( this.options, options || {} );

    this.addEvents(

      /**
       * @event online
       * Fired when connection changes from offline to online
       */
      'online',

      /**
       * @event offline
       * Fired when connection changes from online to offline
       */
      'offline'
    );
  },



  /**
   * Starts connection checker
   *
   */
  start: function()
  {
    this._interval_id = setInterval( CommonExt.bind( this.check, this ), this.options.interval );

    // Workaround:
    // Chrome continues checking while page is reloading so we need to stop it.
    // We also add a timeout to start it if beforeunload is cancelled by user
    if( CommonExt.isChrome )
    {
      CommonExt.get( window ).on( 'beforeunload', this._beforeunload_stop, this );
    }
  },



  /**
   * Stops connection checker
   *
   */
  stop: function()
  {
    clearInterval( this._interval_id );

    if( CommonExt.isChrome )
    {
      CommonExt.get( window ).un( 'beforeunload', this._beforeunload_stop, this );
    }
  },



  /**
   * Checks connection using given "options.check_method"
   *
   */
  check: function()
  {
    if( this.options.check_method == 'img' )
    {
      this._check_connection_img();
    }
    else
    {
      this._check_connection_xhr();
    }
  },



  /**
   * Checks connection using XHR
   *
   * @private
   */
  _check_connection_xhr: function()
  {
    try
    {
      var xmlReq = new XMLHttpRequest();
      xmlReq.open( 'GET', this.options.url + '?' + ( new Date().getTime() ), false );
      xmlReq.send( null );

      if( xmlReq.status == 200 ) // Page was received, so we're online
      {
        this._fire_status( 'online' );
      }
      else
      {
        this._fire_status( 'offline' );
      }
    }
    catch( exc )
    {
      this._fire_status( 'offline' );
    }
  },



  /**
   * Checks connection using image
   *
   * @private
   */
  _check_connection_img: function()
  {
    var img = new Image();
    img.onload = CommonExt.bind( function(){ this._fire_status( 'online' ); }, this );
    img.onerror = CommonExt.bind( function(){ this._fire_status( 'offline' ); }, this );
    img.src = this.options.url + '?' + ( new Date().getTime() );
  },



  /**
   * Fires status
   *
   * @param {String} status
   * @private
   */
  _fire_status: function( status )
  {
    if( status == 'online' && !this.is_online )
    {
      this.is_online = true;
      this.fireEvent( 'online' );
    }

    if( status == 'offline' && this.is_online )
    {
      this.is_online = false;
      this.fireEvent( 'offline' );
    }
  },



  /**
   * Stops checker on beforeunload event
   *
   * @private
   */
  _beforeunload_stop: function()
  {
    this.stop();
    CommonExt.defer( this.start, 5000, this );
  }

});
