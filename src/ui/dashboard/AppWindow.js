
Ext.ns( 'Common.ui.dashboard' );


/**
 * Base class to create application window
 *
 */
Common.ui.dashboard.AppWindow = Ext.extend( Ext.Window,
{
  modal: false,
  draggable: true,
  resizable: false,
  width: 500, //default width
  bodyStyle: 'background-color: white;',
  defaults:
  {
    style: 'padding: 5px;'
  },


  /**
   * Reference application component
   *
   * @property {Object}
   */
  ref_cmp: null,


  /**
   * Defines if a close button will be added to the first item of the window
   *
   * @property {Boolean}
   */
  add_close_button: true,


  /**
   * Modal used to block UI
   *
   * @property {String}
   */
  block_modal: 'app', //app, dashboard, none



  /**
   * Init component
   *
   */
  initComponent: function()
  {
    this._parent_app_tab = this.ref_cmp.el.up( '.app_tab' );

    this.renderTo = this._parent_app_tab;

    this.on( 'beforeshow', function()
    {
      if( this.block_modal == 'app' )
      {
        this._parent_app_tab.mask();
      }
      else if( this.block_modal == 'dashboard' )
      {
        Ext.getBody().mask();
      }

      this.dd.constrainTo( this._parent_app_tab ); // drag constraint
    }, this );


    this.on( this.closeAction || 'close', this._hide_modal, this );

    Common.ui.dashboard.AppWindow.superclass.initComponent.apply( this, arguments );


    /*// Move the form buttons to window buttons
    //TODO: faltaria saber como hacer el formBind y la layer de loading de toda la window cuando se hace submit
    CommonExt.Array.each( this.items.get( 0 ).buttons, function( item, index, allItems )
    {
      this.addButton( item );
      delete allItems[ index ];
    }, this );*/

    // Add close button
    if( this.add_close_button )
    {
      var close_button =
      {
        text: Common.Langs.get( 'close' ),
        scope: this,
        handler: function()
        {
          ( this.closeAction == 'hide' ) ? this.hide() : this.close();
        }
      };

      if( this.items.get( 0 ) )
      {
        this.items.get( 0 ).addButton( close_button );
      }
    }
  },



  /**
   * Hides modal layer
   *
   * @private
   */
  _hide_modal: function()
  {
    if( this.block_modal == 'app' )
    {
      Ext.get( this._parent_app_tab ).unmask();
    }
    else if( this.block_modal == 'dashboard' )
    {
      Ext.getBody().unmask();
    }
  }

});

Ext.reg( 'Common.ui.dashboard.AppWindow', Common.ui.dashboard.AppWindow );
