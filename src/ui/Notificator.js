
/**
 * Notificator
 *
 * This notificator only allows one notification displayed.
 * Next notifications could be queued or discarted.
 *
 * #Examples
 *
 * Create notificator instance:
 *     var notificator = new Common.ui.Notificator(
 *     {
 *       close_text: 'Close'
 *     });
 *
 * Using shortcut methods:
 *     notificator.show_error( 'This is an error message' );
 *     notificator.show_success( 'This is a success message' );
 *     notificator.show_warning( 'This is a warning message' );
 *     notificator.show_info( 'This is an info message' );
 *
 * Using custom types:
 *     notificator.show_by_type( 'This is a loading message', 'loading' );
 *     notificator.show_by_type( 'This is an appointment message', 'appointment' );
 *
 * Using show method:
 *     notificator.show(
 *     {
 *       text: 'Custom text',
 *       discard: false,
 *       sticky: false,
 *       hide_delay: 2000,
 *       close_button: false,
 *       icon:
 *       {
 *         src: 'http://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Google_Chrome_icon_(2011).svg/64px-Google_Chrome_icon_(2011).svg.png',
 *         width: '40px',
 *         height: '40px'
 *       }
 *     });
 *
 * Hide notificator:
 *     notificator.hide();
 *
 */
Ext.define( 'Common.ui.Notificator',
{
  extend: 'Ext.Container',


  /**
   * Default css class
   *
   * @property {String}
   */
  cls: 'common-notificator',


  /**
   * Defines if it's showing notificator
   *
   * @property {Boolean}
   * @private
   */
  _showing_notificator: false,


  /**
   * Timeout id to hide notificator when hide_delay is used
   *
   * @property {Number}
   * @private
   */
  _hide_timeout_id: null,


  /**
   * Minimum delay time (milliseconds)
   *
   * @property {Number}
   * @private
   */
  _minimum_delay: 3000,


  /**
   * Close button text
   *
   * @property {String}
   */
  close_text: 'Close',


  /**
   * Extra CSS class
   *
   * @property {String}
   */
  extraCls: '',



  /**
   * Init component
   *
   * @private
   */
  initComponent: function()
  {
    this.autoEl = 'div';
    this.renderTo = Ext.getBody();
    this.cls += ' ' + this.extraCls;
    this.html = this._get_notificator_html();
    this.callParent( arguments );
  },



  /**
   * Prepares and shows notificator
   *
   * @param {Object} options
   * @param {String} options.text Text of the message
   * @param {Boolean} options.discard Wether if the notification is discartable or not. If discard = true, it won't be shown if another notification is displayed.
   * @param {Boolean} options.sticky Defines if the notification will be displayed permanently
   * @param {Number} options.hide_delay Time in milliseconds the notification will be on screen. If it's not set or set to 0, hide_delay depends on number of words.
   * @param {Boolean} options.close_button: Defines if the close button will be displayed
   * @param {String} options.iconCls CSS class with the background-image
   * @param {Object} options.icon Specific icon image properties
   * @param {String} options.icon.src Image URL to display as notification icon
   * @param {String} options.icon.width Units are required. For example: '16px'.
   * @param {String} options.icon.height
   */
  show: function( options )
  {
    if( this._showing_notificator )
    {
      if( !options.discard )
      {
        CommonExt.Function.defer( this.show, 1000, this, [ options ] );
      }

      return;
    }

    this._prepare( options );
    this._showing_notificator = true;

    // Display the notificator
    this.el.fadeIn( { duration: 0.2 } );

    if( options.sticky !== true )
    {
      var delay = options.hide_delay || ( this._get_delay_by_text( options.text ) );
      this._hide_timeout_id = CommonExt.Function.defer( this.hide, delay, this );
    }
  },



  /**
   * Prepares the notificator html
   *
   * @param {Object} options
   * @private
   */
  _prepare: function( options )
  {
    if( !options.text )
    {
      return;
    }

    // Clean icon container
    this.el.child( '.common-notificator_icon' ).dom.innerHTML = '';
    this.el.child( '.common-notificator_icon' ).dom.className = 'common-notificator_icon';

    // Set icon
    if( options.iconCls )
    {
      this.el.child( '.common-notificator_icon' ).dom.className += ' ' + options.iconCls;
    }
    else if( options.icon )
    {
      var html = new Ext.Template( '<img src="{src}" style="{width} {height}" />' ).apply(
      {
        src: options.icon.src,
        width: ( options.icon.width ) ? 'width: ' + options.icon.width + ';' : '',
        height: ( options.icon.height ) ? 'height: ' + options.icon.height + ';' : ''
      });

      this.el.child( '.common-notificator_icon' ).dom.innerHTML = html;
    }

    // Set text
    this.el.child( '.common-notificator_text' ).dom.innerHTML = options.text;

    // Set close button
    this.el.child( '.common-notificator_close' ).dom.style.display = ( options.close_button === false ) ? 'none' : 'block';
  },



  /**
   * Returns the time (seconds) that user needs to read the text depending on the number of words
   *
   * @param {String} text
   * @return {Number}
   * @private
   */
  _get_delay_by_text: function( text )
  {
    var average_words_per_minute = 150;
    var number_of_words = text.split( ' ' ).length;
    var time = ( number_of_words / average_words_per_minute ) * 60 * 1000;

    if( time < this._minimum_delay )
    {
      return this._minimum_delay;
    }

    return time;
  },



  /**
   * Hides notificator
   */
  hide: function()
  {
    clearTimeout( this._hide_timeout_id );

    this.el.fadeOut(
    {
      duration: 0.2,
      callback: CommonExt.bind( function(){ this._showing_notificator = false; }, this )
    });
  },



  /**
   * Shows message by type
   *
   * @param {String} text
   * @param {String} type
   * @param {Object} options
   */
  show_by_type: function( text, type, options )
  {
    var _options =
    {
      iconCls: 'common-notificator_icon_' + type,
      text: text,
      discard: false
    };

    Ext.apply( _options, options || {} );

    this.show( _options );
  },



  /**
   * Shows error message
   *
   * @param {String} text
   * @param {Object=} options (Optional)
   */
  show_error: function( text, options )
  {
    this.show_by_type( text, 'error', options );
  },



  /**
   * Shows success message
   *
   * @param {String} text
   * @param {Object} options (Optional)
   */
  show_success: function( text, options )
  {
    this.show_by_type( text, 'success', options );
  },



  /**
   * Shows warning message
   *
   * @param {String} text
   * @param {Object} options (Optional)
   */
  show_warning: function( text, options )
  {
    this.show_by_type( text, 'warning', options );
  },



  /**
   * Shows info message
   *
   * @param {String} text
   * @param {Object} options (Optional)
   */
  show_info: function( text, options )
  {
    this.show_by_type( text, 'info', options );
  },



  /**
   * Returns the notificator html
   *
   * @return {String}
   * @private
   */
  _get_notificator_html: function()
  {
    var html =
      '<table style="width: 100%;">' +
        '<tr>' +

          // Icon
          '<td style="width: 40px;">' +
            '<div class="common-notificator_icon"></div>' +
          '</td>' +

          // Text
          '<td style="text-align: left; width: 100%;">' +
            '<div class="common-notificator_text"></div>' +
          '</td>' +

          // Close button
          '<td style="text-align: right;">' +
            '<div class="common-notificator_close">' +
              '<div class="common-notificator_close_btn" onclick="Ext.getCmp( \'' + this.getId() + '\' ).hide();">' +
                this.close_text +
              '</div>' +
            '</div>' +
          '</td>' +

        '</tr>' +
      '</table>';

    return html;
  }

});
