
/**
 * Timer
 *
 * #Examples:
 *
 * Chronometer:
 *
 *     var chronometer = new Common.utils.Timer(
 *     {
 *       frequency: 1,
 *       display_object_id: 'timer',
 *       display_format: '{H}h {M}m {S}s {m}ms',
 *       starts_at: 5000
 *     });
 *     chronometer.start();
 *
 * Clock:
 *
 *     var clock = new Common.utils.Timer(
 *     {
 *       frequency: 1,
 *       display_object_id: 'timer',
 *       display_format: '{H}h {M}m {S}s {m}ms',
 *       starts_at: new Date(),
 *       offset: new Date().getTimezoneOffset() * -1
 *     });
 *     clock.start();
 *
 */
CommonExt.define( 'Common.utils.Timer',
{
  extend: 'CommonExt.util.Observable',
  config:
  {

    /**
     * Frequency to update the timer
     *
     * @property {Number}
     */
    frequency: 500,


    /**
     * Display format => {H} (hours)  {M} (minutes) {S} (seconds) {m} (milliseconds)
     *
     * @property {String}
     */
    display_format: '{H}:{M}:{S}',


    /**
     * Object id where the timer will be displayed
     *
     * @property {String}
     */
    display_object_id: null,


    /**
     * Defines when should start to count
     *
     * @property {Number}
     */
    starts_at: 0,


    /**
     * Offset (only for clock NOT for chronometer) (minutes)
     *
     * @property {Number}
     */
    offset: 0
  },


  /**
   * Interval identifier
   *
   * @property {Number}
   * @private
   */
  _interval_id: null,


  /**
   * Time start
   *
   * @property {Number}
   * @private
   */
  _time_start: null,


  /**
   * Time end
   *
   * @property {Number}
   * @private
   */
  _time_end: null,


  /**
   * Current date time
   *
   * @property {Number}
   * @private
   */
  _time_now: 0,


  statics:
  {

    /**
     * Returns milliseconds in the required format
     *
     * @param {Number} milliseconds
     * @param {String} format
     * @return {String}
     */
    get_formatted_milliseconds: function( milliseconds, format )
    {
      var ms = milliseconds % 1000;
      var seconds_clean = parseInt( milliseconds / 1000 );
      var seconds = parseInt( seconds_clean % 60 );
      var minutes = parseInt( ( seconds_clean / 60 ) % 60 );
      var hours = parseInt( seconds_clean / 3600 );

      // Prepare the parameters for the template
      var params =
      {
        H: CommonExt.String.leftPad( hours, 2, '0' ),
        M: CommonExt.String.leftPad( minutes, 2, '0' ),
        S: CommonExt.String.leftPad( seconds, 2, '0' ),
        m: CommonExt.String.leftPad( ms, 3, '0' )
      };

      return new Ext.XTemplate( format ).apply( params );
    }
  },



  /**
   * Constructor
   *
   * @param {Object} config
   */
  constructor: function( config )
  {
    this.initConfig( config );
    this.callParent( arguments );
  },



  /**
   * Starts the timer
   */
  start: function()
  {
    Common.Log.debug( '[Common.utils.Timer.start] Starting timer [' + this.config.display_object_id + ']' );

    this._time_start = new Date().getTime();
    this._interval_id = setInterval( CommonExt.bind( this.update, this ), this.config.frequency );
    return this._interval_id;
  },



  /**
   * Stops the timer
   */
  stop: function()
  {
    Common.Log.debug( '[Common.utils.Timer.stop] Stoping timer [' + this.config.display_object_id + ']' );
    clearInterval( this._interval_id );
  },



  /**
   * Updates the timer
   */
  update: function()
  {
    this._time_end = new Date().getTime();
    this.display();
  },



  /**
   * Displays the timer
   */
  display: function()
  {
    if( this.config.display_object_id != '' )
    {
      var obj = Ext.DomQuery.selectNode( '#' + this.config.display_object_id );

      // Verify if the obj exists
      if( typeof( obj ) != 'undefined' && obj != null )
      {
        var text = this.get_formatted_string();

        if( obj.innerHTML != text )
        {
          obj.innerHTML = text;
        }
      }
      else
      {
        // If the display object has been removed, stop the timer
        this.stop();
      }
    }
  },



  /**
   * Returns the formatted string to display it
   *
   * @return {String}
   */
  get_formatted_string: function()
  {
    // Verify if its a chronometer or a clock
    if( typeof this.config.starts_at == 'object' )
    {
      return this.get_formatted_clock();
    }
    else
    {
      return this.get_formatted_chronometer();
    }
  },



  /**
   * Returns the formatted string for the clock
   *
   * @return {String}
   */
  get_formatted_clock: function()
  {
    // Get the time difference
    var time_difference = this._time_end - this._time_start;

    // Apply starts_at difference
    time_difference += this.config.starts_at.getTime();

    // Get current date
    var time_now = new Date();
    time_now.setTime( time_difference );

    // Apply offset
    var offset = this.config.offset * 60 * 1000;
    time_now.setTime( time_now.getTime() + offset );

    // Prepare the parameters for the template
    var params =
    {
      H: String.leftPad( time_now.getUTCHours(), 2, '0' ),
      M: String.leftPad( time_now.getUTCMinutes(), 2, '0' ),
      S: String.leftPad( time_now.getUTCSeconds(), 2, '0' ),
      m: String.leftPad( time_now.getUTCMilliseconds(), 3, '0' )
    };

    return new Ext.XTemplate( this.config.display_format ).apply( params );
  },



  /**
   * Returns the formatted string for the chronometer
   *
   * @return {String}
   */
  get_formatted_chronometer: function()
  {
    // Get the time difference
    var time_difference = this._time_end - this._time_start;

    if( this._time_now == 0 )
    {
      // Apply starts_at difference
      time_difference += parseInt( this.config.starts_at );
    }
    else
    {
      time_difference += this._time_now;
    }

    // Set the current time
    this._time_now = time_difference;

    // Reset the time_start to calculate the new time difference
    this._time_start = new Date().getTime();

    return Common.utils.Timer.get_formatted_milliseconds( time_difference, this.config.display_format );
  }

});
