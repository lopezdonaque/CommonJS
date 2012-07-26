
/**
 * Generic javascript logger for all the platforms.
 *
 * #Examples:
 *
 * Set level to be displayed on the console
 *
 *     Common.Log.displayLevel = Common.Log.LEVEL_DEBUG;
 *
 *
 * Log methods by level
 *
 *     Common.Log.debug( 'text', { a: 1 }, function(){} );
 *     Common.Log.error( 'text' );
 *
 *
 */
CommonExt.define( 'Common.log.Logger',
{
  alternateClassName: 'Common.Log',
  singleton: true,
  extend: 'CommonExt.util.Observable',


  /** Debug Level constant @property {Number} */
  LEVEL_DEBUG: 1,

  /** Info Level constant @property {Number} */
  LEVEL_INFO: 2,

  /** Warning Level constant @property {Number} */
  LEVEL_WARNING: 3,

  /** Error Level constant @property {Number} */
  LEVEL_ERROR: 4,


  /**
   * Level from which log will be displayed
   *
   * @property {Number}
   */
  displayLevel: 1,



  /**
   * Converts all types of exceptions into an string
   *
   * @param {Object} exc
   */
  excToString: function( exc )
  {
    try
    {
      var str = '';

      if( typeof exc == 'string' )
      {
        str = '\nException caught: ' + exc;
      }
      else
      {
        str = '\nException caught: \ndescription: ' + exc.description + '\nname: ' + exc.name + '\nmessage: ' + exc.message + "\nnumber: " + exc.number;
      }

      str += '\nStack: ' + this.getTrace();
      return str;
    }
    catch( exc )
    {
      return '\nException caught: \ndescription: ' + exc.description + '\nname: ' + exc.name + '\nmessage: ' + exc.message + "\nnumber: " + exc.number;
    }
  },



  /**
   * Returns time as string
   *
   * @private
   * @return {String}
   */
  _getTime: function()
  {
    return CommonExt.Date.format( new Date(), 'H:i:s' );
  },



  /**
   * Gets the stack trace of this call.
   *
   * @return {String}
   */
  getTrace: function()
  {
    return '';

    //get stack trace
    /*try
    {
      var trace = console.trace();
    }
    catch( exc )
    {
      var trace = 'Unknown trace';
    }

    return trace.toString();*/
  },



  /**
   * Logs a message
   *
   * @private
   * @param {Number} level
   * @param {Array} parameters
   */
  _log: function( level, parameters )
  {
    // Check if the level is allowed to be displayed
    if( level < this.displayLevel )
    {
      return;
    }

    try
    {
      // Workaround: if params is arguments this converts to a veritable Array type
      var params = Array.prototype.slice.apply( parameters );

      this.fireEvent( this.get_level_name( level ), params );

      // Convert params to display in IE console
      if( CommonExt.isIE )
      {
        CommonExt.Array.each( params, function( item, index, allItems )
        {
          if( typeof item == 'object' )
          {
            // Encoding large objects could increase browser timings
            //allItems[ index ] = ' ' + CommonExt.encode( item );
          }

          if( typeof item == 'function' )
          {
            allItems[ index ] = ' ' + item.toString();
          }
        }, this );
      }

      var args = [ this._getTime() + ' -' ].concat( params );

      switch( level )
      {
        case this.LEVEL_DEBUG: // console.debug not exists in IE
          var method = ( document.all ) ? console.log : console.debug;
          break;

        case this.LEVEL_INFO:
          var method = console.info;
          break;

        case this.LEVEL_WARNING:
          var method = console.warn;
          break;

        case this.LEVEL_ERROR:
          var method = console.error;
          break;

        default:
          var method = console.log;
          break;
      }

      if( document.all ) // IE
      {
        var method = Function.prototype.call.bind( method, console );
        method.apply( console, args );
      }
      else
        method.apply( console, args );

    }
    catch( exc ) { /* Nothing to do */ }
  },



  /**
   * Debug log
   *
   */
  debug: function()
  {
    this._log( this.LEVEL_DEBUG, arguments );
  },



  /**
   * Info log
   *
   */
  info: function()
  {
    this._log( this.LEVEL_INFO, arguments );
  },



  /**
   * Warning log
   *
   * @param {String} message
   * @param {Object} exc
   */
  warning: function( message, exc )
  {
    if( exc )
    {
      message += ': ' + this.excToString( exc );
    }

    var args = [ message ].concat( Array.prototype.slice.apply( arguments ).splice( 1 ) );
    this._log( this.LEVEL_WARNING, args );
  },



  /**
   * Error log
   *
   * @param {String} message
   * @param {Object} exc
   */
  error: function( message, exc )
  {
    if( exc )
    {
      message += ': ' + this.excToString( exc );
    }

    var args = [ message ].concat( Array.prototype.slice.apply( arguments ).splice( 1 ) );
    this._log( this.LEVEL_ERROR, args );
  },



  /**
   * Returns the level name by given level number
   *
   * @param {Number} level
   * @return {String}
   */
  get_level_name: function( level )
  {
    switch( level )
    {
      case this.LEVEL_DEBUG:
        return 'debug';

      case this.LEVEL_INFO:
        return 'info';

      case this.LEVEL_WARNING:
        return 'warn';

      case this.LEVEL_ERROR:
        return 'error';

      default:
        throw 'Level not found';
    }
  }

});
