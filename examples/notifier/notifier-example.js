
window.language_resources =
{

};

Ext.onReady( function()
{

  new Ext.Panel(
  {
    renderTo: Ext.getBody(),
    style: 'margin: 10;',
    padding: 10,
    title: 'Gritter examples',
    defaults:
    {
      style: 'margin: 10px 0;'
    },
    items:
    [
      new Ext.Button(
      {
        text: 'Show success',
        handler: function()
        {
          Common.notifier.Gritter.add(
          {
            title: 'Some title',
            text: 'Some text',
            image: 'common-gritter-success'
          });
        }
      }),
      new Ext.Button(
      {
        text: 'Show error (sticky)',
        handler: function()
        {
          Common.notifier.Gritter.add(
          {
            title: 'Some title',
            text: 'Some text',
            sticky: true,
            image: 'common-gritter-error'
          });
        }
      }),
      new Ext.Button(
      {
        text: 'Show info (unique)',
        handler: function()
        {
          Common.notifier.Gritter.add(
          {
            unique_id: 'info',
            title: 'Some title',
            text: 'Some text',
            image: 'common-gritter-info'
          });
        }
      }),
      new Ext.Button(
      {
        text: 'Show custom image',
        handler: function()
        {
          Common.notifier.Gritter.add(
          {
            title: 'Some title',
            text: 'Some text',
            image: 'http://www.case.edu/visit/images/home-icon_white_64.png'
          });
        }
      })
    ]
  });

});
