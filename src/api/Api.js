
/**
 * Api namespace
 * You could configure global parameters to use in all the Rpc requests.
 *
 */
CommonExt.define( 'Common.api.Api',
{
  singleton: true,


  /**
   * Endpoint URL
   *
   * For example: http://webservices.domain.com/api/rpc.php
   *
   * @property {String}
   */
  endpoint: null,


  /**
   * Ajax Proxy URL
   * It must be configured to avoid XDomainRequest restrictions and bugs
   *
   * @property {String}
   */
  ajax_proxy: null,


  /**
   * Authentication token
   *
   * @property {String}
   */
  token: null

});
