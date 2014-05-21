
/**
 * Notifier
 *
 */
CommonExt.define( 'Common.notifier.Notifier',
{
  singleton: true,
  extend: 'CommonExt.util.Observable',



  /**
   * Launches a notification
   *
   * @param {Object} notification
   */
  notify: function( notification )
  {
    this.fireEvent( 'notify', notification );
  },



  /**
   * Success shortcut
   *
   * @param {String|Object} data
   */
  success: function( data )
  {
    data = ( CommonExt.isString( data ) ) ? { text: data } : data;
    CommonExt.applyIf( data, { level: 'success' } );
    this.notify( data );
  },



  /**
   * Warning shortcut
   *
   * @param {String|Object} data
   */
  warning: function( data )
  {
    data = ( CommonExt.isString( data ) ) ? { text: data } : data;
    CommonExt.applyIf( data, { level: 'warn' } );
    this.notify( data );
  },



  /**
   * Error shortcut
   *
   * @param {String|Object} data
   */
  error: function( data )
  {
    data = ( CommonExt.isString( data ) ) ? { text: data } : data;
    CommonExt.applyIf( data, { level: 'error' } );
    this.notify( data );
  },



  /**
   * Info shortcut
   *
   * @param {String|Object} data
   */
  info: function( data )
  {
    data = ( CommonExt.isString( data ) ) ? { text: data } : data;
    CommonExt.applyIf( data, { level: 'info' } );
    this.notify( data );
  }

});
