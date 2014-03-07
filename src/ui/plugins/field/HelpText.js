
/**
 * Adds a help text over or under the field
 *
 * Based on:
 * - [This post](http://www.sencha.com/forum/showthread.php?77984-Field-help-text-plugin)
 *
 * Usage:
 *
 * Example:
 *
 *     var textfield = new Ext.form.TextField(
 *     {
 *       fieldLabel: 'First Name',
 *       allowBlank: false,
 *       plugins:
 *       [
 *         new Common.ui.plugins.field.HelpText(
 *         {
 *           text: 'Some help text for this field',
 *           align: 'top'
 *         })
 *       ]
 *     });
 *
 */
CommonExt.define( 'Common.ui.plugins.field.HelpText',
{

  config:
  {

    /**
     * Help text
     *
     * @property {String}
     */
    text: null,


    /**
     * Alignment
     *
     * @property {String}
     */
    align: 'bottom'
  },



  /**
   * Field instance
   *
   * @property {Ext.form.Field}
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
    if( !this.getText() )
    {
      return;
    }

    // Store field instance
    this._field = field;

    Ext.override( field,
    {
      // private
      syncInputSize: function( w, h )
      {
        //this.el.setSize( w, h );

        if( CommonExt.isDefined( w ) )
        {
          this.el.setWidth( w );
        }

        if( CommonExt.isDefined( h ) )
        {
          this.el.setHeight( h );
        }
      }
    });

    field.on( 'afterrender', this._renderHelpText, this );
    field.on( 'beforedestroy', this._destroy, this );
  },



  /**
   * Renders help text
   *
   * @private
   */
  _renderHelpText: function()
  {
    var f = this._field;

    if( !f.wrap )
    {
      f.wrap = f.el.wrap( { cls: 'x-form-field-wrap' } );
      f.positionEl = f.resizeEl = f.wrap;
      f.actionMode = 'wrap';
      f.onResize = f.onResize.createSequence( f.syncInputSize );
    }

    f.wrap[ this.getAlign() == 'top' ? 'insertFirst' : 'createChild' ](
    {
      cls: 'common-helptext',
      html: this.getText()
    });
  },



  /**
   * Destroys the plugin
   *
   * @private
   */
  _destroy: function()
  {
    if( this._field.wrap )
    {
      this._field.wrap.remove();
    }
  }

});
