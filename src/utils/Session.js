
/**
 * Manages session with javascript
 *
 * #Examples:
 *
 *     var session = new Common.utils.Session(
 *     {
 *       time: 600000,
 *       time_left: 120000,
 *       msg: 'Your session is about to expire. If you want to stay connected, please press OK.',
 *       msg_expired: 'Sorry, your session has expired.',
 *       renew_url: 'http://domain.com/renew_session.php',
 *       logout_url: 'http://domain.com/logout.php' || 'javascript:window.close();',
 *       listeners:
 *       {
 *         renew: function(){},
 *         logout: function(){}
 *       }
 * });
 *
 */
CommonExt.define( 'Common.utils.Session',
{
  extend: 'CommonExt.util.Observable',


  /**
   * Defines if the session has been expired
   *
   * @property {Boolean}
   */
  expired: false,


  /**
   * Identifier of the timeout while session is valid
   *
   * @private
   * @property {Number}
   */
  _timeout_id: null,


  /**
   * Date before the confirm is displayed.
   * It is compared with the date when the user clicks on confirm, to know how many time has been waiting user to click on renew session.
   *
   * @private
   * @property {Date}
   */
  _start_confirm: null,


  /**
   * Options
   *
   * @property {Object}
   */
  config:
  {

    /**
     * Defines if the session will be renewed automatically when it expires
     *
     * @property {Boolean}
     */
    auto_renew: false,


    /**
     * Time to wait to display the confirm if the session is not renewed (milliseconds)
     * Duration time of the session
     *
     * @property {Number}
     */
    time: null,


    /**
     * Time that user has to click on accept button of the confirm (milliseconds)
     *
     * @property {Number}
     */
    time_left: null,


    /**
     * Message to ask the user if wants to renew the session
     *
     * @property {String}
     */
    msg: '',


    /**
     * Message to display when session has expired
     *
     * @property {String}
     */
    msg_expired: '',


    /**
     * URL to call by ajax to renew the session in the server
     *
     * @property {String}
     */
    renew_url: '',


    /**
     * URL to redirect the user if the session expire or doesn't accept to renew
     *
     * @property {String}
     */
    logout_url: ''
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
       * @event renew
       * Fired on renew session
       */
      'renew',

      /**
       * @event logout
       * Fired on logout
       */
      'logout'
    );

    this.callParent( arguments );

    // Init to count time to expire the session
    this.refresh();
  },



  /**
   * Refresh the session
   *
   */
  refresh: function()
  {
    Common.Log.debug( '[Common.utils.Session.refresh] Refreshing session' );

    // Remove any previous timeout
    clearTimeout( this._timeout_id );

    // Set the new timeout
    this._timeout_id = setTimeout( CommonExt.bind( this.timeout, this ), this.config.time );
  },



  /**
   * Changes the session to expired
   *
   * @return {Boolean}
   */
  has_expired: function()
  {
    // Get the milliseconds waiting
    var time_waiting = new Date().getTime() - this._start_confirm.getTime();

    // Verify if the difference between start_confirm and now is less than time_left
    return ( this.config.time_left < time_waiting );
  },



  /**
   * Displays the session timeout
   *
   */
  timeout: function()
  {
    if( !this.config.auto_renew )
    {
      // Initialize the timeout to expire the session if the user doesn't click on the confirm
      this._start_confirm = new Date();

      // Ask the user to refresh the session
      var res = confirm( this.config.msg || 'Session timeout.' );

      // If cancel the confirm
      if( !res )
      {
        this.logout();
        return;
      }

      // Verify if the session has expired ( the user doesn't click on the confirm )
      if( this.has_expired() )
      {
        alert( this.config.msg_expired );
        this.logout();
        return;
      }
    }

    // Renew the session
    this.renew();
  },



  /**
   * Renews the session
   *
   */
  renew: function()
  {
    Common.Log.debug( '[Common.utils.Session.renew] Renew session' );

    this.fireEvent( 'renew' );

    // Call the url to renew the session
    if( this.config.renew_url )
    {
      Ext.Ajax.request(
      {
        url: this.config.renew_url,
        success: CommonExt.bind( function(){ this.refresh(); }, this ),
        failure: function(){ alert( 'Session renew failure.' ); }
      });
    }
    else
    {
      this.refresh();
    }
  },



  /**
   * Finalizes the session and redirects to the logout url
   *
   */
  logout: function()
  {
    this.fireEvent( 'logout' );

    if( this.config.logout_url )
    {
      window.location.replace( this.config.logout_url );
    }
  }

});
