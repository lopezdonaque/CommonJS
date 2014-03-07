
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
  },



  /**
   * Component
   *
   * @param {Function} get_cmp_function
   * @param {Object} scope
   * @return {Function}
   */
  component_renderer: function( get_cmp_function, scope )
  {
    var that = scope || this;

    return function()
    {
      var id = Ext.id();
      var cmp = get_cmp_function.apply( that, arguments );

      // The cmp is not part of the grid items, so we must to destroy it when the grid is destroyed
      that.on( 'beforedestroy', function(){ cmp.destroy(); } );

      setTimeout( function(){ cmp.render( id ); }, 25 );

      return '<div id="' + id + '"></div>';
    };
  },



  /**
   * Converts an object to UL tree
   *
   * @param {Object} obj
   * @param {Number} depth
   * @return {String}
   */
  obj2ULTree: function( obj, depth )
  {
    if( typeof depth == 'undefined' )
    {
      depth = 0;
    }

    if( typeof obj == 'object' && obj )
    {
      var html = '<ul>';
      for( var item in obj )
      {
        if( obj.hasOwnProperty( item ) )
        {
          html += '<li>' + CommonExt.String.repeat( '&nbsp;', depth * 4 ) + item + ': ';
          html += ( typeof obj[ item ] == 'object' && obj[ item ] && depth < 10 ) ? this.obj2ULTree( obj[ item ], ( depth + 1 ) ) : obj[ item ];
          html += '</li>';
        }
      }
    }

    return html + '</ul>';
  }


});
