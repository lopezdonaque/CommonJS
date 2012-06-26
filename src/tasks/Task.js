
/**
 * Task
 *
 * Usage:
 *
 *     var task = new Common.tasks.Task(
 *     {
 *       id: 1,
 *       start: parseInt( new Date().getTime() / 1000 ) + ( 5 * 60 ), //seconds
 *       end: parseInt( new Date().getTime() / 1000 ) + ( 20 * 60 ), //seconds
 *       reminders: [ 4, 3, 2, 1 ]
 *     });
 *
 */
CommonExt.define( 'Common.tasks.Task',
{
  extend: 'CommonExt.util.Observable',

  config:
  {
    /**
     * Task id
     *
     * @property {Number}
     */
    id: null,


    /**
     * Start date (seconds) (unixtimestamp with same timezone as PC)
     *
     * @property {Number}
     */
    start: null,


    /**
     * End date (seconds) (unixtimestamp with same timezone as PC)
     *
     * @property {Number}
     */
    end: null,


    /**
     * Reminders (minutes)
     *
     * Example: [ 1, 5, 10, 60, 120 ]
     *
     * @property {Array}
     */
    reminders: [],


    /**
     * Custom data
     *
     * @property {Object}
     */
    data: {}
  },



  /**
   * Creates a new task object
   *
    * @param {Object} config
   */
  constructor: function( config )
  {
    this.initConfig( config );
    this._firedReminders = [];
    this.callParent( arguments );
  }

});
