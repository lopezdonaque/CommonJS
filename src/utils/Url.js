
/**
 * URL utility methods
 *
 */
CommonExt.define( 'Common.utils.Url',
{
  singleton: true,


  /**
   * This function creates a new anchor element and uses location
   * properties (inherent) to get the desired URL data. Some String
   * operations are used (to normalize results across browsers).
   *
   * Based on: http://james.padolsey.com/javascript/parsing-urls-with-the-dom/
   *
   * @param {String} url
   * @return {Object}
   */
  parseUrl: function( url )
  {
    var a =  document.createElement( 'a' );
    a.href = url;
    return {
      source: url,
      protocol: a.protocol.replace( ':', '' ),
      host: a.host,
      hostname: a.hostname,
      port: a.port,
      query: a.search,
      params: (function(){
        var ret = {},
          seg = a.search.replace( /^\?/, '' ).split( '&' ),
          len = seg.length, i = 0, s;
        for(; i < len; i++ ){
          if (!seg[i]) { continue; }
          s = seg[i].split('=');
          ret[s[0]] = s[1];
        }
        return ret;
      })(),
      file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
      hash: a.hash.replace('#',''),
      path: a.pathname.replace(/^([^\/])/,'/$1'),
      relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
      segments: a.pathname.replace(/^\//,'').split('/')
    };
  },



  /**
   * Detects cross domain URL based on current document.domain
   *
   * @param {String} url
   * @return {String}
   */
  isCrossDomain: function( url )
  {
    var host = Common.utils.Url.parseUrl( url ).host;
    return ( host != '' && host != document.domain );
  }

});
