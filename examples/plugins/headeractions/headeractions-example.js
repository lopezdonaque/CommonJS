
Ext.onReady( function()
{

  new Ext.Panel(
  {
    renderTo: Ext.getBody(),
    title: 'Panel 1',
    width: 500,
    height: 200,
    style: 'margin: 10px;',
    plugins: new Common.ui.plugins.panel.HeaderActions(
    {
      items:
      [
        new Ext.Container(
        {
          autoEl: 'a',
          html: 'Link 1'
        }),
        '-',
        new Ext.Button(
        {
          text: 'Button 2'
        })
      ]
    })
  });


  new Ext.Panel(
  {
    renderTo: Ext.getBody(),
    title: 'Panel 2',
    width: 500,
    height: 200,
    style: 'margin: 10px;',
    collapsible: true,
    tools:
    [
      {
        id: 'gear'
      }
    ],
    plugins: new Common.ui.plugins.panel.HeaderActions(
    {
      items:
      [
        new Ext.Button(
        {
          text: 'Button 1'
        }),
        '-',
        new Ext.Button(
        {
          text: 'Button 2'
        })
      ]
    })
  });

});
