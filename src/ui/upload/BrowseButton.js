
/**
 * Browse button
 *
 */
Ext.define( 'Common.ui.upload.BrowseButton',
{
  extend: 'Ext.Button',
  disabled: true, // It will be enabled when uploader component is inited


  /**
   * Uploader instance
   *
   * @property {Common.upload.Uploader}
   */
  uploader: null,



  /**
   * Init component
   *
   * @private
   */
  initComponent: function()
  {
    this.uploader._uploader.settings.browse_button = this.getId();

    this.uploader.on( 'init', function()
    {
      this.enable();
      this._start_checker();

      // WORKAROUND: Set the z-index of the shim container
      if( this.uploader._uploader.runtime == 'flash' )
      {
        CommonExt.select( '.moxie-shim-flash' ).last().setStyle( 'zIndex', Common.utils.Html.get_max_zindex( this.getId() ) + 1 );
      }
    }, this );

    this.callParent( arguments );
  },



  /**
   * Sets an interval to check if the button changes its visibility or position and refresh the uploader button position
   *
   * @private
   */
  _start_checker: function()
  {
    var last_visibility = this.isVisible();
    var last_position = this.getPosition();

    var interval_id = setInterval( CommonExt.bind( function()
    {
      if( this.isVisible() != last_visibility || CommonExt.encode( last_position ) != CommonExt.encode( this.getPosition() ) )
      {
        last_visibility = this.isVisible();
        last_position = this.getPosition();
        this.uploader._uploader.refresh();
      }
    }, this ), 50 );

    this.on( 'beforedestroy', function(){ clearInterval( interval_id ); } );
  }

});
