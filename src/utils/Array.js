
/**
 * Array utility methods
 *
 */
CommonExt.define( 'Common.utils.Array',
{
  singleton: true,


  /**
   * Returns the first item in the array which elicits a true return value from the passed selection function.
   *
   * @param {Array} array
   * @param {Function} fn
   * @param {Object=} scope
   */
  findBy: function( array, fn, scope )
  {
    var collection = new CommonExt.util.MixedCollection();
    collection.addAll( array );
    return collection.findBy( fn, scope );
  }

});
