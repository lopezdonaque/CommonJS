
/**
 * Bandwidth
 *
 * #Examples
 *
 *     var bw = new Common.utils.Bandwidth( 'http://domain.com/bwtest.php' );
 *     bw.on( bw.EVENT_UPLOAD_FINISHED, function(){} );
 *     bw.start_upload_test()
 *
 */
CommonExt.define( 'Common.utils.Bandwidth',
{
  extend: 'CommonExt.util.Observable',


  /**
   * Event upload finished constant
   *
   * @property {String}
   */
  EVENT_UPLOAD_FINISHED: 'upload_finished',


  /**
   * Upload result
   *
   * @private
   * @property {Number}
   */
  _upload_result: 0,


  /**
   * Number of requests to test bandwidth
   *
   * @private
   * @property {Number}
   */
  _num_tests: 6,


  /**
   * Test size (number of bytes to send)
   *
   * @private
   * @property {Number}
   */
  _test_size: 40000,


  /**
   * URL for requests
   *
   * @private
   * @property {String}
   */
  _url: '',



  /**
   * Constructor
   *
   * @param {String} url
   */
  constructor: function( url )
  {
    this._url = url;
    this.callParent( arguments );
  },



  /**
   * Starts upload test
   *
   */
  start_upload_test: function()
  {
    Common.Log.debug( '[Common.utils.Bandwidth.upload_test] Initializing upload test to URL:', this._url );

    // Set data to upload
    this._upload_data = CommonExt.String.repeat( 'x', this._test_size );

    // Reset variables
    this._results = new Array();
    this._tests_done = 0;

    this._do_tests();
  },



  /**
   * Do required tests defined in "_num_tests"
   *
   * @private
   */
  _do_tests: function()
  {
    Common.Log.debug( '[Common.utils.Bandwidth._do_tests] Do test: ', this._tests_done );

    this._tests_done++;

    if( this._tests_done > this._num_tests )
    {
      this._finish();
      return;
    }

    var start_time = new Date().getTime();

    CommonExt.Ajax.request(
    {
      url: this._url,
      params: { hidden: this._upload_data, nocache: 1 },
      scope: this,
      success: function()
      {
        var current_time = new Date().getTime();
        this._results.push( ( current_time - start_time ) / 1000 );
        this._do_tests();
      }
    });
  },



  /**
   * Finish tests and fires result
   *
   * @private
   */
  _finish: function()
  {
    this._results.sort( function( a, b ){ return b - a; } );

    // Discard better and worst (results are ordered)
    this._results.splice( (this._results.length - 1 ), 1 );
    this._results.splice( 0, 1 );

    this._upload_result = 0;

    for( var i = 0; i < this._results.length; i++ )
    {
      this._upload_result = this._upload_result + this._results[ i ];
    }

    this._upload_result = this._upload_result / this._results.length;
    this._upload_result = this._test_size * 8 * 1.2 / this._upload_result;
    this._upload_result = Math.floor( this._upload_result );

    Common.Log.debug( '[Common.utils.Bandwidth.upload_test] firing EVENT_UPLOAD_FINISHED. Result: ', this._get_formatted_result() );
    this.fireEvent( this.EVENT_UPLOAD_FINISHED, { result: this._upload_result } );
  },



  /**
   * Returns formatted result
   *
   * @return {String}
   * @private
   */
  _get_formatted_result: function()
  {
    var upload_bw, units;

    if( this._upload_result > 1000000 )
    {
      upload_bw = this._upload_result / 1000000;
      units = 'Mbps';
    }
    else if( this._upload_result > 1000 )
    {
      upload_bw = this._upload_result / 1000;
      units = 'Kbps';
    }
    else
    {
      upload_bw = this._upload_result;
      units = 'bps';
    }

    return CommonExt.Number.toFixed( upload_bw, 2 ) + units;
  },



  /**
   * Returns upload result
   *
   * @return {Number}
   */
  get_upload_result: function()
  {
    return this._upload_result;
  }

});
