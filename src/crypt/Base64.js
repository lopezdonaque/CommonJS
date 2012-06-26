
/**
 * BASE64 functions
 *
 * Based on jQuery plugin:
 * http://www.semnanweb.com/jquery-plugin/base64.html
 *
 * Usage:
 *     var enc = Common.crypt.Base64.encode( 'xxx' );
 *     var dec = Common.crypt.Base64.decode( enc );
 *
 */
CommonExt.define( 'Common.crypt.Base64',
{
  singleton: true,


  /**
   * Key string
   *
   * @private
   * @property {String}
   */
  _keyString: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',



  /**
   * Returns encoded string
   *
   * @param {String} input
   * @return {String}
   */
  encode: function( input )
  {
    var output = '';
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;
    input = this._uTF8Encode( input );
    while( i < input.length )
    {
      chr1 = input.charCodeAt( i++ );
      chr2 = input.charCodeAt( i++ );
      chr3 = input.charCodeAt( i++ );
      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;
      if( isNaN( chr2 ) )
      {
        enc3 = enc4 = 64;
      }
      else if( isNaN( chr3 ) )
      {
        enc4 = 64;
      }

      output = output + this._keyString.charAt(enc1) + this._keyString.charAt(enc2) + this._keyString.charAt(enc3) + this._keyString.charAt(enc4);
    }
    return output;
  },



  /**
   * Returns decoded string
   *
   * @param {String} input
   * @return {String}
   */
  decode: function( input )
  {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    while (i < input.length) {
      enc1 = this._keyString.indexOf(input.charAt(i++));
      enc2 = this._keyString.indexOf(input.charAt(i++));
      enc3 = this._keyString.indexOf(input.charAt(i++));
      enc4 = this._keyString.indexOf(input.charAt(i++));
      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;
      output = output + String.fromCharCode(chr1);
      if (enc3 != 64) {
        output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
        output = output + String.fromCharCode(chr3);
      }
    }
    output = this._uTF8Decode(output);
    return output;
  },



  /**
   * UTF8 encode
   *
   * @private
   * @param {String} string
   * @return {String}
   */
  _uTF8Encode: function( string )
  {
    string = string.replace(/\x0d\x0a/g, "\x0a");
    var output = "";
    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);
      if (c < 128) {
        output += String.fromCharCode(c);
      } else if ((c > 127) && (c < 2048)) {
        output += String.fromCharCode((c >> 6) | 192);
        output += String.fromCharCode((c & 63) | 128);
      } else {
        output += String.fromCharCode((c >> 12) | 224);
        output += String.fromCharCode(((c >> 6) & 63) | 128);
        output += String.fromCharCode((c & 63) | 128);
      }
    }
    return output;
  },



  /**
   * UTF8 decode
   *
   * @private
   * @param {String} input
   * @return {String}
   */
  _uTF8Decode: function( input )
  {
    var string = "";
    var i = 0;
    var c = c1 = c2 = 0;
    while ( i < input.length ) {
      c = input.charCodeAt(i);
      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      } else if ((c > 191) && (c < 224)) {
        c2 = input.charCodeAt(i+1);
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      } else {
        c2 = input.charCodeAt(i+1);
        c3 = input.charCodeAt(i+2);
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        i += 3;
      }
    }
    return string;
  }

});
