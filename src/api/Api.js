
/**
 * Api namespace
 *
 */
CommonExt.define( 'Common.api.Api',
{
  singleton: true,


  /**
   * Endpoint URL
   *
   * For example: http://webservices.domain.com/api/rest.php
   *
   * @property {String}
   */
  endpoint: null,


  /**
   * Authentication token
   *
   * @property {String}
   */
  token: null,


  /**
   * Authentication data
   *
   * TODO: In the future, this should be the authentication token
   *
   * @property {Object}
   */
  user_data: null

});
