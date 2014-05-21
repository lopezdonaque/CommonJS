
/**
 * Utils
 *
 */
CommonExt.define( 'Common.notifier.Utils',
{
  singleton: true,


  /**
   * Returns the time (seconds) that user needs to read the text depending on the number of words
   *
   * @param {String} text
   * @param {Object=} options
   * @return {Number}
   */
  get_readable_time: function( text, options )
  {
    options = CommonExt.merge(
    {
      average_words_per_minute: 150,
      minimum_delay: 3, // Minimum delay time (seconds)
      start_read_delay: 1 // Time that is considered that the user starts to read the notification
    }, options );

    var number_of_words = text.split( ' ' ).length;
    var time = ( number_of_words / options.average_words_per_minute ) * 60;

    if( time < options.minimum_delay )
    {
      return options.minimum_delay + options.start_read_delay;
    }

    return time + options.start_read_delay;
  }

});
