
/**
 * Detects browser plugins
 *
 * Usage:
 *     var hasFlash = Common.capabilities.BrowserPlugins.hasFlash();
 *
 */
CommonExt.define( 'Common.capabilities.BrowserPlugins',
{
  singleton: true,


  /**
   * XPCOM and ActiveX names of the Intellivic SDK plugin
   *
   * @property {String[]}
   */
  PLUGIN_INTELLIVIC: [ 'Intellivic SDK', 'intellivic_sdk_ax.Intellivic_AX.1' ],


  /**
   * XPCOM and ActiveX names of the Flash plugin
   *
   * @property {String[]}
   */
  PLUGIN_FLASH: [ 'Shockwave Flash', 'ShockwaveFlash.ShockwaveFlash' ],



  /**
   * Is the Flash Plugin present in this browser?
   *
   * @return {Boolean}
   */
  hasFlash: function()
  {
    if( typeof( swfobject ) != 'undefined' )
    {
      var version = swfobject.getFlashPlayerVersion();
      return !( version.major == '0' && version.minor == '0' && version.release == '0' );
    }

    return this.has_plugin( this.PLUGIN_FLASH );
  },



  /**
   * Is the Intellivic SDK plugin present in this browser?
   *
   * @return {Boolean}
   */
  hasIntellivicSDK: function()
  {
    return this.has_plugin( this.PLUGIN_INTELLIVIC );
  },



  /**
   * Check if the given plugin is present
   *
   * @param {String[]} names the plugin internal ids in navigator.plugins/iexplorer
   * @return {Boolean} true if the plugin exists, false if not or cannot be checked
   */
  has_plugin: function( names )
  {
    if( CommonExt.isIE )
    {
      if( names.length > 1 )
      {
        try
        {
          new ActiveXObject( names[1] );
          return true;
        }
        catch ( e )
        {
          return false;
        }
      }
      else
      {
        return false;
      }
    }
    else
    {
      if( navigator.plugins )
      {
        if( names.length > 1 )
        {
          return navigator.plugins[ names[ 0 ] ] ? true : false;
        }
        else
        {
          return false;
        }
      }
    }

    return false;
  }

});
