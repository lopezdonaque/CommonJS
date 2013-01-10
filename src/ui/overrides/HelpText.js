
/**
 * Overrides to adds a help text over or under the field
 *
 * Based on:
 * - <a href="http://www.sencha.com/forum/showthread.php?77984-Field-help-text-plugin" target="_blank">This post</a>
 *
 * Usage:
 *     Common.ui.overrides.HelpText.apply();
 *
 * Example:
 *     {
 *       fieldLabel: 'First Name',
 *       name: 'first',
 *       labelSeparator : '',
 *       width: 230,
 *       allowBlank: false,
 *       helpText: 'Some help text for this field',
 *       helpAlign: 'top'
 *     }
 *
 */
CommonExt.define( 'Common.ui.overrides.HelpText',
{
  singleton: true,


  /**
   * Defines if the overrides has been applied or not
   *
   * @private
   * @property {Boolean}
   */
  _is_applied: false,



  /**
   * Applies overrides on form fields
   *
   */
  apply: function()
  {
    if( this._is_applied )
    {
      Common.Log.warn( '[Common.ui.overrides.HelpText.apply] Already applied' );
      return;
    }

    this._is_applied = true;

    Ext.override( Ext.form.Field,
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
      },

      afterRender: Ext.form.Field.prototype.afterRender.createSequence( this._renderHelpText )
    });
  },



  /**
   * Renders help text
   *
   * @private
   */
  _renderHelpText: function()
  {
    if( !this.helpText )
    {
      return;
    }

    if( !this.wrap )
    {
      this.wrap = this.el.wrap( { cls: 'x-form-field-wrap' } );
      this.positionEl = this.resizeEl = this.wrap;
      this.actionMode = 'wrap';
      this.onResize = this.onResize.createSequence( this.syncInputSize );
    }

    this.wrap[ this.helpAlign == 'top' ? 'insertFirst' : 'createChild' ](
    {
      cls: 'common-helptext',
      html: this.helpText
    });
  }

});
