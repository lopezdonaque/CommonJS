
/**
 * Manages language resource from global or specific contexts
 *
 * Define language resources object:
 *     window.language_resources =
 *     {
 *       "":
 *       {
 *         "consultant": "Consultant"
 *       },
 *       "context1":
 *       {
 *         "consultant": "Professional"
 *       }
 *     };
 *
 * Retrieve resource from global:
 *     var text = Common.Langs.get( 'consultant' );
 *
 * Retrieve resource from specific context. It automatically try to search in global context if not found in the specific context.
 *     var text = Common.Langs.get( 'context1', 'consultant' );
 *
 *
 */
CommonExt.define( 'Common.Langs',
{
  singleton: true,


  /**
   * Returns language string
   *
   * @return {String}
   */
  get: function()
  {
    // Check if "language_resources" is defined
    if( !window.language_resources )
    {
      throw '[Common.Langs.get] window.language_resources is not defined';
    }

    // If only has one argument, get the string from global
    if( arguments.length == 1 )
    {
      return this._getGlobal( arguments[ 0 ] );
    }

    return this._get( arguments[ 0 ], arguments[ 1 ] );
  },



  /**
   * Returns language string from global
   *
   * @private
   * @param {String} string_name
   * @return {String}
   */
  _getGlobal: function( string_name )
  {
    var lang;
    string_name = string_name.toLowerCase();

    // Check if language resources has only one level
    if( typeof language_resources[ '' ] == 'undefined' )
    {
      return ( ( lang = language_resources[ string_name ] ) ) ? lang : 'E[' + string_name + ']';
    }

    if( ( lang = language_resources[ '' ][ string_name ] ) )
    {
      return lang;
    }

    return 'E[' + string_name + ']';
  },



  /**
   * Returns language string
   *
   * @private
   * @param {String} app_name
   * @param {String} string_name
   * @return {String}
   */
  _get: function( app_name, string_name )
  {
    var lang;
    app_name = app_name.toLowerCase();
    string_name = string_name.toLowerCase();

    if( app_name != '' && language_resources[ app_name ] && ( lang = language_resources[ app_name ][ string_name ] ) )
    {
      return lang;
    }

    if( ( lang = language_resources[ '' ][ string_name ] ) )
    {
      return lang;
    }

    return 'E[' + app_name + '] [' + string_name + ']';
  }

});
