
/**
 * Adds a side icon to the field
 *
 * Usage:
 *
 *     var field = new Ext.form.TextField(
 *     {
 *       fieldLabel: 'First Name',
 *       plugins:
 *       [
 *         new Common.ui.plugins.field.SideIcon(
 *         {
 *           iconConfig:
 *           {
 *             cls: 'x-tool x-tool-help',
 *             clsOnOver: 'x-tool-help-over',
 *             tooltip: 'Tooltip text'
 *           },
 *           listeners:
 *           {
 *             click: function( field )
 *             {
 *               alert( 'On icon click' );
 *             }
 *           }
 *         })
 *       ]
 *     });
 *
 * Access to side icon programatically:
 *
 *     var sideicon = field.plugins[0].sideIcon;
 *
 */
CommonExt.define( 'Common.ui.plugins.field.SideIcon',
{
  extend: 'CommonExt.util.Observable',

  config:
  {
    iconConfig:
    {

      /**
       * CSS class
       *
       * @property {String}
       */
      cls: null,


      /**
       * Hover CSS class
       *
       * @property {String}
       */
      clsOnOver: null,


      /**
       * Tooltip text
       *
       * @property {String}
       */
      tooltip: null
    }
  },


  /**
   * Field instance
   *
   * @property {Ext.form.Field}
   * @private
   */
  _field: null,



  /**
   * Constructor
   *
   * @param {Object} options
   */
  constructor: function( options )
  {
    this.initConfig( options );

    this.addEvents(

      /**
       * Click event
       *
       * @event click
       */
      'click'
    );

    this.callParent( arguments );
  },



  /**
   * Initializes the plugin
   *
   * @param {Ext.form.Field} field
   * @private
   */
  init: function( field )
  {
    // Store field instance
    this._field = field;

    // Override instance methods
    field.alignErrorIcon = CommonExt.bind( field.triggerClass ? this._alignErrorIconTriggerField : this._alignErrorIconField, this );

    field.on( 'afterrender', this.addIcon, this );
  },



  /**
   * Override for trigger fields
   *
   * @private
   */
  _alignErrorIconTriggerField: function()
  {
    if( this._field.wrap )
    {
      if( this.sideIcon )
      {
        this._field.errorIcon.alignTo( this._field.wrap, 'tl-tr', [ 2 + this.sideIcon ? this.sideIcon.getWidth() + 4 : 0, 0 ] );
      }
      else
      {
        this._field.errorIcon.alignTo( this._field.wrap, 'tl-tr', [ 2, 0 ] );
      }
    }
  },



  /**
   * Override for fields
   *
   * @private
   */
  _alignErrorIconField: function()
  {
    if( this.sideIcon )
    {
      this._field.errorIcon.alignTo( this._field.el, 'tl-tr', [ 2 + this.sideIcon ? this.sideIcon.getWidth() + 4 : 0, 0 ] );
    }
    else
    {
      this._field.errorIcon.alignTo( this._field.el, 'tl-tr', [ 2, 0 ] );
    }
  },



  /**
   * Adds the icon to the field
   */
  addIcon: function()
  {
    if( !this._field.rendered || this._field.preventMark ) // not rendered
    {
      return;
    }

    if( Ext.isEmpty( this.config.iconConfig ) ) // not configured
    {
      return;
    }

    if( !this.sideIcon )
    {
      var elp = this._getIconCt( this._field.el );

      if( !elp ) // field has no container el
      {
        return;
      }

      this.sideIcon = elp.createChild( { cls: this.config.iconConfig.cls } );

      if( this._field.ownerCt )
      {
        this._field.ownerCt.on( 'afterlayout', this._alignIcon, this );
        this._field.ownerCt.on( 'expand', this._alignIcon, this );
      }

      this._field.on( 'resize', this._alignIcon, this );
      this._field.on( 'destroy', function(){ Ext.destroy( this.sideIcon ); }, this );

      this.sideIcon.addClassOnOver( this.config.iconConfig.clsOnOver );
      this.sideIcon.addListener( 'click', this._onIcon, this );

      if( this.config.iconConfig.tooltip )
      {
        this.sideIcon.set( { 'ext:qtip': this.config.iconConfig.tooltip } );
      }

      this._alignIcon();

      // Call to "alignErrorIcon" to force align if the field is invalid
      if( this._field.errorIcon )
      {
        this._field.alignErrorIcon();
      }
    }
  },



  /**
   * Removes icon
   */
  removeIcon: function()
  {
    Ext.destroy( this.sideIcon );
    this.sideIcon = null;

    // Call to "alignErrorIcon" to force align if the field is invalid
    if( this._field.errorIcon )
    {
      this._field.alignErrorIcon();
    }
  },



  /**
   * On icon click
   *
   * @param e
   * @param icon
   * @private
   */
  _onIcon: function( e, icon )
  {
    this.fireEvent( 'click', this );
  },



  /**
   * Returns icon component
   *
   * @param el
   * @return {*}
   * @private
   */
  _getIconCt: function( el )
  {
    return el.findParent( '.x-form-element', 5, true ) || // use form element wrap if available
      el.findParent( '.x-form-field-wrap', 5, true );   // else direct field wrap
  },



  /**
   * Aligns icon
   *
   * @private
   */
  _alignIcon: function()
  {
    if( this._field.triggerClass ) // TriggerField (ComboBox, DateField, etc.)
    {
      this.sideIcon.alignTo( this._field.el, 'tl-tr', [ 19, 3 ] );
    }
    else
    {
      this.sideIcon.alignTo( this._field.el, 'tl-tr', [ 2, 3 ] );
    }
  }

});
