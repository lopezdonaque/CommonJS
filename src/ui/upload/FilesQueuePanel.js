
/**
 * Panel to display files info (queue, progress, failed, etc.)
 *
 */
Ext.define( 'Common.ui.upload.FilesQueuePanel',
{
  extend: 'Ext.DataView',
  multiSelect: true,
  overClass: 'common-upload-uploadpanel-row-over',
  selectedClass: 'common-upload-uploadpanel-row-selected',
  itemSelector: 'dl',
  deferEmptyText: false,
  emptyText: '', // Set "emptyText" empty to wait "init" event which sets and centers it


  /**
   * Uploader instance
   *
   * @property {Common.upload.Uploader}
   */
  uploader: null,


  /**
   * Empty text template
   *
   * @property {String}
   * @private
   */
  _emptyTextTpl: '<span class="common-upload-uploadpanel-emptytext">{0}</span>',


  /**
   * Refresh speed (miliseconds)
   *
   * Used because we need to call "_update_store" slowly because it refreshes the ui and the row can not be selected or the remove button can not be clicked.
   * If the file rows are not selectable, you can use a lower value.
   *
   * @property {Number}
   */
  refresh_speed: 500,



  /**
   * Init component
   *
   * @private
   */
  initComponent: function()
  {
    this.store = new Ext.data.JsonStore(
    {
      fields: [ 'id', 'loaded', 'name', 'size', 'percent', 'status', 'msg', 'extra_data', 'file' ]
    });

    this.tpl = new Ext.XTemplate(
      '<tpl for=".">',
        '<dl id="{id}" class="{itemClass}">',
          '<dt class="common-upload-uploadpanel-item-name">{name}</dt>',
          '<dt class="common-upload-uploadpanel-item-filesize">{size:fileSize}</dt>',
          '<dt class="common-upload-uploadpanel-item-status" style="{statusTextStyle}">{statusText}</dt>',
          '<dt class="common-upload-uploadpanel-item-progressbar" style="{progressbarStyle}">',
            '<div class="common-upload-uploadpanel-item-progress"><div class="common-upload-uploadpanel-item-bar" style="width: {percent}%;"></div></div>',
          '</dt>',
          '<dt class="common-upload-uploadpanel-item-remove"><div><span>{removeText}</span></div></dt>',
          '<div class="x-clear"></div>',
        '</dl>',
      '</tpl>'
    );

    this.on( 'afterrender', this._prepare_single_remove, this );

    this.uploader.on( 'init', this._on_init, this );
    this.uploader.on( 'filesadded', this._on_files_added, this );
    this.uploader.on( 'uploadprogress', this._on_upload_progress, this );
    this.uploader.on( 'fileuploaded', this._on_file_uploaded, this );
    this.uploader.on( 'filechanged', this._on_file_changed, this );
    this.uploader.on( 'filesremoved', this._on_files_removed, this );
    this.uploader.on( 'fileerror', this._on_file_error, this );

    this.callParent( arguments );
  },



  /**
   * Prepares event to click on single remove buttons
   *
   * @private
   */
  _prepare_single_remove: function()
  {
    this.getEl().on( 'click', function( e, t )
    {
      e.stopEvent();
      this._remove_file( Ext.get( t ).parent().dom.id );
    }, this, { delegate: '.common-upload-uploadpanel-item-remove' } );
  },



  /**
   * Init event handler
   *
   * @private
   */
  _on_init: function()
  {
    if( this.uploader._uploader.features.dragdrop )
    {
      this.emptyText = CommonExt.util.Format.format( this._emptyTextTpl, Common.Langs.get( 'drop_files_here' ) );
    }
    else
    {
      this.emptyText = CommonExt.util.Format.format( this._emptyTextTpl, Common.Langs.get( 'empty_queue' ) );
    }

    this.refresh(); // Call to refresh to apply the emptyText
    this._center_empty_text();
  },



  /**
   * Files added event handler
   *
   * @param {Array} files
   * @private
   */
  _on_files_added: function( files )
  {
    CommonExt.Array.each( files, function( file )
    {
      this._update_store( file );
    }, this );
  },



  /**
   * Upload progress event handler
   *
   * @param {Object} file
   * @private
   */
  _on_upload_progress: function( file )
  {
    var now = (new Date()).getTime();
    this._last_time_call = this._last_time_call || now;

    if( this._last_time_call + this.refresh_speed < now )
    {
      this._update_store( file );
      this._last_time_call = now;
    }
  },



  /**
   * File uploaded event handler
   *
   * @param {Object} file
   * @private
   */
  _on_file_uploaded: function( file )
  {
    if( file.server_error && file.server_response.message )
    {
      file.msg = '<span style="color: red">' + file.server_response.message + '</span>';
    }

    this._update_store( file );
  },




  /**
   * File changed event handler
   *
   * @param {Object} file
   * @private
   */
  _on_file_changed: function( file )
  {
    this._update_store( file );
  },



  /**
   * Files removed event handler
   *
   * @param {Array} files
   * @private
   */
  _on_files_removed: function( files )
  {
    CommonExt.Array.each( files, function( file )
    {
      this.store.remove( this.store.getById( file.id ) );
    }, this );

    if( !this.store.data.length )
    {
      this._center_empty_text();
    }
  },



  /**
   * Error event handler
   *
   * @param {Object} error
   * @private
   */
  _on_file_error: function( error )
  {
    switch( error.code )
    {
      case -600:
        error.file.msg = CommonExt.util.Format.format( '<span style="color: red">{0}</span>', Common.Langs.get( 'invalid_size' ) );
        break;

      case -700:
        error.file.msg = CommonExt.util.Format.format( '<span style="color: red">{0}</span>', Common.Langs.get( 'invalid_extension' ) );
        break;

      default:
        error.file.msg = CommonExt.util.Format.format( '<span style="color: red">{2} ({0}: {1})</span>', error.code, error.details, error.message );
        break;
    }

    this._update_store( error.file );
  },



  /**
   * Prepares data
   *
   * @param {Object} data
   * @return {Object}
   */
  prepareData: function( data )
  {
    data.statusText = '-';
    data.itemClass = '';
    data.removeText = Common.Langs.get( 'remove' );
    data.statusTextStyle = '';
    data.progressbarStyle = 'display: none;';
    data.size = data.size || 0;

    switch( data.status )
    {
      case 1:
        data.statusText = Common.Langs.get( 'queued' );
        data.itemClass = 'common-upload-uploadpanel-item-status-queued';
        break;

      case 2:
        if( data.percent >= 95 )
        {
          data.statusTextStyle = '';
          data.progressbarStyle = 'display: none;';
          data.statusText = Common.Langs.get( 'finishing' );
        }
        else
        {
          data.statusTextStyle = 'display: none;';
          data.progressbarStyle = '';
          data.statusText = CommonExt.util.Format.format( Common.Langs.get( 'uploading' ), data.percent );
        }

        data.itemClass = 'common-upload-uploadpanel-item-status-uploading';
        break;

      case 4:
        data.statusText = data.msg || Common.Langs.get( 'failed' );
        data.itemClass = 'common-upload-uploadpanel-item-status-failed';
        break;

      case 5:
        data.statusText = Common.Langs.get( 'uploaded' );
        data.itemClass = 'common-upload-uploadpanel-item-status-uploaded';
        break;
    }

    return data;
  },



  /**
   * Removes a file
   *
   * WORKAROUND: We must to remove from from uploader and store becaouse invalid files (size, extension, etc.) are not stored into uploader.
   *
   * @param {String} file_id
   * @private
   */
  _remove_file: function( file_id )
  {
    this.uploader.remove_file( file_id );
    this._on_files_removed( [ { id: file_id } ] );
  },



  /**
   * Centers the dataview empty text
   *
   * @private
   */
  _center_empty_text: function()
  {
    var el = this.el.child( '.common-upload-uploadpanel-emptytext' );

    if( el && this.isVisible() )
    {
      el.center( this.container.id );
    }
    else
    {
      var timeout_id = CommonExt.defer( this._center_empty_text, 1, this );
      this.on( 'beforedestroy', function(){ clearTimeout( timeout_id ) } );
    }
  },



  /**
   * Updates the store
   *
   * @param {Object} f
   * @private
   */
  _update_store: function( f )
  {
    if( !f.msg )
    {
      f.msg = '';
    }

    var data = this.store.getById( f.id );

    if( data )
    {
      data.data = f;
      data.commit();
    }
    else
    {
      this.store.loadData( f, true );
    }
  }

});
