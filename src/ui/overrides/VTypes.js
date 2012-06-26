
/**
 * Overrides to add custom vtypes
 *
 * Apply to custom vtypes:
 *     Common.ui.overrides.VTypes.apply();
 *
 * Apply some custom vtypes:
 *     Common.ui.overrides.VTypes.applyEqualTo();
 *     Common.ui.overrides.VTypes.applyHttpUrl();
 *
 * See each method for specific documentation
 *
 */
CommonExt.define( 'Common.ui.overrides.VTypes',
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
      Common.Log.warning( '[Common.ui.overrides.VTypes.apply] Already applied' );
      return;
    }

    this._is_applied = true;

    this.applyEqualTo();
    this.applyHttpUrl();
  },



  /**
   * Applies "equal to" validation
   *
   * Usage:
   *     new Ext.form.TextField(
   *     {
   *       id: 'password_confirm',
   *       fieldLabel: Common.Langs.get( 'password_confirm' ),
   *       inputType: 'password',
   *       allowBlank: false,
   *       vtype: 'equalTo',
   *       initialField: 'new_pwd',
   *       equalToText: Common.Langs.get( 'preferences', 'no_match_password' )
   *     })
   *
   */
  applyEqualTo: function()
  {
    Ext.apply( Ext.form.VTypes,
    {
      equalTo: function( val, field )
      {
        if( field.initialField )
        {
          var value = Ext.getCmp( field.initialField ).getValue();
          return ( val == value );
        }
        return true;
       },
       equalToText: Common.Langs.get( 'no_match' )
    });
  },



  /**
   * Applies "http url" validation
   *
   * Usage:
   *     new Ext.form.TextField(
   *     {
   *       fieldLabel: Common.Langs.get( 'url' ),
   *       allowBlank: false,
   *       vtype: 'httpUrl',
   *       defaultSecure: false,
   *     });
   */
  applyHttpUrl: function()
  {
    Ext.apply(Ext.form.VTypes,
    {
      httpUrl: function( val, field )
      {
        var http_pre = /(^https?:\/\/)/;
        var http_url = /((^https?):\/\/([\-\w]+\.)+\w{2,3}(\/[%\-\w]+(\.\w{2,})?)*(([\w\-\.\?\\\/+@&#;`~=%!]*)(\.\w{2,})?)*\/?)/i;

        if( !http_pre.test( val ) )
        {
          val = field.defaultSecure ? 'https://' : 'http://';
          field.setValue( val );
        }
        return http_url.test( val );
      },
      httpUrlText: Common.Langs.get( "http_url_error" )
    });
  }

});
