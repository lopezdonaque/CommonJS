
/**
 * Object to take a screenshot of a window object
 *
 */
CommonExt.define( 'Common.utils.Screenshot',
{
  singleton: true,


  /**
   * Returns the all the html of a window to use as a screenshot
   *
   * @param {Object} oWindow
   */
  get: function( oWindow )
  {
    var body = oWindow.document.body.innerHTML;
    var head = oWindow.document.getElementsByTagName( 'head' )[ 0 ].innerHTML;
    var page = '<html><head>' + head + '</head><body>' + body + '</body></html>';
    page = this.screenshot_convert( page );
    return page;
  },



  /**
   * Modify html to be displayed from outside this portal
   *
   * @param {String} page
   */
  screenshot_convert: function( page )
  {
    var pos = this.get_path().lastIndexOf( '/' );
    var href = this.get_path();
    var host = this.get_path().substr( 0, pos );
    var portal = this.get_path().substr( pos + 1 );

    // Remove script tags
    page = page.replace( /<script.*?>[\s\S]*?<\/script>/g, '' );

    // Change paths
    page = page.replace( new RegExp( '/' + portal, 'g' ), ''  + href );
    page = page.replace( new RegExp( '"/images', 'g' ), '"' + href + '/images' );
    page = page.replace( new RegExp( '"[\.][\.]\/images', 'g' ), '"' + href + '/images' );
    page = page.replace( new RegExp( "[\.][\.]\/layouts", 'g' ), ' ' + href + '/layouts' );

    return page;
  },



  /**
   * Get path
   *
   * @return {String}
   */
  get_path: function()
  {
    var pieces = window.location.href.split( '/' );
    pieces.pop();
    return pieces.join( '/' );
  }

});
