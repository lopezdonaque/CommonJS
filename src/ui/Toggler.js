
/**
 * Manages the toggle dependencies between components
 *
 */
CommonExt.define( 'Common.ui.Toggler',
{
  singleton: true,
  extend: 'CommonExt.util.Observable',


  /**
   * Toggle type constant to show component
   *
   * @property {String}
   */
  TYPE_SHOW: 'show',


  /**
   * Toggle type constant to hide component
   *
   * @property {String}
   */
  TYPE_HIDE: 'hide',


  /**
   * Toggle type constant to enable component
   *
   * @property {String}
   */
  TYPE_ENABLE: 'enable',


  /**
   * Toggle type constant to disable component
   *
   * @property {String}
   */
  TYPE_DISABLE: 'disable',



  /**
   * Starts the toggle
   *
   * @param {String} key
   */
  start: function( key )
  {
    //Common.Log.debug( '[Common.ui.Toggler.start] event:start_toggle FIRED: ', Ext.getCmp( key ).getId() );
    Ext.getCmp( key ).fireEvent( 'event:start_toggle' );
  },



  /**
   * Observes the dispatcher to do the toggle when fired
   *
   * @param {String} key_dispatcher
   * @param {String} key_object
   */
  observe: function( key_dispatcher, key_object )
  {
    //Common.Log.debug( '[Common.ui.Toggler.observe] ini OBSERVING: ' + key_dispatcher + ' ' + key_object );

    // Check if the dispatcher exists
    if( !Ext.getCmp( key_dispatcher ) )
    {
      Common.Log.warn( '[Common.ui.Toggler.observe] Dispatcher [' + key_dispatcher + '] not exists' );
      return;
    }

    Ext.getCmp( key_dispatcher ).on( 'event:start_toggle', CommonExt.bind( this._element_toggle, this, [ key_dispatcher, key_object ] ) );
  },



  /**
   * Toggles the element depends on the dispatcher value and the toggle type
   *
   * @param {String} key_dispatcher
   * @param {String} key_object
   * @private
   */
  _element_toggle: function( key_dispatcher, key_object )
  {
    //Common.Log.debug( '[Common.ui.Toggler._element_toggle] Ini element toggle: ' + key_dispatcher + ' ' + key_object );

    // Get the value of the dispatcher
    var dispatcher_value = this._get_dispatcher_value( key_dispatcher );
    //Common.Log.debug( '[Common.ui.Toggler._element_toggle] dispatcher_value: ' + dispatcher_value );


    // Get the toggler options for the dispatcher
    var options_position = CommonExt.Array.pluck( Ext.getCmp( key_object ).toggler_observers, 'key_dispatcher' ).indexOf( key_dispatcher );
    var toggle_options = Ext.getCmp( key_object ).toggler_observers[ options_position ];
    //Common.Log.debug( '[Common.ui.Toggler._element_toggle] toggle value to ' + toggle_options.type + ' it: ' + toggle_options.value );

    var value = '' + toggle_options.value;

    // Verify if the toggle values match with the dispatcher value AND match
    if( value.indexOf( dispatcher_value ) != -1 && toggle_options.not_match === false )
    {
      //Common.Log.debug( '[Common.ui.Toggler._element_toggle] toggle value match dispatcher value AND match' );
      this._do_toggle( key_object, toggle_options.type, false );
    }

    // Verify if the toggle values match with the dispatcher value AND not match
    else if( value.indexOf( dispatcher_value ) == -1 && toggle_options.not_match === true )
    {
      //Common.Log.debug( '[Common.ui.Toggler._element_toggle] toggle value match dispatcher value AND not match' );
      this._do_toggle( key_object, toggle_options.type, false );
    }

    // If do otherwise
    else if( toggle_options.do_otherwise === true )
    {
      //Common.Log.debug( '[Common.ui.Toggler._element_toggle] toggle value NOT match dispatcher value BUT do otherwise' );
      this._do_toggle( key_object, toggle_options.type, true );
    }

    // Fire event of the toggled element
    Ext.getCmp( key_object ).fireEvent( 'event:start_toggle' );
  },



  /**
   * Do toggle action
   *
   * @param {String} key_object
   * @param {String} type
   * @param {Boolean} do_otherwise
   * @private
   */
  _do_toggle: function( key_object, type, do_otherwise )
  {
    //Common.Log.debug( '[Common.ui.Toggler._do_toggle] do toggle', key_object, type, do_otherwise );

    switch( type )
    {
      case Common.ui.Toggler.TYPE_SHOW:
        //Common.Log.debug( '[Common.ui.Toggler._do_toggle] set visible', !do_otherwise );
        Ext.getCmp( key_object ).setVisible( !do_otherwise );
        break;

      case Common.ui.Toggler.TYPE_HIDE:
        //Common.Log.debug( '[Common.ui.Toggler._do_toggle] set visible', do_otherwise );
        Ext.getCmp( key_object ).setVisible( do_otherwise );
        break;

      case Common.ui.Toggler.TYPE_ENABLE:
        //Common.Log.debug( '[Common.ui.Toggler._do_toggle] set disabled', do_otherwise );
        Ext.getCmp( key_object ).setDisabled( do_otherwise );
        break;

      case Common.ui.Toggler.TYPE_DISABLE:
        //Common.Log.debug( '[Common.ui.Toggler._do_toggle] set disabled', !do_otherwise );
        Ext.getCmp( key_object ).setDisabled( !do_otherwise );
        break;
    }
  },



  /**
   * Returns the dispatcher object value depending on the dispatcher object type
   *
   * @param {String} key_dispatcher
   * @return {String}
   * @private
   */
  _get_dispatcher_value: function( key_dispatcher )
  {
    return Ext.getCmp( key_dispatcher ).getValue();
  }

});

