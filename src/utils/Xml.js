
/**
 * Manages XML
 *
 * Read documentation to navigate DOM nodes at:
 *
 * http://www.w3schools.com/dom/dom_node.asp
 *
 * http://www.w3schools.com/XPath/xpath_examples.asp
 *
 */
CommonExt.define( 'Common.utils.Xml',
{
  singleton: true,


  /**
   * Returns a XML Document
   *
   * @param {String} xml - Text as xml
   * @return object
   */
  get_xml_doc: function( xml )
  {
    var xmlDoc;

    if( window.DOMParser )
    {
      var parser = new DOMParser();
      xmlDoc = parser.parseFromString( xml, 'text/xml' );
    }
    else // Internet Explorer
    {
      xmlDoc = new ActiveXObject( 'Microsoft.XMLDOM' );
      xmlDoc.async = 'false';
      xmlDoc.loadXML( xml );
    }

    return xmlDoc;
  },



  /**
   * Returns node value
   *
   * @param {Object} xmlDoc
   * @param {String} xpath
   * @return {String}
   */
  get_node_value: function( xmlDoc, xpath )
  {
    try
    {
      return xmlDoc.selectNodes( xpath )[ 0 ].childNodes[ 0 ].nodeValue;
    }
    catch( e )
    {
      Common.Log.warn( '[Common.utils.Xml.get_node_value] Exception', e );
      return null;
    }
  }

});
