
/**
 * Manages loading layer
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
        cls: 'common-loadinglayer',
        renderTo: Ext.getBody()
      });
    }

    // Update the loading text
    this._loading_layer.el.update( '<img src="' + window.settings.workspace.theme_path + '/images/common/loading_standard.gif">&nbsp;' + ( text || Common.Langs.get( 'loading' ) ) );

    // Appear it
    this._loading_layer.el.fadeIn(
    {
      duration:.3
    });
  },



  /**
   * Hides the loading layer
   *
   */
  hide: function()
  {
    // Verify if the loading layer exists
    if( !this._loading_layer )
    {
      return false;
    }

    // Fade it
    this._loading_layer.el.fadeOut(
    {
      duration: .3
    });
  }

});
