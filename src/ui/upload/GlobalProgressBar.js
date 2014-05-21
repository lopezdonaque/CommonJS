
/**
 * Progressbar to show the global progress
 *
 */
Ext.define( 'Common.ui.upload.GlobalProgressBar',
{
  extend: 'Ext.ProgressBar',


  /**
   * Uploader instance
   *
   * @property {Common.upload.Uploader}
   */
  uploader: null,


  /**
   * Progress text
   *
   * @property {String}
   */
  progressText: '{2} of {1} uploaded ({5}/s)',



  /**
   * Init component
   *
   * @private
   */
  initComponent: function()
  {
    // WORKAROUND: Use delay to be sure that uploader info has been updated
    this.uploader.on( 'statechange', CommonExt.Function.createDelayed( this._update_progress_bar, 1, this ), this );

    this.callParent( arguments );
  },



  /**
   * Updates the progress bar
   *
   * @private
   */
  _update_progress_bar: function()
  {
    var queue_progress = this.uploader._uploader.total;
    var speed = CommonExt.util.Format.fileSize( queue_progress.bytesPerSec );
    var total = this.uploader._uploader.files.length;
    var queued = queue_progress.queued;
    var failed = queue_progress.failed;
    var success = queue_progress.uploaded;
    var sent = failed + success;

    if( total )
    {
      this.progress = '';
      var pbarText = CommonExt.util.Format.format( this.progressText, sent, total, success, failed, queued, speed );
      var percent = queue_progress.percent / 100;
      this.updateProgress( percent, pbarText, false );
    }
    else
    {
      this.updateProgress( 0, ' ', false );
    }
  }

});
