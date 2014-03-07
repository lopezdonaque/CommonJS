
/**
 * Adds an event "domclick"
 *
 */
CommonExt.define( 'Common.ui.plugins.component.DomClick',
{

  /**
   * Component instance
   *
   * @property {Ext.Component}
   * @private
   */
  _cmp: null,



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
   * Initializes the plugin
   *
   * @param {Ext.Component} cmp
   * @private
   */
  init: function( cmp )
  {
    // Store component instance
    this._cmp = cmp;

    cmp.addEvents( 'domclick' );

    cmp.on( 'afterrender', function()
    {
      this.el.on( 'click', function(){ this.fireEvent( 'domclick', this ); }, this );
    });
  }

});
