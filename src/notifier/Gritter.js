
/**
 * Gritter notifications
 *
 * Based on Growl for ExtJs:
 * http://github.com/zir/ext-growl
 *
 * Usage:
 *
 *     Common.notifier.Gritter.add(
 *     {
 *       title: 'Some title',
 *       text: 'Some text',
 *       image: 'common-gritter-success'
 *     });
 *
 */
CommonExt.define( 'Common.notifier.Gritter',
{
  singleton: true,
  extend: 'CommonExt.util.Observable',

  options:
  {
    /**
     * How fast notifications fade in
     *
     * @property {Number}
     */
    fade_in_speed: .4,


    /**
     * How fast the notices fade out
     *
     * @property {Number}
     */
    fade_out_speed: .2,


    /**
     * Hang on the screen for...
     *
     * @property {Number}
     */
    time: 3000,


    /**
     * Define if time must be appended to text
     *
     * @property {Boolean}
     */
    append_time_to_text: true
  },


  /**
   * Item counter
   *
   * @property {Number}
   * @private
   */
  _item_count: 0,


  /**
   * Custom timer
   *
   * @property {Number}
   * @private
   */
  _custom_timer: 0,


  /**
   * Wrapper template
   *
   * @property {String}
   * @private
   */
  _tpl_wrap: '<div id="common-gritter-notice-wrapper"></div>',


  /**
   * Close template
   *
   * @property {String}
   * @private
   */
  _tpl_close: '<div class="common-gritter-close"></div>',


  /**
   * Item template
   *
   * @property {String}
   * @private
   */
  _tpl_item:
    '<div id="common-gritter-item-{number}" class="common-gritter-item-wrapper {item_class}" style="display: none;">' +
      '<div class="common-gritter-top"></div>' +
      '<div class="common-gritter-item">' +
        '{image}' +
        '<div class="{class_name}">' +
          '<span class="common-gritter-title">{title}</span>' +
          '<p>{text}</p>' +
        '</div>' +
        '<div style="clear: both;"></div>' +
      '</div>' +
      '<div class="common-gritter-bottom"></div>' +
    '</div>',


  /**
   * Stores the unique_id and notification number to know which notifications are on screen
   *
   * @property {Array}
   * @private
   */
  _on_screen_notifications: [],



  /**
   * Add a gritter notification to the screen
   *
   * @param {Object} params The object that contains all the options for drawing the notification
   * @return {Number} The specific numeric id to that gritter notification
   */
  add: function( params )
  {
    // Check if notification must be unique on screen
    if( params.unique_id )
    {
      // Check if the notification is on screen and hide it
      var screen_notification = this._get_on_screen_notification( 'unique_id', params.unique_id );
      if( screen_notification )
      {
        Common.Log.debug( '[Common.notifier.Gritter.add] Unique notification. Hide previous.' );
        clearTimeout( this[ '_int_id_' + screen_notification.id ] );
        this.removeSpecific( screen_notification.id, {}, null, true );
      }
    }

    // Basics
    var title = params.title || ' ',
    text = params.text || ' ',
    image = params.image || '',
    sticky = params.sticky || false,
    item_class = params.class_name || '',
    time_alive = params.time || ( Common.notifier.Utils.get_readable_time( params.text ) * 1000 );

    this._verifyWrapper();

    var number = ++this._item_count;

    // Assign callbacks
    CommonExt.each( [ 'before_open', 'after_open', 'before_close', 'after_close' ], function( val )
    {
      this[ '_' + val + '_' + number ] = ( CommonExt.isFunction( params[ val ] ) ) ? params[ val ] : function(){}
    }, this );

    // Reset
    this._custom_timer = 0;

    // A custom fade time set
    if( time_alive )
    {
      this._custom_timer = time_alive;
    }

    if( image != '' )
    {
      image = ( image.indexOf( '.' ) == -1 ) ? '<div class="common-gritter-image ' + image + '"></div>' : '<img src="' + image + '" class="common-gritter-image" />';
    }

    this._on_screen_notifications.push(
    {
      id: number,
      unique_id: params.unique_id
    });

    // Replace "\n" to display as html
    text = text.replace( /\\n/g, '<br>' );

    // Add time
    if( this.options.append_time_to_text )
    {
      text += '<br>' + Common.Langs.get( 'hour' ) + ': ' + CommonExt.Date.format( new Date(), 'H:i:s' );
    }

    Ext.fly( 'common-gritter-notice-wrapper' ).insertHtml( 'beforeEnd', new CommonExt.Template( this._tpl_item ).apply(
    {
      title: title,
      text: text,
      image: image,
      number: number,
      class_name: ( image != '' ) ? 'common-gritter-with-image' : 'common-gritter-without-image',
      item_class: item_class
    }));

    var item = Ext.get( 'common-gritter-item-' + number );

    this.fireEvent( 'before_open', number, item );
    this[ '_before_open_' + number ]();

    item.fadeIn(
    {
      duration: this.options.fade_in_speed,
      endOpacity: 1,
      scope: this,
      callback: function( el )
      {
        this.fireEvent( 'after_open', number, el );
        this[ '_after_open_' + number ]( el );

        // Bind the hover/unhover states
        item.on(
        {
          scope: this,
          mouseenter: function()
          {
            //item.fadeOut({duration: this.options.fade_out_speed, endOpacity: 0, remove: true});
            if( !sticky )
            {
              clearTimeout( this[ '_int_id_' + number ] );
              item.stopFx();
              item.show();
            }

            item.addClass( 'hover' );
            var find_img = item.select( 'img' );

            // Insert the close button before that element
            ( find_img.length ) ? find_img.insertHtml( 'beforeBegin', this._tpl_close ) : item.select( 'span' ).insertHtml( 'beforeBegin', this._tpl_close );

            // Clicking (X) makes the perdy thing close
            item.select( '.common-gritter-close' ).on( 'click', function()
            {
              var unique_id = item.id.split('-')[3];
              this.removeSpecific( unique_id, {}, item, true );
            }, this );
          },
          mouseleave: function()
          {
            sticky || this._setFadeTimer( item, number );
            item.removeClass( 'hover' );
            item.select( '.common-gritter-close' ).remove();
          }
        });
      }
    });

    if( !sticky )
    {
      this._setFadeTimer( item, number );
    }

    return number;
  },



  /**
   * Remove a gritter notification from the screen
   *
   * @param {Number} id The ID used to delete a specific notification
   * @param {Object=} params A set of options passed in to determine how to get rid of it
   */
  remove: function( id, params )
  {
    this.removeSpecific( id, params || {} );
  },



  /**
   * Remove all notifications
   *
   * @param {Object} params A list of callback functions to pass when all notifications are removed
   */
  removeAll: function( params )
  {
    this.stop( params || {} );
  },



  /**
   * Remove a specific notification based on an ID
   *
   * @param {Number} unique_id The ID used to delete a specific notification
   * @param {Object} params A set of options passed in to determine how to get rid of it
   * @param {Object=} item The ExtJs element that we're "fading" then removing
   * @param {Boolean=} unbind_events If we clicked on the (X) we set this to true to unbind mouseenter/mouseleave
   */
  removeSpecific: function( unique_id, params, item, unbind_events )
  {
    if( !item )
    {
      item = Ext.get( 'common-gritter-item-' + unique_id );
    }

    // We set the fourth param to let the _fade function know to
    // unbind the "mouseleave" event.  Once you click (X) there's no going back!
    this._fade( item, unique_id, params || {}, unbind_events );
  },



  /**
   * Bring everything to a halt
   *
   * @param {Object} params A list of callback functions to pass when all notifications are removed
   */
  stop: function( params )
  {
    // callbacks (if passed)
    var before_close = ( CommonExt.isFunction( params.before_close ) ) ? params.before_close : function(){};
    var after_close = ( CommonExt.isFunction( params.after_close ) ) ? params.after_close : function(){};

    var wrap = Ext.get( 'common-gritter-notice-wrapper' );
    before_close( wrap );
    wrap.fadeOut(
    {
      endOpacity: 0,
      remove: true,
      callback: after_close
    });
  },



  /**
   * If we don't have any more gritter notifications, get rid of the wrapper using this check
   *
   * @param {Number} unique_id The ID of the element that was just deleted, use it for a callback
   * @param {Object} item The ExtJs element that we're going to perform the remove() action on
   * @private
   */
  _countRemoveWrapper: function( unique_id, item )
  {
    // Remove it then run the callback function
    item && item.remove();

    this.fireEvent( 'after_close', unique_id, item );
    this[ '_after_close_' + unique_id ]( item );

    // Check if the wrapper is empty, if it is.. remove the wrapper
    if( Ext.select( 'div.common-gritter-item-wrapper' ).elements.length === 0 )
    {
      Ext.fly( 'common-gritter-notice-wrapper' ).remove();
    }
  },



  /**
   * Fade out an element after it's been on the screen for x amount of time
   *
   * @param {Object} item The ExtJs element to get rid of
   * @param {Number} unique_id The id of the element to remove
   * @param {Object} params An optional list of params to set fade speeds etc.
   * @param {Boolean} unbind_events Unbind the mouseenter/mouseleave events if they click (X)
   * @private
   */
  _fade: function( item, unique_id, params, unbind_events )
  {
    params = params || {};
    var fade = ( typeof( params.fade ) != 'undefined' ) ? params.fade : true;
    var fade_out_speed = params.speed || this.options.fade_out_speed;

    // Remove on screen notification
    var screen_notification = this._get_on_screen_notification( 'id', parseInt( unique_id ) );
    var index = CommonExt.Array.indexOf( this._on_screen_notifications, screen_notification );
    if( index != -1 )
    {
      CommonExt.Array.erase( this._on_screen_notifications, index, 1 );
    }

    this.fireEvent( 'before_close', unique_id, item );
    this[ '_before_close_' + unique_id ]( item );

    // If this is true, then we are coming from clicking the (X)
    if( unbind_events )
    {
      item.removeAllListeners();
    }

    // Fade it out or remove it
    if( fade )
    {
      // callback will be called no matter the effect finished normally or stopped by "stopFx()"
      // it means effect stopped by "stopFx()" considered 'completed'
      item.ghost( 'r',
      {
        endOpacity: 0,
        easing: 'easeNone',
        duration: fade_out_speed,
        scope: this,
        callback: function()
        {
          // if the effect was stopped by "mouseenter" event (by calling "stopFx()"),
          // then the div should be visible as "item.show()" was called after a short time
          CommonExt.defer( function()
          {
            if( !item.isVisible() )
            {
              this._countRemoveWrapper( unique_id, item );
            }
          }, 10, this );
        }
      });
    }
    else
    {
      this._countRemoveWrapper( unique_id, item );
    }
  },



  /**
   * Set the notification to fade out after a certain amount of time
   *
   * @param {Object} item The HTML element we're dealing with
   * @param {Number} unique_id The ID of the element
   * @private
   */
  _setFadeTimer: function( item, unique_id )
  {
    var timer_str = this._custom_timer || this.options.time;
    this[ '_int_id_' + unique_id ] = CommonExt.defer( this._fade, timer_str, this, [ item, unique_id ] );
  },



  /**
   * A check to make sure we have something to wrap our notices with
   *
   * @private
   */
  _verifyWrapper: function()
  {
    if( !Ext.fly( 'common-gritter-notice-wrapper' ) )
    {
      //Ext.DomHelper.append(document.body, {tag: 'div', id: 'common-gritter-notice-wrapper'});
      Ext.get( document.body ).insertHtml( 'beforeEnd', this._tpl_wrap );
    }
  },



  /**
   * Finds and returns on screen notification
   *
   * @param {String} parameter
   * @param {String} value
   * @return {Object}
   * @private
   */
  _get_on_screen_notification: function( parameter, value )
  {
    var position = CommonExt.Array.pluck( this._on_screen_notifications, parameter ).indexOf( value );
    return this._on_screen_notifications[ position ];
  }

});
