
/**
 * Manages icon CSS classes to use as iconCls
 * Creates a CSS class to use an image as background
 * Based on TDGi.iconMgr
 *
 * Prepare the icons bases:
 *
 *     Common.ui.IconMgr.setIconsBase( 'silk', '/icons/silk' );
 *     Common.ui.IconMgr.setIconsBase( 'fugue', '/icons/fugue' );
 *
 *
 * Usage:
 *
 *     new Ext.menu.Item(
 *     {
 *       text: Common.Langs.get( 'online' ),
 *       iconCls: Common.ui.IconMgr.getIconBase( 'silk', 'user.gif' )
 *     })
 *
 */
CommonExt.define( 'Common.ui.IconMgr',
{
  singleton: true,

  /**
   * Prefix constant
   *
   * @property {String}
   */
  PREFIX: 'IconMgr_',


  /**
   * Icons bases
   *
   * For example:
   *
   * {
   *   SilkBase:
   *   {
   *     path: '/icons/silk',
   *     icons:
   *     {
   *       'user.gif':
   *       {
   *         cssRule: 'IconMgr_SilkBase_1302873530548',
   *         styleTxt: '.IconMgr_SilkBase_1302873530548 { background-image: url( /icons/silk/user.gif ) !important; }'
   *       }
   *     }
   *   }
   * }
   *
   * @private
   * @property {Object}
   */
  _iconsBases: {},


  /**
   * CSS Rule body template
   *
   * @private
   * @property {String}
   */
  _ruleBodyTpl: ' \n\r .{0} { background-image: url( {1} ) !important; }',



  /**
   * Sets icons base
   *
   * @param {String} name
   * @param {String} path
   * @return {Object}
   */
  setIconsBase: function( name, path )
  {
    if( ! this._iconsBases[ name ] )
    {
      var styleSheetId = this.PREFIX + name;
      Ext.util.CSS.createStyleSheet( '/* IconMgr stylesheet */\n', styleSheetId );
    }

    this._iconsBases[ name ] =
    {
      path: path,
      icons: {}
    };

    return this._iconsBases;
  },



  /**
   * Returns the css class from icon base to use into iconCls
   *
   * @param {String} baseName
   * @param {String} icon
   * @return {String}
   */
  getIconBase: function( baseName, icon )
  {
    // Check if icons base exists
    if( ! this._iconsBases[ baseName ] )
    {
      throw 'Icon base [' + baseName + '] not found';
    }

    // Check if icon css class has been already generated
    if( this._iconsBases[ baseName ].icons[ icon ] )
    {
      return this._iconsBases[ baseName ].icons[ icon ].cssRule;
    }

    // Generate icon css class
    return this._generateIconCSSRule( baseName, icon );
  },



  /**
   * Generates icon CSS rule
   *
   * @private
   * @param {String} baseName
   * @param {String} icon
   * @return {String}
   */
  _generateIconCSSRule: function( baseName, icon )
  {
    // Generate icon css rule name
    var cls = this.PREFIX + baseName + '_' + new Date().getTime();

    // Get icon image path
    var iconImgPath = this._iconsBases[ baseName ].path + '/' + icon;

    // Generate style text
    var styleBody = String.format( this._ruleBodyTpl, cls, iconImgPath );

    // Store icon
    this._iconsBases[ baseName ].icons[ icon ] =
    {
      cssRule: cls,
      styleText: styleBody
    };

    // Append CSS style text
    if( ! Ext.isIE )
    {
      var styleSheet = Ext.get( this.PREFIX + baseName );
      styleSheet.dom.sheet.insertRule( styleBody, styleSheet.dom.sheet.cssRules.length );
    }
    else
    {
      // Per http://www.quirksmode.org/dom/w3c_css.html#properties
      document.styleSheets[ this.PREFIX + baseName ].cssText += styleBody;
    }

    Ext.util.CSS.refreshCache();

    return cls;
  }

});
