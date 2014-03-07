
/**
 * Panel to upload a queue of files
 *
 */
Ext.define( 'Common.ui.upload.PluploadPanel',
{
  extend: 'Ext.Panel',
  bodyCssClass: 'common-upload-uploadpanel-body',


  /**
   * CSS classes
   *
   * @var {Object}
   */
  css:
  {
    addButtonCls: 'common-upload-uploadpanel-button common-upload-uploadpanel-button-add',
    uploadButtonCls: 'common-upload-uploadpanel-button common-upload-uploadpanel-button-upload',
    cancelButtonCls: 'common-upload-uploadpanel-button common-upload-uploadpanel-button-cancel'
  },


  /**
   * Defines the dropzone target (element or body)
   *
   * @var {String}
   */
  dropzone_target: 'body',


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
    this.addClass( 'common-upload-uploadpanel-empty' );

    this._prepare_uploader();
    this._build_tbar();
//    this._build_bbar();
    this._build_items();
    this._build_dropzone();

    this.on( 'beforedestroy', this._destroy, this );
    this.on( 'afterrender', this._initialize_uploader, this, { delay: 500 } ); // Use delay to wait placeholder to be visible (afterrender can not be used because in a window it is fired before the placeholder it's visible)

    this.callParent( arguments );
  },



  /**
   * Prepares the uploader
   *
   * @private
   */
  _prepare_uploader: function()
  {
    this.uploader.on( 'statechange', this._state_change, this );
  },



  /**
   * Builds the top bar
   *
   * @private
   */
  _build_tbar: function()
  {
    this.tbar = new Ext.Toolbar(
    {
      enableOverflow: true,
      items:
      [
        new Common.ui.upload.BrowseButton(
        {
          uploader: this.uploader,
          text: Common.Langs.get( 'add_files' ),
          cls: this.css.addButtonCls
        }),
        new Common.ui.upload.StartUploadButton(
        {
          uploader: this.uploader,
          text: Common.Langs.get( 'upload' ),
          cls: this.css.uploadButtonCls,
          hidden: this.uploader.auto_start_upload
        }),
        new Common.ui.upload.StopUploadButton(
        {
          uploader: this.uploader,
          text: Common.Langs.get( 'cancel' ),
          cls: this.css.cancelButtonCls
        })
      ]
    });
  },



  /**
   * Builds the bottom bar
   *
   * @private
   */
  _build_bbar: function()
  {
    this.bbar = new Ext.Toolbar(
    {
      layout: 'hbox',
      style: { paddingLeft: '5px' },
      items: new Common.ui.upload.GlobalProgressBar(
      {
        uploader: this.uploader,
        progressText: '{2} of {1} uploaded ({5}/s)',
        flex: 1
      })
    });
  },



  /**
   * Builds the items
   *
   * @private
   */
  _build_items: function()
  {
    this.items = new Common.ui.upload.FilesQueuePanel(
    {
      uploader: this.uploader
    });
  },



  /**
   * Builds drop zone used for html5 runtime
   *
   * @private
   */
  _build_dropzone: function()
  {
    new Common.ui.upload.DropZone(
    {
      target: ( this.dropzone_target == 'element' ? this : null ),
      uploader: this.uploader
    }).render( Ext.getBody() );
  },



  /**
   * Initializes the uploader
   *
   * @private
   */
  _initialize_uploader: function()
  {
    this.uploader._uploader.init();
  },



  /**
   * Destroy actions
   *
   * @private
   */
  _destroy: function()
  {
    if( this.uploader )
    {
      this.uploader.destroy();
    }

    clearTimeout( this._timeout_id );
  },



  /**
   * State change
   *
   * @private
   */
  _state_change: function()
  {
    clearTimeout( this._timeout_id );

    this._timeout_id = CommonExt.defer( function()
    {
      if( this.uploader.is_uploading() && this.uploader._uploader.total.percent != 100 )
      {
        this.addClass( 'common-upload-uploadpanel-uploading' );
      }
      else
      {
        this.removeClass( 'common-upload-uploadpanel-uploading' );
      }

      if( this.uploader._uploader.files.length > 0 )
      {
        this.removeClass( 'common-upload-pluploadpanel-empty' );
      }
      else
      {
        this.addClass( 'common-upload-pluploadpanel-empty' );
      }
    }, 1, this );
  }

});
