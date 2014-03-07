
/**
 * Toggler Dispatcher plugin
 *
 * Only valid for ComboBox, Checkbox and Radio.
 *
 * Triggers an event to toggle components with Observer plugin.
 *
 * It internally uses "Common.ui.Toggler".
 *
 * Configure dispatcher on ComboBox:
 *     var combo_dispatcher = new Ext.form.ComboBox(
 *     {
 *       plugins: [ new Common.ui.plugins.toggler.Dispatcher() ]
 *     });
 *
 */
CommonExt.define( 'Common.ui.plugins.toggler.Dispatcher',
{

  config:
  {

    /**
     * Defines if must be triggered after field creation
     *
     * @property {Boolean}
     */
    start: false

  },



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
   * Init plugin
   *
   * @param {Ext.form.ComboBox|Ext.form.Checkbox|Ext.form.CheckboxGroup|Ext.form.Radio|Ext.form.RadioGroup} field
   */
  init: function( field )
  {
    Ext.override( field,
    {
      setValue: field.setValue.createSequence( this._onSetValue )
    });

    field.on( field.isXType( 'combo' ) ? 'select' : 'check', function( field )
    {
      Common.ui.Toggler.start( field.getId() );
    });

    if( this.config.start === true )
    {
      field.on( 'afterrender', function()
      {
        CommonExt.defer( Common.ui.Toggler.start, 1, this, [ this.getId() ] );
      });
    }
  },



  /**
   * Toggle should be started when setValue is called
   *
   * @private
   */
  _onSetValue: function()
  {
    CommonExt.defer( Common.ui.Toggler.start, 1, this, [ this.getId() ] );
  }

});
