
/**
 * Manages loading layer
 *
 * Usage:
 *
 *     Common.ui.loading.LoadingLayer.show();
 *     Common.ui.loading.LoadingLayer.show( 'Custom text' );
 *     Common.ui.loading.LoadingLayer.hide();
 *
 */
CommonExt.define( 'Common.ui.loading.LoadingLayer',
{
  singleton: true,
  extend: 'CommonExt.util.Observable',


  /**
   * Loading layer instance
   *
   * @var {Ext.Container}
   * @private
   */
  _loading_layer: null,



  /**
   * Shows loading layer
   *
   * @param {String=} text
   */
  show: function( text )
  {
    // Check if the layer is created
    if( !this._loading_layer )
    {
      this._loading_layer = new Ext.Container(
      {
        cls: 'common-loadinglayer common-loadinglayer-left-bottom',
        renderTo: Ext.getBody()
      });
    }

    // Update the loading text
    this._loading_layer.el.update( text || Common.Langs.get( 'loading' ) );

    // Appear it
    this._loading_layer.el.fadeIn( { duration: .3 } );
  },



  /**
   * Hides the loading layer
   */
  hide: function()
  {
    // Verify if the loading layer exists
    if( !this._loading_layer )
    {
      return;
    }

    // Fade it
    this._loading_layer.el.fadeOut( { duration: .3 } );
  }

});
