
/**
 * Gravatar utility methods
 *
 * Usage:
 *
 *     var url = Common.utils.Gravatar.get_url( 'foo@domain.com' );
 *
 * Example with options:
 *
 *     var url = Common.utils.Gravatar.get_url( 'foo@domain.com',
 *     {
 *       size: 512,
 *       default_image: 'http://www.domain.com/foo.png'
 *     });
 *
 */
CommonExt.define( 'Common.utils.Gravatar',
{
  singleton: true,


  /**
   * Gravatar URL
   *
   * @property {String}
   */
  GRAVATAR_URL: 'http://www.gravatar.com/avatar/',


  /**
   * Gravatar secure URL
   *
   * @property {String}
   */
  GRAVATAR_SECURE_URL: 'https://secure.gravatar.com/avatar/',



  /**
   * Returns the Gravatar URL  for the given e-mail
   *
   * @param {String} email
   * @param {Object=} options
   * @param {Number=} options.size The preferred size (80,120 up to 512), default 120
   * @param {String=} options.default_image The default image. In case there is none, "retro" by default. Use "404" if you don't need a default image.
   * @param {Boolean=} options.secure Defines if return secure URL or not
   * @param {String=} options.rating The accepted rating of the icon (G,PG,R...). G by default.
   * @return {String}
   */
  get_url: function( email, options )
  {
    var default_options =
    {
      size: 120,
      default_image: '404',
      secure: true,
      rating: 'g'
    };

    options = CommonExt.Object.merge( default_options, options );

    var query_params = CommonExt.Object.toQueryString(
    {
      s: options.size,
      r: options.rating,
      d: options.default_image
    });

    var url = options.secure ? Common.utils.Gravatar.GRAVATAR_SECURE_URL : Common.utils.Gravatar.GRAVATAR_URL;

    return url + Common.crypt.Md5.encode( email ) + '?' + query_params;
  }

});
