
/**
 * Singleton class to listen Common Api Rpc events globally
 *
 * It could be used to display error notifications
 *
 * Examples:
 *
 *     Common.api.RpcEvents.on( Common.api.RpcEvents.ERROR, display_global_error_notification );
 *     Common.api.RpcEvents.on( Common.api.RpcEvents.SESSION_EXCEPTION, do_logout );
 *
 */
CommonExt.define( 'Common.api.RpcEvents',
{
  singleton: true,
  extend: 'CommonExt.util.Observable',


  /**
   * Error event constant
   * @property {String}
   *
   * @event error
   * Event fired on error request
   */
  ERROR: 'error',


  /**
   * Success event constant
   * @property {String}
   *
   * @event success
   * Event fired on success request
   */
  SUCCESS: 'success',


  /**
   * Session exception event constant
   * @property {String}
   *
   * @event session_exception
   * Event fired when api returns a session exception
   */
  SESSION_EXCEPTION: 'session_exception'

});
