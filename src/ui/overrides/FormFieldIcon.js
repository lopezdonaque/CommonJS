
/**
 * Overrides to adds an icon next to the field
 *
 * Based on:
 * - Error icon implementation
 * - <a href="http://www.sencha.com/forum/showthread.php?62771-Ext.form.Field-override-Adding-an-icon-to-a-form-field-of-any-type" target="_blank">This post</a>
 *
 * Usage:
 *     Common.ui.overrides.FormFieldIcon.apply();
 *
 * Example:
 *
 *     {
 *       fieldLabel: 'First Name',
 *       name: 'first',
 *       labelSeparator : '',
 *       width: 230,
 *       allowBlank: false,
 *       iconCfg:
 *       {
 *         cls: 'x-tool x-tool-help',
 *         clsOnOver: 'x-tool-help-over',
 *         tooltip: 'Tooltip text'
 *       },
 *       listeners:
 *       {
 *         onIcon: function( field )
 *         {
 *           alert( 'On icon click' );
 *         }
 *       }
 *
 */
CommonExt.define( 'Common.ui.overrides.FormFieldIcon',
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
      Common.Log.warn( '[Common.ui.overrides.FormFieldIcon.apply] Already applied' );
      return;
    }

    this._is_applied = true;

    Ext.override( Ext.form.TriggerField,
    {
      alignErrorIcon: function()
      {
        this.errorIcon.alignTo( this.wrap, 'tl-tr', [ 2 + this.dicon ? this.dicon.getWidth() + 4 : 0, 0 ] );
      }
    });

    Ext.override( Ext.form.Field,
    {
      // private
      onIcon: function( e, icon )
      {
        this.fireEvent( 'onIcon', this );
      },

      // private
      getIconCt: function( el )
      {
        return  el.findParent( '.x-form-element', 5, true ) || // use form element wrap if available
          el.findParent( '.x-form-field-wrap', 5, true );   // else direct field wrap
      },

      alignIcon: function()
      {
        if( this.isXType( 'combo' ) || this.isXType( 'datefield' ) )
        {
          this.dicon.alignTo( this.el, 'tl-tr', [ 17, 3 ] );
        }
        else
        {
          this.dicon.alignTo( this.el, 'tl-tr', [ 2, 3 ] );
        }
      },

      alignErrorIcon: function()
      {
        this.errorIcon.alignTo( this.el, 'tl-tr', [ 2 + this.dicon ? this.dicon.getWidth() + 4 : 0, 0 ] );
      },

      afterRender: Ext.form.Field.prototype.afterRender.createSequence( function(){ this.addIcon(); } ),

      addIcon: function()
      {
        if( !this.rendered || this.preventMark || Ext.isEmpty( this.iconCfg ) ) // not rendered
        {
          return;
        }

        if( !this.dicon )
        {
          var elp = this.getIconCt( this.el );
          if( !elp ) // field has no container el
          {
            return;
          }

          this.dicon = elp.createChild( { cls: this.iconCfg.cls } );

          if( this.ownerCt )
          {
            this.ownerCt.on( 'afterlayout', this.alignIcon, this );
            this.ownerCt.on( 'expand', this.alignIcon, this );
          }

          this.dicon.addClassOnOver( this.iconCfg.clsOnOver );
          this.dicon.addListener( 'click', this.onIcon, this );

          if( this.iconCfg.tooltip )
          {
            this.dicon.set( { 'ext:qtip': this.iconCfg.tooltip } );
          }

          this.alignIcon();
          this.on( 'resize', this.alignIcon, this );
        }
      }
    });
  }

});
