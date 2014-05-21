
/**
 * Upload drop zone
 *
 */
Ext.define( 'Common.ui.upload.DropZone',
{
  extend: 'Ext.Container',
  hidden: true,


  /**
   * Uploader instance
   *
   * @property {Common.upload.Uploader}
   */
  uploader: null,


  /**
   * Target where the dropzone will be displayed.
   * If null, target will be the body.
   *
   * @property {Ext.Component}
   */
  target: null,



  /**
   * Init component
   *
   * @private
   */
  initComponent: function()
  {
    this.cls = 'common-upload-dropzone' + ( this.target ? ' common-upload-dropzone-target' : '' );
    this.html = '<span class="common-upload-dropzone-text">' + Common.Langs.get( 'drop_files_here' ) + '</span>';

    this.on( 'afterrender', this._prepare_component, this );
    this.on( 'hide', function(){ this._prepared = false; }, this );

    this.uploader._uploader.settings.drop_element = this.getId();

    this.uploader.on( 'error', this._on_error, this );
    this.uploader.on( 'init', this._on_init, this );

    this.callParent( arguments );
  },



  /**
   * Prepares drag-drop browser event handlers
   *
   * @private
   */
  _prepare_events: function()
  {
    this.mon( Ext.getBody(), 'dragover', this._body_dragdrop, this );
    this.mon( Ext.getBody(), 'dragleave', this._body_dragdrop, this );
    this.mon( Ext.getBody(), 'drop', this._body_dragdrop, this );


    this.on( 'dragover', function( ev )
    {
      if( !this.isVisible() )
      {
        // Check if the component should be prepared (the target size or position could has changes)
        if( this._prepared !== true )
        {
          this._prepare_component();
          this._prepared = true;
        }

        this.show();

        this.el.child( '.common-upload-dropzone-text' ).center( this.target ? this.el : null );

        if( ev.getTarget() != this.el.dom )
        {
          this._enable_over( false );
        }
        else
        {
          ev.browserEvent.dataTransfer.dropEffect = 'move';
          this._enable_over( true );
        }
      }
    }, this );

    this.on( 'dragleave', function()
    {
      this.hide();
    }, this );

    this.on( 'drop', function()
    {
      this.hide();
      this._enable_over( false );
    }, this );
  },



  /**
   * Prepares the component (size, position, z-index)
   *
   * @private
   */
  _prepare_component: function()
  {
    if( this.target )
    {
      if( !this.target.rendered )
      {
        CommonExt.defer( this._prepare_component, 50, this );
        return;
      }

      this.setSize( this.target.getSize() );
      this.setPosition( this.target.getPosition() );
      this.el.setStyle( 'zIndex', Common.utils.Html.get_max_zindex( this.target.getId() ) + 1 );
    }
    else
    {
      this.setSize( Ext.getBody().getWidth(), Ext.getBody().getHeight() );
      this.setPosition( 0, 0 );
      this.el.setStyle( 'zIndex', '999999' );
    }
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
      this.uploader.on( 'destroy', this.destroy, this );
      this._prepare_events();
    }
    else
    {
      this.destroy();
    }
  },



  /**
   * Error event handler
   *
   * @param {Object} error
   * @private
   */
  _on_error: function( error )
  {
    // If file property not exists, we asume it's an init error so dropzone must be destroyed
    if( !error.file )
    {
      this.destroy();
    }
  },



  /**
   * Body drag-drop events handler
   *
   * @param {Ext.EventObject} ev
   * @private
   */
  _body_dragdrop: function( ev )
  {
    ev.stopEvent();

    if( ev.browserEvent.type == 'dragover' )
    {
      if( this._timeout_id )
      {
        clearTimeout( this._timeout_id );
        this._timeout_id = null;
      }

      if( ev.getTarget() == this.el.dom || ev.within( this.el.dom ) )
      {
        ev.browserEvent.dataTransfer.dropEffect = 'move';
      }
      else
      {
        ev.browserEvent.dataTransfer.dropEffect = 'none';
      }

      this.fireEvent( 'dragover', ev );
    }
    else if( ev.browserEvent.type == 'dragleave' )
    {
      this._timeout_id = CommonExt.defer( function()
      {
        this._timeout_id = null;
        this.fireEvent( 'dragleave', ev );
      }, 50, this );
    }
    else if( ev.browserEvent.type == 'drop' )
    {
      this.fireEvent( 'drop', ev );
    }
  },



  /**
   * Enables or disables the over state
   *
   * @param {Boolean} enable
   * @private
   */
  _enable_over: function( enable )
  {
    // If the target is the body, over can not be applied
    if( !this.target )
    {
      return;
    }

    if( enable )
    {
      this.el.addClass( 'common-upload-dropzone-over' );
      this.el.child( '.common-upload-dropzone-text' ).update( Common.Langs.get( 'drop_file' ) );
    }
    else
    {
      this.el.removeClass( 'common-upload-dropzone-over' );
      this.el.child( '.common-upload-dropzone-text' ).update( Common.Langs.get( 'drop_files_here' ) );
    }
  }

});
