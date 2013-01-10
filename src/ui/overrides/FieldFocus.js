
/**
 * Overrides to set the focus on field rendered
 *
 * Usage:
 *     Common.ui.overrides.FieldFocus.apply();
 *
 * Example:
 *     {
 *       fieldLabel: 'First Name',
 *       name: 'first',
 *       focusIn: true
 *     }
 *
 */
CommonExt.define( 'Common.ui.overrides.FieldFocus',
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
      Common.Log.warn( '[Common.ui.overrides.FieldFocus.apply] Already applied' );
      return;
    }

    this._is_applied = true;

    Ext.override( Ext.form.Field,
    {
      afterRender: Ext.form.Field.prototype.afterRender.createSequence( this._setFocus )
    });
  },



  /**
   * Sets focus on field
   *
   * @private
   */
  _setFocus: function()
  {
    if( this.focusIn === true )
    {
      this.focus( false, 500 );
    }
  }

});
