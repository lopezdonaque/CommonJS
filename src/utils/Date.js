
/**
 * Date utility methods
 *
 * Examples
 *
 *     Common.utils.Date.formatDate( CommonExt.Date.now(), Common.locale.Date.patterns.ShortDate )
 *
 */
CommonExt.define( 'Common.utils.Date',
{
  singleton: true,


  /**
   * Custom method to format unix timestamp
   *
   * @deprecated
   * @param {Number} unix_timestamp
   * @param {String} pattern (Optional)
   * @return {String}
   */
  formatDate: function( unix_timestamp, pattern )
  {
    return this.formatTimestamp( unix_timestamp, pattern );
  },



  /**
   * Custom method to format unix timestamp
   *
   * @param {Number} unix_timestamp
   * @param {String} pattern (Optional)
   * @return {String}
   */
  formatTimestamp: function( unix_timestamp, pattern )
  {
    var date = CommonExt.Date.parse( parseInt( unix_timestamp ), 'U' );
    return CommonExt.Date.format( date, pattern || Common.locale.Date.patterns.ShortDateTime );
  },



  /**
   * Returns elapsed time text
   *
   * @param {Number} unix_timestamp
   * @return {String}
   */
  getElapsedTime: function( unix_timestamp )
  {
    var date = CommonExt.Date.parse( parseInt( unix_timestamp ), 'U' );
    var now = new Date();
    var one_hour_ago = CommonExt.Date.add( new Date(), CommonExt.Date.HOUR, -1 );
    var one_day_ago = CommonExt.Date.add( new Date(), CommonExt.Date.DAY, -1 );

    // Less than one hour (display minutes)
    if( CommonExt.Date.between( date, one_hour_ago, now ) )
    {
      var ms = now.getTime() - date.getTime();
      var minutes = Common.utils.Timer.get_formatted_milliseconds( ms, '{M}' );
      return Common.Langs.get( 'minutes_ago' ).replace( '%s', parseInt( minutes ) );
    }

    // Less than one day (display hours)
    if( CommonExt.Date.between( date, one_day_ago, now ) )
    {
      var ms = now.getTime() - date.getTime();
      var hours = Common.utils.Timer.get_formatted_milliseconds( ms, '{H}' );
      return Common.Langs.get( 'hours_ago' ).replace( '%s', parseInt( hours ) );
    }

    // Current year (display date without year)
    if( now.getFullYear() == date.getFullYear() )
    {
      return this.formatDate( unix_timestamp, Common.locale.Date.patterns.VeryShortDate );
    }

    // Others (display full date)
    return this.formatDate( unix_timestamp, Common.locale.Date.patterns.ShortDate );
  },



  /**
   * Returns due time text
   *
   * @param {Number} unix_timestamp
   * @return {String}
   */
  getDueTime: function( unix_timestamp )
  {
    var date = CommonExt.Date.parse( parseInt( unix_timestamp ), 'U' );
    var now = new Date();
    var one_hour_after = CommonExt.Date.add( new Date(), CommonExt.Date.HOUR, 1 );
    var one_day_after = CommonExt.Date.add( new Date(), CommonExt.Date.DAY, 1 );

    // More than one hour (display minutes)
    if( CommonExt.Date.between( date, now, one_hour_after ) )
    {
      var ms = date.getTime() - now.getTime();
      var minutes = Common.utils.Timer.get_formatted_milliseconds( ms, '{M}' );
      return Common.Langs.get( 'minutes_after' ).replace( '%s', parseInt( minutes ) );
    }

    // More than one day (display hours)
    if( CommonExt.Date.between( date, now, one_day_after ) )
    {
      var ms = date.getTime() - now.getTime();
      var hours = Common.utils.Timer.get_formatted_milliseconds( ms, '{H}' );
      return Common.Langs.get( 'hours_after' ).replace( '%s', parseInt( hours ) );
    }

    // Current year (display date without year)
    if( now.getFullYear() == date.getFullYear() )
    {
      return this.formatDate( unix_timestamp, Common.locale.Date.patterns.VeryShortDate );
    }

    // Others (display full date)
    return this.formatDate( unix_timestamp, Common.locale.Date.patterns.ShortDate );
  },



  /**
   * Returns the first and last day of the week by given date
   *
   * @param {Date} d
   * @param {Boolean} as_timestamp
   * @return {Object}
   */
  getWeekStartEnd: function( d, as_timestamp )
  {
    var first = d.getDate() - d.getDay() + Common.locale.Date.startDay; // First day = the day of the month minus the day of the week
    var firstday = new Date( d.setDate( first ) );
    var ini_date = CommonExt.Date.clearTime( firstday, true );

    var end_date = CommonExt.Date.add( firstday, CommonExt.Date.DAY, 6 );
    end_date.setHours( 23, 59, 59, 999 );

    if( as_timestamp === true )
    {
      ini_date = Number( CommonExt.Date.format( ini_date, 'U' ) );
      end_date = Number( CommonExt.Date.format( end_date, 'U' ) );
    }

    return {
      start: ini_date,
      end: end_date
    };
  }

});
