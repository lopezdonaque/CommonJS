
/**
 * Single upload field
 *
 */
Ext.define( 'Common.ui.upload.SingleUploadField',
{
  extend: 'Ext.Container',
  width: 400,


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
    this._build_items();
    this.on( 'beforedestroy', this._destroy, this );
    this.on( 'afterrender', this._initialize_uploader, this, { delay: 500 } ); // Use delay to wait placeholder to be visible (afterrender can not be used because in a window it is fired before the placeholder it's visible)
    this.callParent( arguments );
  },



  /**
   * Builds items
   *
   * @private
   */
  _build_items: function()
  {
    var drop_files_panel = new Ext.Container(
    {
      height: 50,
      style: 'border: 1px dashed #ccc; margin-bottom: 5px; line-height: 25px; width: 350px; padding: 10px; text-align: center; display: table-cell; vertical-align: middle;', // Used "table-cell" to vertically center text
      html: Common.Langs.get( 'drop_file_here' ),
      listeners:
      {
        scope: this,
        added: function( cmp )
        {
          new Common.ui.upload.DropZone(
          {
            target: cmp,
            uploader: this.uploader
          }).render( Ext.getBody() );

          this.uploader.on( 'init', function()
          {
            if( !this.uploader._uploader.features.dragdrop )
            {
              cmp.el.dom.innerHTML += '<br>(' + Common.Langs.get( 'not_supported' ) + ')';
              cmp.disable();
            }
          }, this );
        }
      }
    });

    var browse_button = new Common.ui.upload.BrowseButton(
    {
      text: Common.Langs.get( 'upload_file' ),
      uploader: this.uploader,
      listeners:
      {
        scope: this,
        added: function( cmp )
        {
          this.uploader.on( 'filesadded', cmp.hide, cmp );
          this.uploader.on( 'filesremoved', cmp.show, cmp );
          this.uploader.on( 'fileerror', cmp.show, cmp );
        }
      }
    });

    var textfield = new Ext.form.TextField(
    {
      readOnly: true,
      width: 250,
      allowBlank: this.allowBlank || false,
      fieldLabel: this.fieldLabel,
      plugins: [ new Common.ui.plugins.field.HelpText( { text: this.helpText } ) ],
      listeners:
      {
        scope: this,
        added: function( cmp )
        {
          this.uploader.on( 'filesremoved', function()
          {
            cmp.setValue( '' );
          }, this );

          this.uploader.on( 'filesadded', function( files )
          {
            cmp.setValue( CommonExt.util.Format.ellipsis( files[0].name, 30 ) + ' (' + CommonExt.util.Format.fileSize( files[0].size ) + ')' );
          }, this );

          this.uploader.on( 'fileerror', function( error )
          {
            cmp.setValue( '' );
            cmp.markInvalid( error );
          }, this );
        }
      }
    });

    var delete_btn = new Ext.Button(
    {
      hidden: true,
      text: Common.Langs.get( 'delete' ),
      scope: this,
      handler: function()
      {
        this.uploader.remove_all();
      },
      listeners:
      {
        scope: this,
        added: function( cmp )
        {
          this.uploader.on( 'filesremoved', cmp.hide, cmp );
          this.uploader.on( 'fileuploaded', function()
          {
            cmp.show();
            cmp.ownerCt.doLayout(); // Call to "ownerCt.doLayout()" because "delete_btn" is inside CompositeField and initially hidden
          }, this );
        }
      }
    });

    var progressbar = new Ext.ProgressBar(
    {
      width: 180,
      listeners:
      {
        scope: this,
        added: function( cmp )
        {
          this.uploader.on( 'uploadprogress', function( file )
          {
            cmp.updateProgress( file.percent / 100, file.percent + '%', true );
          }, this );

          this.uploader.on( 'filesremoved', function()
          {
            cmp.updateProgress( 0, '0%', false );
          }, this );
        }
      }
    });

    var cancel_button = new Ext.Button(
    {
      text: Common.Langs.get( 'cancel' ),
      scope: this,
      handler: function()
      {
        this.uploader.stop();
        this.uploader.remove_all();
      }
    });


    this.items =
    [
      drop_files_panel,

      // Upload info
      new Ext.form.CompositeField(
      {
        style: 'margin-top: 10px;',
        items:
        [
          textfield,
          browse_button,
          delete_btn
        ]
      }),

      new Ext.form.CompositeField(
      {
        hidden: true,
        items:
        [
          progressbar,
          cancel_button
        ],
        listeners:
        {
          scope: this,
          added: function( cmp )
          {
            this.uploader.on( 'filesadded', cmp.show, cmp );
            this.uploader.on( 'filesremoved', cmp.hide, cmp );
            this.uploader.on( 'fileerror', cmp.hide, cmp );
            this.uploader.on( 'fileuploaded', cmp.hide, cmp );
          }
        }
      })
    ];
  },



  /**
   * Initializes upload button
   *
   * @private
   */
  _initialize_uploader: function()
  {
    this.uploader._uploader.init();
  },



  /**
   * Destroys the uploader component
   *
   * @private
   */
  _destroy: function()
  {
    this.uploader.destroy();
  }

});
