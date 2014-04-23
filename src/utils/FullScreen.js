
/**
 * FullScreen api methods
 * Based on: http://johndyer.name/native-fullscreen-javascript-api-plus-jquery-plugin/
 *
 * Usage:
 *
 *     if( Common.utils.FullScreen.isSupported() )
 *     {
 *       Ext.getBody().on( 'click', function()
 *       {
 *         Common.utils.FullScreen.requestFullScreen( document.body );
 *       });
 *     }
 *
 * Listen fullscreen change events:
 *
 *     Common.utils.FullScreen.on_fullscreenchange( function()
 *     {
 *       alert( 'fullscreen has been changed' );
 *     });
 *
 */
CommonExt.define( 'Common.utils.FullScreen',
{
  singleton: true,


  /**
   * Defines if fullscreen is supported or not
   *
   * @private
   * @var {Boolean}
   */
  _isSupported: undefined,


  /**
   * Browser prefix which is supported (webkit, moz, o, ms, khtml)
   *
   * @private
   * @var {String}
   */
  _browser_prefix: '',



  /**
   * Returns if fullscreen is supported or not
   *
   * @return {Boolean}
   */
  isSupported: function()
  {
    // Check if supported is already retrieved
    if( CommonExt.isDefined( this._isSupported ) )
    {
      return this._isSupported;
    }

    // Check for native support
    if( typeof document.cancelFullScreen != 'undefined' )
    {
      this._isSupported = true;
      return this._isSupported;
    }

    // Check for support by vendor prefix
    var browserPrefixes = 'webkit moz o ms khtml'.split( ' ' );

    for( var i = 0, il = browserPrefixes.length; i < il; i++ )
    {
      var prefix = browserPrefixes[ i ];

      if( typeof document[ prefix + 'CancelFullScreen' ] != 'undefined' )
      {
        this._browser_prefix = prefix;
        this._isSupported = true;
        return this._isSupported;
      }
    }

    this._isSupported = false;
    return this._isSupported;
  },



  /**
   * Returns if fullscreen is enable or not
   *
   * @return {Boolean}
   */
  isFullScreen: function()
  {
    if( !this.isSupported() )
    {
      return false;
    }

    switch( this._browser_prefix )
    {
      case '':
        return document.fullScreen;

      case 'webkit':
        return document.webkitIsFullScreen;

      case 'moz':
        return window.fullScreen || document.mozFullScreen;

      default:
        return document[ this._browser_prefix + 'FullScreen' ];
    }
  },



  /**
   * Request fullscreen for the given DOM element
   *
   * @param {Object} el
   * @return {Boolean}
   */
  requestFullScreen: function( el )
  {
    if( !this.isSupported() )
    {
      return false;
    }

    return ( this._browser_prefix === '' ) ? el.requestFullScreen() : el[ this._browser_prefix + 'RequestFullScreen' ]( Element.ALLOW_KEYBOARD_INPUT );
  },



  /**
   * Cancels fullscreen
   *
   * @return {Boolean}
   */
  cancelFullScreen: function()
  {
    if( !this.isSupported() )
    {
      return false;
    }

    return ( this._browser_prefix === '' ) ? document.cancelFullScreen() : document[ this._browser_prefix + 'CancelFullScreen' ]();
  },



  /**
   * Adds listener for fullscreen change event
   *
   * @param {Function} callback
   * @param {Object=} scope
   */
  on_fullscreenchange: function( callback, scope )
  {
    CommonExt.get( document ).on( this._browser_prefix + 'fullscreenchange', callback, scope );
  }

});
