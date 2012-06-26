
/**
 * Overrides to add options to configure toggler
 *
 * Usage:
 *     Common.ui.overrides.Toggler.apply();
 *
 *
 * Configure dispatcher on combobox:
 *     var combo_dispatcher = new Ext.form.ComboBox(
 *     {
 *       toggler_dispatcher: true,
 *       toggler_start: true
 *     });
 *
 *
 * Configure observers on field over previously created "combo_dispatcher":
 *     new Ext.form.DateField(
 *     {
 *       fieldLabel: 'Date',
 *       width: 120,
 *       value: new Date(),
 *       toggler_observers:
 *       [
 *         {
 *           key_dispatcher: combo_dispatcher.getId(),
 *           value: 2
 *         }
 *       ]
 *     });
 *
 */
CommonExt.define( 'Common.ui.overrides.Toggler',
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
   * Applies overrides on required fields
   *
   */
  apply: function()
  {
    if( this._is_applied )
    {
      Common.Log.warning( '[Common.ui.overrides.Toggler.apply] Already applied' );
      return;
    }

    this._is_applied = true;

    // Prepare observer objects
    this._prepare_observers();

    // Prepare dispatcher objects (combo, checkbox, radio)
    this._prepare_dispatchers();
  },



  /**
   * Prepares the dispatcher object
   *
   * @private
   */
  _prepare_dispatchers: function()
  {
    Ext.override( Ext.form.ComboBox,
    {
      afterRender: Ext.form.ComboBox.prototype.afterRender.createSequence( this._prepare_dispatcher ),
      setValue: Ext.form.ComboBox.prototype.setValue.createSequence( this._on_set_value )
    });

    Ext.override( Ext.form.Checkbox,
    {
      afterRender: Ext.form.Checkbox.prototype.afterRender.createSequence( this._prepare_dispatcher ),
      setValue: Ext.form.Checkbox.prototype.setValue.createSequence( this._on_set_value )
    });
  },



  /**
   * Prepares observer objects
   *
   * @private
   */
  _prepare_observers: function()
  {
    Ext.override( Ext.Component,
    {
      afterRender: Ext.Component.prototype.afterRender.createSequence( this._prepare_observer )
    });
  },



  /**
   * Prepares the dispatcher
   *
   * @private
   */
  _prepare_dispatcher: function()
  {
    if( this.toggler_dispatcher !== true )
    {
      return;
    }

    var event = this.isXType( 'combo' ) ? 'select' : 'check';

    this.on( event, function( field )
    {
      Common.ui.Toggler.start( field.getId() );
    });

    if( this.toggler_start !== false )
    {
      CommonExt.defer( Common.ui.Toggler.start, 1, this, [ this.getId() ] );
    }
  },



  /**
   * Toggle should be started when setValue is called
   *
   * @private
   */
  _on_set_value: function()
  {
    if( this.toggler_dispatcher !== true )
    {
      return;
    }

    CommonExt.defer( Common.ui.Toggler.start, 1, this, [ this.getId() ] );
  },



  /**
   * Prepares observer
   *
   * @private
   */
  _prepare_observer: function()
  {
    if( !this.toggler_observers )
    {
      return;
    }

    CommonExt.Array.each( this.toggler_observers, function( item )
    {
      // Complete optional options
      item.type = item.type || Common.ui.Toggler.TYPE_SHOW;
      item.not_match = item.not_match || false;
      item.do_otherwise = item.do_otherwise || true;

      // Set observer
      Common.ui.Toggler.observe( item.key_dispatcher, this.getId() );
    }, this );
  }

});
