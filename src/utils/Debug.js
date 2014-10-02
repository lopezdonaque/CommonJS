
/**
 * Debug utility methods
 *
 */
CommonExt.define( 'Common.utils.Debug',
{
  singleton: true,


  /**
   * Returns debug parameters to be added to the URL query string
   *
   * @return {Object}
   */
  getDebugParams: function()
  {
    if( !CommonExt.util.Cookies.get( 'start_debug_forward' ) && !CommonExt.util.Cookies.get( 'start_debug_api' ) )
    {
      //return { start_debug: 0 }; // Forces to stop debug because ZendDebuggerCookie could be present on different domain and the bookmarklet can not remove it
      return {};
    }

    var params =
    {
      debug_fastfile: null,
      debug_host: null,
      use_remote: null,
      debug_port: null,
      debug_stop: null,
      original_url: null,
      debug_start_session: null,
      debug_session_id: null,
      send_debug_header: null,
      send_sess_end: null,
      debug_jit: null,
      start_profile: null
    };

    CommonExt.Object.each( params, function( key, value )
    {
      var cookie = CommonExt.util.Cookies.get( key );

      if( !cookie )
      {
        delete params[ key ];
      }
      else
      {
        params[ key ] = CommonExt.util.Cookies.get( key );
      }
    });

    params.start_debug = 1;
    return params;
  }

});
