
/**
 * Html utility methods
 *
 */
CommonExt.define( 'Common.utils.Html',
{
  singleton: true,


  /**
   * Returns the max parent z-index
   *
   * @param {String|Object} selector Id or dom node
   * @return {Number}
   */
  get_max_zindex: function( selector )
  {
    var zindex = 1;
    var parent = CommonExt.get( selector ).parent();

    while( parent.dom.tagName.toLowerCase() != 'body' )
    {
      var parent_zindex = this.get_style( parent.dom, 'zIndex' );

      if( parent_zindex != 'auto' && parseInt( parent_zindex ) > zindex )
      {
        zindex = parent_zindex;
      }

      parent = parent.parent();
    }

    return parseInt( zindex );
  },



  /**
   * Returns the computed style property of an element
   * Based on: http://www.quirksmode.org/dom/getstyles.html
   *
   * @param {Object} dom_node
   * @param {String} styleProp Using javascript style (zIndex) not css style (z-index)
   * @return {*|String}
   */
  get_style: function( dom_node, styleProp )
  {
    var y;

    if( dom_node.currentStyle )
    {
      y = dom_node.currentStyle[ styleProp ];
    }
    else if( window.getComputedStyle )
    {
      //y = document.defaultView.getComputedStyle( dom_node, null ).getPropertyValue( styleProp );
      y = document.defaultView.getComputedStyle( dom_node, null )[ styleProp ]; // Get from the array instead of "getPropertyValue" to use javascript style syntax
    }

    return y;
  }

});
