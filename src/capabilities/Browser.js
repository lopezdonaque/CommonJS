
/**
 * Browser detection
 *
 * Adapted from http://www.quirksmode.org/js/detect.html
 *
 * Usage:
 *     Common.capabilities.Browser.isIE( 7,8,9 ) // Returns false for IE6
 *     Common.capabilities.Browser.isFirefox( 4 ) // Returns false for Firefox 3
 *
 */
CommonExt.define( 'Common.capabilities.Browser',
{
  singleton: true,


  /**
   * Browser Name
   *
   * @property {String}
   */
  browser: '',


  /**
   * Browser Full Version
   *
   * @property {String}
   */
  version: '',


  /**
   * Browser Major Version (first number before a dot)
   *
   * @property {String}
   */
  majorversion: '',


  /**
   * Operating System
   *
   * @property {String}
   */
  OS: '',



  /**
   * Detect browser, version and OS
   */
  initialize: function()
  {
    this.browser = this._searchString( this._dataBrowser ) || "An unknown browser";
    this.version = this._searchVersion( navigator.userAgent ) || this._searchVersion( navigator.appVersion ) || "an unknown version";
    this.version = this.version.toString();
    this.OS = this._searchString( this._dataOS ) || "an unknown OS";
    this.majorversion = ( '' + this.version ).indexOf( '.' ) != -1 ? this.version.split( '.', 1 )[0] : this.version;
  },



  /**
   * Check if the browser is of one of the given *exact* versions
   *
   * @param {String[]} [arguments] versions to check
   */
  isExactVersion: function()
  {
    for( var i = 0; i < arguments.length; i++ )
    {
      if( arguments[i] == this.version )
      {
        return true;
      }
    }

    return false;
  },



  /**
   * Check if the browser is of one of the given *Major* versions
   *
   * @param {String[]} [arguments] Versions to check. Can be given as ">4" to check for upper versions
   */
  isMajorVersion: function()
  {
    for( var i = 0; i < arguments.length; i++ )
    {
      if( typeof( arguments[i] ) == 'string' && arguments[i][0] == '>' )
      {
        var vtocheck = arguments[i].substr( 1 );

        if( parseInt( vtocheck ) < parseInt( this.majorversion ) )
        {
          return true;
        }
      }

      if( arguments[i] == this.majorversion )
      {
        return true;
      }
    }

    return false;
  },



  /**
   * Check if the browser is Microsoft's Internet Explorer.
   * If numeric or string arguments are passed those are checked against the major version.
   *
   * @param {String[]} [arguments] versions to check
   * @return {Boolean}
   */
  isIE: function()
  {
    var args = Array.prototype.slice.call( arguments );
    return this._isbrowserandversion( "Explorer", args );
  },



  /**
   * Check if the browser is Mozilla Firefox.
   * If numeric or string arguments are passed those are checked against the major version.
   *
   * @param {String[]} [arguments*] versions to check
   * @return {Boolean}
   */
  isFirefox: function()
  {
    var args = Array.prototype.slice.call( arguments );
    return this._isbrowserandversion( "Firefox", args );
  },



  /**
   * Check if the browser is Google Chrome.
   * If numeric or string arguments are passed those are checked against the major version.
   *
   * @param {String[]} [arguments] versions to check
   * @return {Boolean}
   */
  isChrome: function()
  {
    var args = Array.prototype.slice.call( arguments );
    return this._isbrowserandversion( "Chrome", args );
  },



  /**
   * Check if the browser is Apple's Safari.
   * If numeric or string arguments are passed those are checked against the major version.
   *
   * @param {String[]} [arguments] versions to check
   * @return {Boolean}
   */
  isSafari: function()
  {
    var args = Array.prototype.slice.call( arguments );
    return this._isbrowserandversion( "Safari", args );
  },



  /**
   * Check if the browser is Opera.
   * If numeric or string arguments are passed those are checked against the major version.
   *
   * @param {String[]} [arguments] versions to check
   * @return {Boolean}
   */
  isOpera: function()
  {
    var args = Array.prototype.slice.call( arguments );
    return this._isbrowserandversion( "Opera", args );
  },



  /**
   * Check if the browser is the given one by name, and optionally the major versions given as the arguments of the isXXX call.
   *
   * @param {String} name
   * @param {String[]} [args]
   * @return {Boolean}
   * @private
   */
  _isbrowserandversion: function( name, args )
  {
    if( this.browser == name )
    {
      if( args.length == 0 )
      {
        return true;
      }

      return this.isMajorVersion.apply( this, args );
    }
    else
    {
      return false;
    }
  },



  /**
   * Check if the os is one of the given in the arguments
   *
   * @param {String[]} [arguments*]
   */
  isOS: function()
  {
    for( var i = 0; i < arguments.length; i++ )
    {
      if( arguments[i] == this.OS )
      {
        return true;
      }
    }
    return false;
  },



  /**
   * Searchs string
   *
   * @param {Array} data
   * @return {*}
   * @private
   */
  _searchString: function( data )
  {
    for( var i = 0; i < data.length; i++ )
    {
      var dataString = data[i].string;
      var dataProp = data[i].prop;
      this.versionSearchString = data[i].versionSearch || data[i].identity;

      if( dataString )
      {
        if( dataString.indexOf( data[i].subString ) != -1 )
        {
          return data[i].identity;
        }
      }
      else if( dataProp )
      {
        return data[i].identity;
      }
    }
  },



  /**
   * Search version
   *
   * @param dataString
   * @return {*}
   * @private
   */
  _searchVersion: function( dataString )
  {
    var index = dataString.indexOf( this.versionSearchString );

    if( index == -1 )
    {
      return;
    }

    return parseFloat( dataString.substring( index + this.versionSearchString.length + 1 ) );
  },


  _dataBrowser: [
    {
      string: navigator.userAgent,
      subString: "Chrome",
      identity: "Chrome"
    },
    {
      string: navigator.userAgent,
      subString: "OmniWeb",
      versionSearch: "OmniWeb/",
      identity: "OmniWeb"
    },
    {
      string: navigator.vendor,
      subString: "Apple",
      identity: "Safari",
      versionSearch: "Version"
    },
    {
      prop: window.opera,
      identity: "Opera"
    },
    {
      string: navigator.vendor,
      subString: "iCab",
      identity: "iCab"
    },
    {
      string: navigator.vendor,
      subString: "KDE",
      identity: "Konqueror"
    },
    {
      string: navigator.userAgent,
      subString: "Firefox",
      identity: "Firefox"
    },
    {
      string: navigator.vendor,
      subString: "Camino",
      identity: "Camino"
    },
    { // for newer Netscapes (6+)
      string: navigator.userAgent,
      subString: "Netscape",
      identity: "Netscape"
    },
    {
      string: navigator.userAgent,
      subString: "MSIE",
      identity: "Explorer",
      versionSearch: "MSIE"
    },
    {
      string: navigator.userAgent,
      subString: "Gecko",
      identity: "Mozilla",
      versionSearch: "rv"
    },
    { // for older Netscapes (4-)
      string: navigator.userAgent,
      subString: "Mozilla",
      identity: "Netscape",
      versionSearch: "Mozilla"
    }
  ],

  _dataOS: [
    {
      string: navigator.platform,
      subString: "Win",
      identity: "Windows"
    },
    {
      string: navigator.platform,
      subString: "Mac",
      identity: "Mac"
    },
    {
      string: navigator.userAgent,
      subString: "iPad",
      identity: "iOS"
    },
    {
      string: navigator.userAgent,
      subString: "iPhone",
      identity: "iOS"
    },
    {
      string: navigator.userAgent,
      subString: "iPod",
      identity: "iOS"
    },
    {
      string: navigator.platform,
      subString: "android",
      identity: "Android"
    },
    {
      string: navigator.platform,
      subString: "Linux",
      identity: "Linux"
    }
  ]

}, function(){ this.initialize(); } );
