
/**
 * Format utility methods
 *
 */
CommonExt.define( 'Common.utils.Format',
{
  singleton: true,


  /**
   * Returns yes/no string depending on boolean value
   *
   * @param {Boolean} value
   * @return {String}
   */
  yes_no_renderer: function( value )
  {
    var text = ( value ) ? 'yes' : 'no';
    return Common.Langs.get( text );
  }

});
