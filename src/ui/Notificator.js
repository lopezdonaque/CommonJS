
/**
 * Notificator
 *
 * Allowed options for "show" method:
 *
 * - text: Text of the message
 * - discard: Wether if the notification is discartable or not. If discard = true, it won't be shown if another notification is displayed.
 * - sticky: Defines if the notification will be displayed permanently
 * - hide_delay: Time in milliseconds the notification will be on screen. If it's not set or set to 0, hide_delay depends on number of words.
 * - close_button: Defines if the close button will be displayed
 *
 * Icon as css class:
 * - iconCls: CSS class with the background-image
 *
 * Icon as URL:
 *
 * icon:
 * {
 *   src: Image URL to display as notification icon
 *   width: Width of the icon
 *   height: Height of the icon
 * }
 *
 *
 * #Examples:
 *
 *     var notificator = new Common.ui.Notificator(
 *     {
 *       close_text: 'Close'
 *     });
 *
 *     notificator.show_error( 'This is an error message' );
 *     notificator.show_success( 'This is a success message' );
 *     notificator.show_warning( 'This is a warning message' );
 *
 *     notificator.show_by_type( 'This is an info message', 'info' );
 *     notificator.show_by_type( 'This is an info message', 'appointment' );
 *
 *     notificator.hide();
 *
 */
Common.ui.Notificator = Ext.extend( Ext.Container,
{

  /**
   * Default css class
   *
   * @property {String}
   */
  cls: 'common-notificator',


  /**
   * Defines if it's showing notificator
   *
   * @private
   * @property {Boolean}
   */
  _showing_notificator: false,


  /**
   * Timeout id to hide notificator when hide_delay is used
   *
   * @private
   * @property {Number}
   */
  _hide_timeout_id: null,


  /**
   * Minimum delay time (milliseconds)
   *
   * @private
   * @property {Number}
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
   */
  initComponent: function()
  {
    this.autoEl = 'div';
    this.renderTo = Ext.getBody();
    this.cls += ' ' + this.extraCls;
    this.html = this._get_notificator_html();
    Common.ui.Notificator.superclass.initComponent.apply( this, arguments );
  },



  /**
   * Prepares and shows notificator
   *
   * @param {Object} options
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
   * @private
   * @param {Object} options
   */
  _prepare: function( options )
  {
    if( !options.text )
    {
      return false;
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
   * @private
   * @param {String} text
   * @return {Number}
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
   *
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
   * Returns the notificator html
   *
   * @private
   * @return {String}
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
