
/**
 * Manages Internet connection
 *
 * #Examples:
 *
 *     var checker = new Common.utils.ConnectionChecker(
 *     {
 *       method: 'img',
 *       url: Ext.BLANK_IMAGE_URL
 *     });
 *
 *     checker.on( 'online', function(){} );
 *     checker.on( 'offline', function(){} );
 *
 *     checker.start_checker();
 *
 */
CommonExt.define( 'Common.utils.ConnectionChecker',
{
  extend: 'CommonExt.util.Observable',

  config:
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
  _is_online: true,



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

    this.callParent( arguments );
  },



  /**
   * Starts connection checker
   *
   */
  start_checker: function()
  {
    this._interval_id = setInterval( CommonExt.bind( this.check, this ), this.config.interval );
  },



  /**
   * Stops connection checker
   *
   */
  stop_checker: function()
  {
    clearInterval( this._interval_id );
  },



  /**
   * Checks connection using given "options.check_method"
   *
   */
  check: function()
  {
    if( this.config.check_method == 'img' )
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
      xmlReq.open( 'GET', this.config.url + '?' + ( new Date().getTime() ), false );
      xmlReq.send( null );

      if( xmlReq.status == 200 ) // Page was received, so we're online
      {
        this.fire_status( 'online' );
      }
      else
      {
        this.fire_status( 'offline' );
      }
    }
    catch( exc )
    {
      this.fire_status( 'offline' );
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
    img.onload = CommonExt.bind( function(){ this.fire_status( 'online' ); }, this );
    img.onerror = CommonExt.bind( function(){ this.fire_status( 'offline' ); }, this );
    img.src = this.config.url + '?' + ( new Date().getTime() );
  },



  /**
   * Fires status
   *
   * @param {String} status
   */
  fire_status: function( status )
  {
    if( status == 'online' && !this._is_online )
    {
      this._is_online = true;
      this.fireEvent( 'online' );
    }

    if( status == 'offline' && this._is_online )
    {
      this._is_online = false;
      this.fireEvent( 'offline' );
    }
  }

});
