
/**
 * Utility class to manage browser cookies
 *
 *
 * #Examples:
 *
 * Set the value of a cookie
 *     Common.Cookies.set( 'the_cookie', 'the_value' );
 *
 * Create a cookie with all available options
 *     Common.Cookies.set( 'the_cookie', 'the_value', { expires: 7, path: '/', domain: 'yourdomain.com', secure: true } );
 *
 * Delete a cookie by passing null as value. Keep in mind that you have to use the same path and domain used when the cookie was set.
 *     Common.Cookie.set( 'the_cookie', null );
 *
 */
CommonExt.define( 'Common.Cookies',
{
  singleton: true,


  /**
   * Returns cookie value
   *
   * @param {String} name
   * @return {String}
   */
  get: function( name )
  {
    return this._cookie( name );
  },



  /**
   * Set cookie
   *
   * @param {String} name
   * @param {String} value
   * @param {Object=} options
   */
  set: function( name, value, options )
  {
    this._cookie( name, value, options );
  },



  /**
   * Private method to get or set cookies
   *
   * @private
   * @param {String} name
   * @param {String} value
   * @param {Object=} options
   * @return {String}
   */
  _cookie: function( name, value, options )
  {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        // CAUTION: Needed to parenthesize options.path and options.domain
        // in the following expressions, otherwise they evaluate to undefined
        // in the packed version for some reason...
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                //var cookie = jQuery.trim(cookies[i]);
                var cookie = cookies[ i ].replace( /^\s+|\s+$/g, "" );
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
  }

});
