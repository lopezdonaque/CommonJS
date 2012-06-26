
/**
 * Displays an info
 *
 */
Common.ui.Info = Ext.extend( Ext.Container,
{
  autoEl: 'div',
  title: '',
  text: '',
  type: 'info', //info, warning, error


  /**
   * Init component
   *
   */
  initComponent: function()
  {
    var html = '';
    html += '<table cellpadding="0" cellspacing="0" border="0" class="common-info common-info_' + this.type + '" align="center">';
    html += '<tr>';
    html += '<td class="common-info_image"></td>';
    html += '<td class="common-info_body" valign="top">';

    if( this.title != '' )
    {
      html += '<span class="common-info_title">' + this.title + ':</span>&nbsp;';
    }

    html += '<span class="common-info_text">' + this.text + '</span>';
    html += '<br>';
    html += '<hr class="common-info_hr">';
    html += '</td>';
    html += '</tr>';
    html += '</table>';

    this.html = html;

    Common.ui.Info.superclass.initComponent.apply( this, arguments );
  }

});
