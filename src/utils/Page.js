
/**
 * Page utility methods
 *
 */
CommonExt.define( 'Common.utils.Page',
{
  singleton: true,


  /**
   * Redirects the page
   *
   * @param {Object=} options
   * @param {String=} options.url
   * @param {Boolean=} options.clean_beforeunload Cleans all the beforeunload events
   * @param {Boolean=} options.use_replace Uses "replace" instead of "href". The difference between location.href and location.replace is that the former creates a new history entry on the visitor's browser meaning that if they hit the back button, they can get in a 'redirection loop' which is usually undesirable and may have unwanted side effects.
   */
  redirect: function( options )
  {
    var default_options =
    {
      url: 'about:blank',
      clean_beforeunload: false,
      use_replace: false
    };

    options = CommonExt.merge( default_options, options || {} );

    if( options.clean_beforeunload )
    {
      this.remove_beforeunload_event();
    }

    if( options.use_replace )
    {
      window.location.replace( options.url );
    }
    else
    {
      window.location.href = options.url;
    }
  },



  /**
   * Closes the page
   *
   * @param {String} url
   */
  close: function( url )
  {
    Common.utils.Page.remove_beforeunload_event();
    window.open( '', '_self', '' );  // WORKAROUND: use this to avoid IE confirmation message
    window.close();
  },



  /**
   * Removes before unload event
   *
   */
  remove_beforeunload_event: function()
  {
    window.onbeforeunload = null;
  },



  /**
   * Adds "goodbye" to beforeunload event
   *
   */
  add_beforeunload_goodbye: function()
  {
    window.onbeforeunload = Common.utils.Page.goodbye;
  },



  /**
   * Method to confirm if the user wants to leave out the portal
   *
   * @param {Object} e
   */
  goodbye: function( e )
  {
    if( CommonExt.isWebKit ) // Chrome, Safari
    {
      return Common.Langs.get( 'goodbye_message');
    }

    if( !e )
    {
      e = window.event;
    }

    if( CommonExt.isIE )
    {
      e.returnValue = ''; // Message to display on the dialog
      e.cancelBubble = true; // e.cancelBubble is supported by IE - this will kill the bubbling process.
    }
    else if( CommonExt.isGecko )
    {
      if( e.stopPropagation ) // e.stopPropagation works in Firefox.
      {
        e.stopPropagation();
        e.preventDefault();
      }
    }
  },



  /**
   * Returns if the user has a popup blocker enabled
   *
   * @return {Boolean}
   */
  has_antipopup: function()
  {
    try
    {
      Common.Log.debug( '[Common.utils.Page.has_antipopup] Has antipopup checker' );

      // Check if the user has already passed the antipopup checker
      if( CommonExt.util.Cookies.get( 'allow_popups' ) == '1' )
      {
        Common.Log.debug( '[Common.utils.Page.has_antipopup] Allow popups cookie setted' );
        return false;
      }

      var params = 'scrollbars=0,resizable=0,directories=0,location=0,menubar=0,status=0,titlebar=0,toolbar=0,width=0,height=0';
      var popup = window.open( 'about:blank', 'check_antipopup', params );

      // Verify if popup blocker is enabled
      if( popup === null )
      {
        return true;
      }

      popup.close();
      CommonExt.util.Cookies.set( 'allow_popups', '1', CommonExt.Date.add( new Date(), CommonExt.Date.DAY, 3 ), '/' );

      return false;
    }
    catch( e )
    {
      Common.Log.warn( '[Common.utils.Page.has_antipopup]', e );
      return false;
    }
  }

});
