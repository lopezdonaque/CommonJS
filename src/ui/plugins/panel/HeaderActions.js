
/**
 * Adds actions to header panel
 *
 */
CommonExt.define( 'Common.ui.plugins.panel.HeaderActions',
{
  config:
  {

    /**
     * Items
     *
     * @property {Array|Ext.Component}
     */
    items: null
  },



  /**
   * Panel instance
   *
   * @property {Ext.Panel}
   * @private
   */
  _panel: null,



  /**
   * Constructor
   *
   * @param {Object} options
   */
  constructor: function( options )
  {
    this.initConfig( options );
  },



  /**
   * Initializes the plugin
   *
   * @param {Ext.Panel} panel
   * @private
   */
  init: function( panel )
  {
    // Store panel instance
    this._panel = panel;

    if( !CommonExt.isArray( this.items ) )
    {
      this.items = [ this.items ];
    }

    panel.on( 'afterrender', this._renderItems, this );
    panel.on( 'beforedestroy', this._destroy, this );
  },



  /**
   * Renders items
   *
   * @private
   */
  _renderItems: function()
  {
    CommonExt.Array.each( this.getItems(), function( item, index, allItems )
    {
      var action_id = Ext.id();
      this._panel.header.insertHtml( 'beforeEnd', '<div style="float: right;" id="' + action_id +'"></div>' );

      if( item == '-' )
      {
        item = allItems[ index ] = new Ext.Container( { html: '&nbsp;' } );
      }

      item.render( action_id );
    }, this );
  },



  /**
   * Destroys the plugin
   *
   * @private
   */
  _destroy: function()
  {
    CommonExt.Array.each( this.getItems(), function( item ){ item.destroy(); } );
  }

});
