
/**
 * Toggler Observer plugin
 *
 * Observes an event triggered by components with Dispatcher plugin.
 *
 * It internally uses "Common.ui.Toggler".
 *
 * Configure observers:
 *     var field = new Ext.form.DateField(
 *     {
 *       fieldLabel: 'Date',
 *       value: new Date(),
 *       plugins:
 *       [
 *         new Common.ui.plugins.toggler.Dispatcher(
 *         {
 *           observers:
 *           [
 *             {
 *               key_dispatcher: field_dispatcher.getId(),
 *               value: 2
 *             }
 *           ]
 *         })
 *       ]
 *     });
 *
 */
CommonExt.define( 'Common.ui.plugins.toggler.Observer',
{

  config:
  {

    /**
     * Array of objects with "key_dispatcher" and "value"
     *
     * @property {Object[]}
     */
    observers: []

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
   * @param {Ext.Component} cmp
   */
  init: function( cmp )
  {
    this._cmp = cmp;

    // Store the observers in cmp (Required by "Common.ui.Toggler")
    cmp.toggler_observers = this.config.observers;

    cmp.on( 'afterrender', this._prepareObserver, this );
  },



  /**
   * Prepares observer
   *
   * @private
   */
  _prepareObserver: function()
  {
    CommonExt.Array.each( this.config.observers, function( item )
    {
      // Complete optional options
      item.type = item.type || Common.ui.Toggler.TYPE_SHOW;
      item.not_match = item.not_match || false;
      item.do_otherwise = item.do_otherwise || true;

      // Set observer
      Common.ui.Toggler.observe( item.key_dispatcher, this._cmp.getId() );
    }, this );
  }

});
