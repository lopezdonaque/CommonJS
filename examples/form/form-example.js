
Ext.onReady( function()
{
  Ext.BLANK_IMAGE_URL = 'http://extjs-public.googlecode.com/svn/tags/extjs-3.4.1.1/release/resources/images/default/s.gif';
  Ext.QuickTips.init();

  new Ext.form.FormPanel(
  {
    renderTo: Ext.getBody(),
    style: 'margin: 10;',
    width: 300,
    title: '',
    items:
    [
      new Common.form.ColorField(
      {
        fieldLabel: 'Color 1',
        allowBlank: false,
        colors: [ 'FFFFFF', '000000' ]
      }),
      new Common.form.ColorField(
      {
        fieldLabel: 'Color 2',
        value: '#FFAD85'
      }),
      new Common.form.ColorField(
      {
        fieldLabel: 'Color 3',
        value: 'wrong'
      })
    ],
    buttons:
    [
      new Ext.Button(
      {
        text: 'Save',
        formBind: true
      })
    ]
  });

});
