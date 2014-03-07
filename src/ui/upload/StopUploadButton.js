
/**
 * Stop upload button
 *
 */
Ext.define( 'Common.ui.upload.StopUploadButton',
{
  extend: 'Ext.Button',
  disabled: true,


  /**
   * Uploader instance
   *
   * @var {Common.upload.Uploader}
   */
  uploader: null,



  /**
   * Init component
   *
   * @private
   */
  initComponent: function()
  {
    this.on( 'click', function(){ this.uploader.stop(); }, this );

    this.uploader.on( 'statechange', function()
    {
      var disabled = !( this.uploader._uploader.state == plupload.STARTED );
      this.setDisabled( disabled );
    }, this );

    this.callParent( arguments );
  }

});
