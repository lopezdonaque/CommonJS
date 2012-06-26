
/**
 * Overrides to adds a red asterisk next to the label on allowBlank=false fields
 *
 * Based on: <a href="http://www.sencha.com/forum/showthread.php?101774-How-to-mark-a-label-with-a-required-icon&p=477625&viewfull=1#post477625" target="_blank">See post</a>
 *
 * Usage:
 *     Common.ui.overrides.FormFieldRequired.apply();
 *
 */
CommonExt.define( 'Common.ui.overrides.FormFieldRequired',
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
      Common.Log.warning( '[Common.ui.overrides.FormFieldRequired.apply] Already applied' );
      return;
    }

    this._is_applied = true;

    Ext.override( Ext.form.Field,
    {
      afterRender: Ext.form.Field.prototype.afterRender.createSequence( this._renderAsterisk )
    });
  },



  /**
   * Renders red asteriks if required
   *
   * @private
   */
  _renderAsterisk: function()
  {
    // Check for allowBlank once the field is rendered
    if( this.allowBlank === false )
    {
      if( this.rendered )
      {
        if( !this.el || !this.el.dom )
        {
          return;
        }

        var labelSeparator = this.labelSeparator;

        if( typeof labelSeparator == 'undefined' )
        {
          if( this.ownerCt && this.ownerCt.layout && typeof this.ownerCt.layout.labelSeparator != 'undefined' )
          {
            labelSeparator = this.ownerCt.layout.labelSeparator;
          }
          else
          {
            labelSeparator = '';
          }
        }

        var formItem = this.el.up( '.x-form-item', 10 );
        if( formItem )
        {
          var label = formItem.child( '.x-form-item-label' );
          if( label && typeof this.fieldLabel !== 'undefined' )
          {
            label.update( this.fieldLabel + labelSeparator + '<span style=\"color: red; font-size: 135%; position: relative; top: 4px;\"> *</span>' );
          }
        }
      }
    }
  }

});
