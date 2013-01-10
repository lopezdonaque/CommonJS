
/**
 * Iframe transport request
 *
 * This transport creates an iframe and uses as form target to submit data
 *
 * It sends a parameter called "transport" with "iframe" as value.
 *
 * Usage:
 *     new Common.io.Iframe(
 *     {
 *       url: 'http://domain.com/iframe_test.php',
 *       data:
 *       {
 *         foo1: 'xx',
 *         foo2: 'yy'
 *       },
 *       listeners:
 *       {
 *         success: function( response ){ Common.Log.debug( 'Success', response ); },
 *         error: function( response ){ Common.Log.debug( 'Error', response ); },
 *         timeout: function( response ){ Common.Log.debug( 'Timeout', response ); },
 *       }
 *     }).request();
 *
 *
 *
 * PHP response example:
 *
 *     header( 'Content-type: text/html; charset=UTF-8;' );
 *     $json = json_encode( array( 'post' => $_POST, 'get' => $_GET, 'server' => $_SERVER ) );
 *     print( "<html><script type=\"text/javascript\"> window.name = '" . $json . "'; </script></html>" );
 *
 *     // Uncomment the next line to test timeout
 *     //sleep( 10 );
 *
 *
 */
CommonExt.define( 'Common.io.Iframe',
{
  extend: 'CommonExt.util.Observable',

  config:
  {
    /**
     * The number of milliseconds to wait for a response
     *
     * @property {Number}
     */
    timeout: 30000,


    /**
     * URL
     *
     * @property {String}
     */
    url: null,


    /**
     * Data to send to server
     *
     * @property {Object}
     */
    data: null
  },



  /**
   * Creates a new task object
   *
   * @param {Object} config
   */
  constructor: function( config )
  {
    this.initConfig( config );

    this.addEvents(

      /**
       * Success event
       *
       * @event success
       */
      'success',

      /**
       * Error event
       *
       * @event error
       */
      'error',

      /**
       * Timeout event
       *
       * @event timeout
       */
      'timeout'
    );

    this.callParent( arguments );
    return this;
  },



  /**
   * Sends request
   *
   */
  request: function()
  {
    // Create the iframe target of the form
    this._create_iframe();

    // Create the form to submit data
    this._create_and_submit_form();
  },



  /**
   * Creates iframe
   *
   * @private
   */
  _create_iframe: function()
  {
    this._iframeId = Ext.id();
    var frame = document.createElement( 'iframe' );
    frame.id = this._iframeId;
    frame.name = this._iframeId;
    frame.style.display = 'none';
    frame.src = this._get_transport_url();
    document.body.appendChild( frame );

    // This is required so that IE doesn't pop the response up in a new window
    if( document.frames )
    {
      document.frames[ frame.id ].name = frame.id;
    }

    Ext.EventManager.on( frame, 'load', this._on_iframe_load, this );
  },



  /**
   * Creates and submits the form
   *
   * @private
   */
  _create_and_submit_form: function()
  {
    var f = document.createElement( 'form' );
    f.target = this._iframeId;
    f.method = 'POST';
    f.action = this.url;
    f.style.display = 'none';
    document.body.appendChild( f );

    // Add transport info
    this.data.transport = 'iframe';

    // Add data parameters as hidden inputs
    CommonExt.Object.each( this.data, function( key, value )
    {
      if( CommonExt.isObject( value ) )
      {
        value = CommonExt.encode( value );
      }
      else if( value === null )
      {
        value = '';
      }

      this._add_hidden( f, key, value );
    }, this );

    this._timeoutId = CommonExt.defer( this._handle_timeout, this.timeout, this );

    f.submit();
    f.parentNode.removeChild( f );
  },



  /**
   * Adds input hidden to form
   *
   * @private
   * @param {Object} form
   * @param {String} name
   * @param {String} value
   */
  _add_hidden: function( form, name, value )
  {
    var hd = document.createElement( 'input' );
    Ext.fly( hd ).set(
    {
      type: 'hidden',
      name: name,
      value: value
    });
    form.appendChild( hd );
  },



  /**
   * On iframe load handler
   *
   * @private
   * @param {Object} event
   * @param {Object} iframe
   */
  _on_iframe_load: function( event, iframe )
  {
    if( this.domainRestored === true )
    {
      this.domainRestored = false; // Reset variable to use in the next request
      Ext.EventManager.removeAll( iframe );
      var win = iframe.contentWindow;

      if( win.name == this._iframeId )
      {
        this.fireEvent( 'error' );
      }
      else
      {
        this.fireEvent( 'success', win.name );
      }

      this._destroy();
    }
    else
    {
      iframe.contentWindow.location = this._get_transport_url();
      this.domainRestored = true;
    }
  },



  /**
   * Destroys transaction
   *
   * @private
   */
  _destroy: function()
  {
    Ext.getBody().dom.removeChild( document.getElementById( this._iframeId ) );
    clearTimeout( this._timeoutId );
  },



  /**
   * Handles timeout callback
   *
   * @private
   */
  _handle_failure: function()
  {
    Common.Log.warn( '[Common.io.Iframe._handle_failure] Failure', this );
    this._destroy();
    this.fireEvent( 'error', null );
  },



  /**
   * Handles timeout callback
   *
   * @private
   */
  _handle_timeout: function()
  {
    Common.Log.warn( '[Common.io.Iframe._handle_timeout] Timeout failure', this );
    this._destroy();
    this.fireEvent( 'timeout', null );
  },



  /**
   * Returns transport URL
   *
   * @return {String}
   * @private
   */
  _get_transport_url: function()
  {
    if( CommonExt.isSecure && CommonExt.isIE7 && Common.utils.Url.isCrossDomain( this.url ) )
    {
      if( !Common.blank_html_url )
      {
        throw 'When using cross-domain and IE7+SSL "Common.blank_html_url" must be configured using a blank URL of the same domain';
      }

      return Common.blank_html_url;
    }

    return CommonExt.SSL_SECURE_URL;
  }

});

