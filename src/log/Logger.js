
/**
 * Generic javascript logger for all the platforms.
 *
 * #Examples:
 *
 * Set level to be displayed on the console
 *     Common.Log.displayLevel = Common.Log.LEVEL_DEBUG;
 *
 *
 * Log methods by level
 *     Common.Log.debug( 'text', { a: 1 }, function(){} );
 *     Common.Log.error( 'text' );
 *
 * Show the log:
 *     Common.Log.show_log();
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

  /** Notice Level constant @property {Number} */
  LEVEL_NOTICE: 3,

  /** Warning Level constant @property {Number} */
  LEVEL_WARN: 4,

  /** Error Level constant @property {Number} */
  LEVEL_ERROR: 5,


  /**
   * Level from which log will be displayed
   *
   * @property {Number}
   */
  displayLevel: 1,


  /**
   * Logs buffer
   *
   * @property {Array}
   * @private
   */
  _buffer: [],


  /**
   * Max logs to store in the buffer
   *
   * @property {Number}
   */
  max_buffer: 750,



  /**
   * Returns time as string
   *
   * @return {String}
   * @private
   */
  _getTime: function()
  {
    return CommonExt.Date.format( new Date(), 'H:i:s' );
  },



  /**
   * Logs a message
   *
   * @param {Number} level
   * @param {Array} parameters
   * @private
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

      if( this._buffer.length >= this.max_buffer )
      {
        // This formula allows "max" to change (via debugger), where the more obvious "max/4" would not quite be the same
        CommonExt.Array.erase( this._buffer, 0, this._buffer.length - 3 * Math.floor( this.max_buffer / 4 ) ); // Keep newest 75%
      }

      var buffer_log = [ this.get_level_name( level ), args ];
      this._buffer.push( buffer_log );

      this.fireEvent( 'beforelog', buffer_log );
      this.fireEvent( this.get_level_name( level ), params );

      var method;

      switch( level )
      {
        case this.LEVEL_DEBUG: // "console.debug" not exists in IE
          method = ( document.all ) ? console.log : console.debug;
          break;

        case this.LEVEL_INFO:
          method = console.info;
          break;

        case this.LEVEL_NOTICE:
          method = console.info;
          break;

        case this.LEVEL_WARN:
          method = console.warn;
          break;

        case this.LEVEL_ERROR:
          method = console.error;
          break;

        default:
          method = console.log;
          break;
      }

      if( document.all ) // IE
      {
        // Workaround for IE: "console.xx.apply" is undefined
        Function.prototype.apply.apply( method, [ console, args ] );
      }
      else
      {
        method.apply( console, args );
      }
    }
    catch( exc ) { /* Nothing to do */ }
  },



  /**
   * Debug log
   */
  debug: function()
  {
    this._log( this.LEVEL_DEBUG, arguments );
  },



  /**
   * Info log
   */
  info: function()
  {
    this._log( this.LEVEL_INFO, arguments );
  },



  /**
   * Notice log
   */
  notice: function()
  {
    this._log( this.LEVEL_NOTICE, arguments );
  },



  /**
   * Warning log
   */
  warn: function()
  {
    this._log( this.LEVEL_WARN, arguments );
  },



  /**
   * Warning log
   * For backward compatibility.
   */
  warning: function()
  {
    this._log( this.LEVEL_WARN, arguments );
  },



  /**
   * Error log
   */
  error: function()
  {
    this._log( this.LEVEL_ERROR, arguments );
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

      case this.LEVEL_NOTICE:
        return 'notice';

      case this.LEVEL_WARN:
        return 'warn';

      case this.LEVEL_ERROR:
        return 'error';

      default:
        throw 'Level not found';
    }
  },



  /**
   * Shows the log in a popup window
   *
   */
  show_log: function()
  {
    // Check if the popup is already opened
    if( this.popup && !this.popup.closed )
    {
      return;
    }

    this.popup = window.open( '', 'log', 'width=500, height=500, scrollbars=1, toolbar=1' );

    this.popup.document.write(
    [
      '<html><body></body></html>'
    ].join( '' ) );

    CommonExt.Array.each( this._buffer, function( item ){ this._add_log_to_popup( item ); }, this );

    // Set listener to append new logs
    this.un( 'beforelog', this._add_log_to_popup, this );
    this.on( 'beforelog', this._add_log_to_popup, this );
  },



  /**
   * Adds a log to popup window
   *
   * @param {Array} data
   * @private
   */
  _add_log_to_popup: function( data )
  {
    // Check if the popup is already opened
    if( this.popup && this.popup.closed )
    {
      return;
    }

    var div = document.createElement( 'div' );
    div.innerHTML = CommonExt.encode( data );
    this.popup.document.body.appendChild( div );
  }

});
