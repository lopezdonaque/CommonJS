
/**
 * Proxy class to use in ExtJS objects like grids, combos, etc.
 *
 */
Common.api.Proxy = Ext.extend( Ext.data.ScriptTagProxy,
{

  /**
   * The number of milliseconds to wait for a response.
   *
   * @property {Number}
   */
  timeout: 10000,


  /**
   * Common Api Rpc instance
   *
   * @property {Common.api.Rpc}
   */
  rpc: null,



  /**
   * Constructor
   *
   * @param {String} entity
   * @param {String} method
   * @param {Array} args
   */
  constructor: function( entity, method, args )
  {
    Common.api.Proxy.superclass.constructor.call( this, arguments );

    this._entity = entity;
    this._method = method;
    this._args = args;

    this.api =
    {
      read: 'xx',
      create: 'xx',
      update: 'xx',
      destroy: 'xx'
    };
  },



  /**
   * Do request
   *
   * @param action
   * @param rs
   * @param params
   * @param reader
   * @param callback
   * @param scope
   * @param arg
   */
  doRequest: function( action, rs, params, reader, callback, scope, arg )
  {
    //Common.Log.debug( '[Common.api.Proxy.doRequest] Do request', arguments );

    var transId = ++Ext.data.ScriptTagProxy.TRANS_ID;
    this.trans =
    {
      id: transId,
      action: action,
      params: params,
      arg: arg,
      callback: callback,
      scope: scope,
      reader: reader
    };

    var rpc = new Common.api.Rpc( this._entity, this._method, this._args );
    rpc.on( Common.api.RpcEvents.SUCCESS, this.createCallback( action, rs, this.trans ) );
    rpc.on( Common.api.RpcEvents.ERROR, this._on_rpc_error, this );
    rpc.request();
  },



  /**
   * On Rpc event handler
   *
   * @private
   */
  _on_rpc_error: function()
  {
    this.fireEvent( 'exception', this, 'response', this.trans.action,
    {
      response: null,
      options: this.trans.arg
    });
  },



  /**
   * @private
   */
  destroyTrans: function( trans, isLoaded )
  {

  }

});
