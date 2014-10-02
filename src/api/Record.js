
/**
 * Base class to create custom ExtJS Api Records
 *
 * Usage
 *
 *     Ext.define( 'Person',
 *     {
 *       extend: 'Common.api.Record',
 *       _fields:
 *       [
 *         { name: 'id' },
 *         { name: 'name' }
 *       ]
 *     }, function(){ this.prototype._build_fields(); } );
 *
 */
Ext.define( 'Common.api.Record',
{
  extend: 'Ext.data.Record',


  /**
   * Fields configuration
   *
   * @property {Array}
   * @private
   */
  _fields: [],


  /**
   * Fields
   *
   * @property {Ext.util.MixedCollection}
   */
  fields: null,



  /**
   * Constructor
   *
   * @param {Array} data
   * @param {String} id
   */
  constructor: function( data, id )
  {
    this.id = ( id || id === 0 ) ? id : Ext.data.Record.id( this );
    this.data = data || {};
  },



  /**
   * Returns fields by given name
   *
   * @param {String} name
   * @return {Ext.data.Field}
   */
  getField: function( name )
  {
    return this.fields.get( name );
  },



  /**
   * Builds fields (this method must be called by child classes after defined)
   *
   * @private
   */
  _build_fields: function()
  {
    if( !this.fields )
    {
      this.fields = new Ext.util.MixedCollection( false, function( field ){ return field.name; } );
    }

    for( var i = 0, len = this._fields.length; i < len; i++ )
    {
      this.fields.add( new Ext.data.Field( this._fields[i] ) );
    }
  }

});
