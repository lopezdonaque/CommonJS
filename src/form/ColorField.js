
/**
 * Color field
 *
 */
Ext.define( 'Common.form.ColorField',
{
  extend: 'Ext.form.TriggerField',
  triggerClass: 'common-form-color-trigger',
  regex: /^#[0-9A-F]{6}$/i,
  invalidText: 'Colors must be in a the hex format #ABCDEF.',
  blankText: 'Must have a hexadecimal value in the format #ABCDEF.',



  /**
   * Init component
   *
   * @private
   */
  initComponent: function()
  {
    this.callParent( arguments );
    this.on( 'beforedestroy', this._beforeDestroy, this );
    this.addEvents( 'select' );
  },



  /**
   * Trigger click handler
   *
   * @private
   */
  onTriggerClick: function()
  {
    if( this.disabled )
    {
      return;
    }

    if( !this.menu )
    {
      this.menu = new Ext.menu.ColorMenu(
      {
        colors: this.colors || Ext.ColorPalette.prototype.colors,
        listeners:
        {
          scope: this,
          select: function( cmp, color )
          {
            this.setValue( '#' + color );
          },
          hide: function()
          {
            this.focus();
          }
        }
      });
    }

    this.menu.show( this.el, 'tl-bl?' );
  },



  /**
   * Sets the value of the color field.
   *
   * @param {String} hex The color value
   */
  setValue: function( hex )
  {
    this.callParent( arguments );
    this.setColor( hex );
  },



  /**
   * Valdiates blur
   *
   * @return {boolean}
   * @private
   */
  validateBlur: function()
  {
    return !this.menu || !this.menu.isVisible();
  },



  /**
   * Checks value on before blur
   *
   * @private
   */
  beforeBlur: function()
  {
    if( !this.getRawValue() )
    {
      this.setValue( '' );
    }
    else if( !this.getRawValue().match( this.regex ) )
    {
      this.setValue( this.value );
    }
    else
    {
      this.setValue( this.getRawValue() );
    }
  },



  /**
   * Sets the current color and changes the background.
   * Does not change the value of the field.
   *
   * @param {String} hex The color value
   */
  setColor: function( hex )
  {
    this.el.setStyle(
    {
      color: this._getFontColor( hex ),
      'background-color': hex,
      'background-image': 'none'
    });
  },



  /**
   * Returns the font color, according to the current color of the background
   *
   * @param {String} value
   * @private
   */
  _getFontColor: function( value )
  {
    var h2d = function( d ){ return parseInt( d, 16 ); };

    var val =
    [
      h2d( value.slice( 1, 3 ) ),
      h2d( value.slice( 3, 5 ) ),
      h2d( value.slice( 5 ) )
    ];

    var avg = ( val[0] + val[1] + val[2] ) / 3;
    return ( avg > 128 ) ? '#000' : '#FFF';
  },



  /**
   * Before destroy handler
   *
   * @private
   */
  _beforeDestroy: function()
  {
    if( this.menu )
    {
      this.menu.destroy();
    }
  }

});
