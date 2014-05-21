
/**
 * Encapsulates "PlUpload 2" uploader component to use custom methods and events
 *
 * It allows to change the uploader component without change ui components.
 *
 */
CommonExt.define( 'Common.upload.Uploader',
{
  extend: 'CommonExt.util.Observable',

  config:
  {

    /**
     * Defines the upload starts automatically when a file is added
     *
     * @property {Boolean}
     */
    auto_start_upload: false,


    /**
     * Max files allowed to be added
     *
     * @property {Number}
     */
    max_files: null,


    /**
     * PlUpload settings
     *
     * @property {Object}
     */
    plupload_settings: {}
  },


  /**
   * PlUpload default settings
   *
   * Default settings to run component as expected. This settings should not be changed.
   *
   * @property {Object}
   * @private
   */
  _plupload_default_settings:
  {
    runtimes: 'html5,flash',

    // Use "body" as container to avoid hidden parent nodes (For example: On Flash runtime, the swf button can not be hidden or it stops the upload)
    container: null,

    // Defined on DropZone creation
    drop_element: null,

    // Button settings (defined on Button creation)
    browse_button: null,

    // Upload settings
    multi_selection: true,
    multipart: true,

    // Filter settings
    filters:
    {
      min_file_size: 1, // Bytes
      max_file_size: '10mb',
      mime_types:
      [
        { title: 'Allowed files', extensions: 'jpeg,jpg,gif,bmp,png,mpg,mpeg,avi,mov,doc,docx,xls,xlsx,pdf,zip,rar,ppt,pptx,txt' },
        { title: 'All files',  extensions: '*' } // This filter is required if you allows to upload files without extension
      ]
    }
  },


  /**
   * PlUpload instance
   *
   * @property {plupload.Uploader}
   */
  _uploader: null,



  /**
   * Constructor
   *
   * @param {Object} config
   */
  constructor: function( config )
  {
    this.initConfig( config );

    this.addEvents(

      /**
       * Init event
       *
       * @event init
       */
      'init',

      /**
       * State change event
       *
       * @event statechange
       */
      'statechange',

      /**
       * Error event
       *
       * @event error
       */
      'error',

      /**
       * Destroy event
       *
       * @event destroy
       */
      'destroy',

      /**
       * Files added event
       *
       * @event filesadded
       */
      'filesadded',

      /**
       * Files remove event
       *
       * @event filesremoved
       */
      'filesremoved',

      /**
       * File changed event
       *
       * @event filechanged
       */
      'filechanged',

      /**
       * File error event
       *
       * @event fileerror
       */
      'fileerror',

      /**
       * File uploaded event
       *
       * @event fileuploaded
       */
      'fileuploaded',

      /**
       * Upload progress
       *
       * @event uploadprogress
       */
      'uploadprogress'
    );

    this.callParent( arguments );
    this._create_plupload_instance();
    return this;
  },



  /**
   * Creates the PlUpload instance
   *
   * @private
   */
  _create_plupload_instance: function()
  {
    // Add custom file filter
    plupload.addFileFilter( 'min_file_size', function( minSize, file, cb )
    {
      var is_folder = ( !file.type && file.size % 4096 == 0 && file.name.indexOf( '.' ) === false );
      minSize = plupload.parseSize( minSize ) || 0;

      // Invalid file size
      if( !CommonExt.isDefined( file.size ) || file.size < minSize || is_folder )
      {
        this.trigger( 'Error',
        {
          code: plupload.FILE_SIZE_ERROR,
          message: plupload.translate( 'File size error.' ),
          file: file
        });

        cb( false );
      }
      else
      {
        cb( true );
      }
    });

    // Use "body" as container to avoid hidden parent nodes (For example: On Flash runtime, the swf button can not be hidden or it stops the upload)
    this._plupload_default_settings.container = Ext.getBody().dom; //.createChild().id;

    // Enable multi_selection only if multiple files could be uploaded
    this._plupload_default_settings.multi_selection = !( CommonExt.isNumber( this.config.max_files ) && this.config.max_files == 1 );

    this._uploader = new plupload.Uploader( CommonExt.merge( this._plupload_default_settings, this.config.plupload_settings ) );

    var plupload_events = [ 'PostInit', 'FilesAdded', 'FilesRemoved', 'FileUploaded', 'StateChanged', 'UploadProgress', 'Error' ];
    CommonExt.Array.each( plupload_events, function( ev )
    {
      var method = '_' + ev;

      if( this[ method ] )
      {
        this._uploader.bind( ev, this[ method ], this );
      }
    }, this );

    this.on( 'destroy', function()
    {
      this._uploader.destroy();
    } , this );
  },




  // region PlUpload mapped events

  /**
   * Post init event handler (Used PostInit instead of Init to be sure features property are initialized)
   *
   * @private
   */
  _PostInit: function()
  {
    this.fireEvent( 'init', this );
    this.fireEvent( 'statechange', this );
  },



  /**
   * Files added event handler
   *
   * @param {plupload.Uploader} uploader
   * @param {Array} files
   * @private
   */
  _FilesAdded: function( uploader, files )
  {
    if( CommonExt.isNumber( this.config.max_files ) )
    {
      // Limit files to be added (dropped files can not be limited)
      if( uploader.files.length > this.config.max_files )
      {
        uploader.splice( 1, uploader.files.length - 1 );
      }
    }

    if( this.config.auto_start_upload )
    {
      // Defer to execute after QueueChanged event has been triggered
      CommonExt.defer( this._uploader.start, 1, this._uploader );
    }

    this.fireEvent( 'filesadded', files, this );
    this.fireEvent( 'statechange', this );
  },



  /**
   * Files removed event handler
   *
   * @param {plupload.Uploader} uploader
   * @param {Array} files
   * @private
   */
  _FilesRemoved: function( uploader, files )
  {
    this.fireEvent( 'filesremoved', files, this );
    this.fireEvent( 'statechange', this );
  },



  /**
   * File uploaded event handler
   *
   * @param {plupload.Uploader} uploader
   * @param {Object} file
   * @param {Object} resp
   * @private
   */
  _FileUploaded: function( uploader, file, resp )
  {
    var response = CommonExt.decode( resp.response, true ) || {};
    file.server_response = response;
    var is_success = CommonExt.isDefined( response.success ) ? response.success : !response.error;
    file.server_error = is_success ? 0 : 1;

    this.fireEvent( 'statechange', this );

    if( is_success )
    {
      this.fireEvent( 'fileuploaded', file, this );
    }
    else
    {
      this.fireEvent( 'fileerror', { file: file }, this );
    }

    // Check if the upload is complete
    if( !this.is_uploading() && this._uploader.total.uploaded > 0 && this._uploader.files.length == ( this._uploader.total.failed.length + this._uploader.total.uploaded.length ) )
    {
      this.fireEvent( 'uploadcomplete', this );
    }
  },



  /**
   * State changed event handler
   *
   * @param {plupload.Uploader} uploader
   * @private
   */
  _StateChanged: function( uploader )
  {
    this.fireEvent( uploader.state == plupload.STARTED ? 'uploadstarted' : 'uploadcomplete', this );
    this.fireEvent( 'statechange', this );
  },



  /**
   * Upload progress event handler
   *
   * @param {plupload.Uploader} uploader
   * @param {Object} file
   * @private
   */
  _UploadProgress: function( uploader, file )
  {
    if( file.server_error )
    {
      file.status = plupload.FAILED;
    }

    this.fireEvent( 'uploadprogress', file, this );
    this.fireEvent( 'statechange', this );
  },



  /**
   * Error event handler
   *
   * @param {plupload.Uploader} uploader
   * @param {Object} error
   * @private
   */
  _Error: function( uploader, error )
  {
    if( error.file )
    {
      error.file.status = plupload.FAILED;

      // plupload does not stores the files with client side controlled errors (max file size, mime type, etc.)
      // so we force to store it to fire remove events
      this._uploader.files.push( error.file );

      this.fireEvent( 'fileerror', error, this );
    }

    this.fireEvent( 'error', error, this );
    this.fireEvent( 'statechange', this );
  },

  // endregion



  /**
   * Returns if it's uploading a file
   *
   * @return {Boolean}
   */
  is_uploading: function()
  {
    return ( this._uploader && this._uploader.state == plupload.STARTED );
  },



  /**
   * Returns the uploaded files
   *
   * @return {Array}
   */
  get_uploaded_files: function()
  {
    return CommonExt.Array.filter( this._uploader.files, function( file )
    {
      return file.status == plupload.DONE;
    }, this );
  },



  /**
   * Starts the uploader
   */
  start: function()
  {
    this._uploader.start();
    this.fireEvent( 'statechange', this );
  },



  /**
   * Stops the uploader
   */
  stop: function()
  {
    this._uploader.stop();
    this.fireEvent( 'statechange', this );
  },



  /**
   * Removes a file
   *
   * @param {String} id
   * @private
   */
  remove_file: function( id )
  {
    var file = this._uploader.getFile( id );

    if( file )
    {
      // If we remove an uploading file, it means that we are cancelling and we must restart the upload if it was previously uploading
      var status_before = file.status;

      this._uploader.removeFile( file );

      if( this._uploader.state == plupload.STARTED && status_before == plupload.UPLOADING )
      {
        this._uploader.stop();
        this._uploader.start();
      }
    }
  },



  /**
   * Removes all files
   */
  remove_all: function()
  {
    if( this._uploader.files.length > 0 )
    {
      this._uploader.splice( 0, this._uploader.files.length );
    }
  },



  /**
   * Destroy
   */
  destroy: function()
  {
    this.callParent( arguments );
    this.fireEvent( 'destroy' );
  }

});
