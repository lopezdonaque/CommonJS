
/**
 * Tab Group Button
 *
 */
Ext.define( 'Common.ui.tabgroup.TabGroupButton',
{
  extend: 'Ext.Container',
  cls: 'common-tabgroup-tabgroupbutton',


  /**
   * Init component
   *
   * @private
   */
  initComponent: function()
  {
    this.addEvents(

      /**
       * Click event
       *
       * @event click
       */
      'click',

      /**
       * Close event
       *
       * @event close
       */
      'close'
    );

    var onclick = "var cmp = Ext.getCmp( '" + this.getId() + "' ); cmp.fireEvent( 'click', cmp );";
    var onclose = "var cmp = Ext.getCmp( '" + this.getId() + "' ); cmp.fireEvent( 'close', cmp );";

    var iconHtml = ( this.iconCls ) ? '<div class="common-tabgroup-tabgroupbutton-icon ' + this.iconCls + '"></div>' : '';

    this.html =
      '<div class="common-tabgroup-tabgroupbutton-text-wrapper" onclick="' + onclick + '">' +
        iconHtml +
        '<span class="common-tabgroup-tabgroupbutton-text">' + this.text + '</span>' +
      '</div>' +
      '<div class="common-tabgroup-tabgroupbutton-close" onclick="' + onclose + '"></div>';

    this.callParent( arguments );
  }

});
