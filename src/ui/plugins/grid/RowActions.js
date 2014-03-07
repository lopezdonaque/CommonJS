
/**
 * Adds some method to use row actions and buttons like: move up, move down, remove.
 *
 * TODO: It should be a mixin when ExtJS 4 is used.
 *
 */
CommonExt.define( 'Common.ui.plugins.grid.RowActions',
{

  /**
   * Field instance
   *
   * @property {Ext.grid.GridPanel}
   * @private
   */
  _field: null,



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
   * @param {Ext.form.Field} field
   * @private
   */
  init: function( field )
  {
    // Store field instance
    this._field = field;

    Ext.override( field,
    {
      get_moveup_row_button: this.get_moveup_row_button,
      get_movedown_row_button: this.get_movedown_row_button,
      get_remove_row_button: this.get_remove_row_button,
      _move_row: this._move_row,
      _remove_row: this._remove_row
    });
  },



  /**
   * Returns the move up row button
   *
   * @param {Object} options
   * @return {Ext.Button}
   */
  get_moveup_row_button: function( options )
  {
    return new Ext.Button( CommonExt.merge(
    {
      scope: this,
      handler: CommonExt.bind( this._move_row, this, [ 'up' ], 1 )
    }, options ));
  },



  /**
   * Returns the move down row button
   *
   * @param {Object} options
   * @return {Ext.Button}
   */
  get_movedown_row_button: function( options )
  {
    return new Ext.Button( CommonExt.merge(
    {
      scope: this,
      handler: CommonExt.bind( this._move_row, this, [ 'down' ], 1 )
    }, options ));
  },



  /**
   * Returns the remove row button
   *
   * @param {Object} options
   * @return {Ext.Button}
   */
  get_remove_row_button: function( options )
  {
    return new Ext.Button( CommonExt.merge(
    {
      scope: this,
      handler: this._remove_row
    }, options ));
  },



  /**
   * Moves a row up or down
   *
   * @param {Object} row_button
   * @param {String} direction (up or down)
   * @private
   */
  _move_row: function( row_button, direction )
  {
    var rowElement = row_button.el.up( '.x-grid3-row' );
    var rowIndex = 0;
    while( ( rowElement = rowElement.prev() ) != null )
    {
      rowIndex++;
    }

    // Check if it's the first row
    if( ( direction == 'up' && rowIndex == 0 ) || ( direction == 'down' && rowIndex == this.getStore().getCount() - 1 ) )
    {
      return;
    }

    var record = this.getStore().getAt( rowIndex );
    var position = ( direction == 'up' ) ? --rowIndex : ++rowIndex;

    this.getStore().remove( record );
    this.getStore().insert( position, record );
    this.getSelectionModel().selectRow( position, true );
  },



  /**
   * Removes a row
   *
   * @param {Object} row_button
   * @private
   */
  _remove_row: function( row_button )
  {
    var rowElement = row_button.el.up( '.x-grid3-row' );
    var rowIndex = 0;
    while( ( rowElement = rowElement.prev() ) != null )
    {
      rowIndex++;
    }

    this.getStore().removeAt( rowIndex );

    if( this.getStore().getCount() == 0 )
    {
      // Call to "removeAll" to display blank space or the configured emptyText
      this.getStore().removeAll();
    }
  }

});
