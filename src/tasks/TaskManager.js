
/**
 * Manages tasks
 *
 * #Examples:
 *
 * Create a task which start in 5 minutes and has reminders for each minute before start
 *
 *     var task = new Common.tasks.Task(
 *     {
 *       id: 1,
 *       start: parseInt( new Date().getTime() / 1000 ) + ( 5 * 60 ), // seconds
 *       end: parseInt( new Date().getTime() / 1000 ) + ( 20 * 60 ), // seconds
 *       reminders: [ 4, 3, 2, 1 ]
 *     });
 *
 *
 * Create the task manager and prepare the callback for reminder events
 *
 *     var tm = new Common.tasks.TaskManager();
 *
 *     tm.on( Common.tasks.TaskManager.EVENT_REMINDER, function( task, reminder )
 *     {
 *       Common.Log.debug( 'Reminder received', task.id, task, reminder );
 *       //tm.removeTask( task.id );
 *     });
 *
 *
 * Add a task to the task manager
 *
 *     tm.addTask( task );
 *
 */
CommonExt.define( 'Common.tasks.TaskManager',
{
  extend: 'CommonExt.util.Observable',

  statics:
  {
    /**
     * Event reminder constant
     *
     * @property {String}
     */
    EVENT_REMINDER: 'reminder'
  },

  config:
  {
    /**
     * Tasks
     *
     * @property {Common.tasks.Task[]}
     */
    tasks: {}
  },


  /**
   * Stores fired reminders of each task
   *
   * @private
   * @property {Array}
   */
  _firedReminders: [],



  /**
   * Creates a new task object
   *
   * @param {Object} config
   */
  constructor: function( config )
  {
    this.initConfig( config );
    this._interval_id = setInterval( CommonExt.bind( this._checkTasks, this ), 5000 );

    this.addEvents(

      /**
       * Reminder event
       *
       * @event reminder
       */
      'reminder'
    );

    this.callParent( arguments );
  },



  /**
   * Adds a task
   *
   * @param {Common.tasks.Task} task
   */
  addTask: function( task )
  {
    if( this.tasks[ task.id ] )
    {
      return false;
    }

    // Prepare reminders (Sort reminders from lower to greater to use in "_checkReminders")
    task.reminders = CommonExt.Array.unique( task.reminders ).sort( function( a, b ){ return a - b; } );

    this.tasks[ task.id ] = task;
  },



  /**
   * Removes a task
   *
   * @param {Number} id
   */
  removeTask: function( id )
  {
    delete this.tasks[ id ];
  },



  /**
   * Checks tasks
   *
   * @private
   */
  _checkTasks: function()
  {
    CommonExt.Object.each( this.tasks, function( id, task )
    {
      // Check if the task has been expired
      if( task.start < parseInt( new Date().getTime() / 1000 ) )
      {
        return;
      }

      // Check reminders
      this._checkReminders( task );
    }, this );
  },



  /**
   * Checks reminders
   *
   * @private
   * @param {Common.tasks.Task} task
   */
  _checkReminders: function( task )
  {
    var now_seconds = parseInt( new Date().getTime() / 1000 );
    var now_minutes = parseInt( now_seconds / 60 );
    var task_start_minutes = parseInt( task.start / 60 );

    for( var i = 0; i < task.reminders.length; i++ )
    {
      var reminder_minutes = task.reminders[ i ];
      var reminder_time_minutes = parseInt( task_start_minutes - reminder_minutes );

      // Check if the reminder has been fired
      if( CommonExt.Array.contains( this._firedReminders, task.id + '_' + reminder_minutes ) )
      {
        return;
      }

      // Check if the reminder must be fired
      if( reminder_time_minutes <= now_minutes )
      {
        this.fireEvent( Common.tasks.TaskManager.EVENT_REMINDER, task, reminder_minutes );
        this._firedReminders.push( task.id + '_' + reminder_minutes );
        return;
      }
    }
  },



  /**
   * Removes all tasks
   *
   */
  removeAllTasks: function()
  {
    this.tasks = {};
  }

});
