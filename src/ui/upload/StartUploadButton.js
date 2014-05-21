
/**
 * Start upload button
 *
 */
Ext.define( 'Common.ui.upload.StartUploadButton',
{
  extend: 'Ext.Button',
  disabled: true,


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
    this.on( 'click', function(){ this.uploader.start(); }, this );

    this.uploader.on( 'statechange', function()
    {
      var disabled = ( this.uploader._uploader.state == plupload.STARTED );
      this.setDisabled( disabled );
    }, this );

    this.callParent( arguments );
  }

});
