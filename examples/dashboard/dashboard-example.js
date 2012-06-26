
window.language_resources =
{

};


Ext.onReady( function()
{
  var DataForm = Ext.extend( Ext.FormPanel,
  {
    initComponent: function()
    {
      this.items =
      [
        new Common.ui.Info(
        {
          title: 'Title',
          text: 'Description'
        }),

        new Ext.form.TextField(
        {
          fieldLabel: 'Field 1',
          allowBlank: false,
          width: 400,
          value: 'Some text as value'
        })
      ];

      DataForm.superclass.initComponent.apply( this, arguments );
    }

  });



  var tbar = new Ext.Toolbar(
  {
    items:
    [
      new Ext.Button(
      {
        text: 'Group 1',
        menu:
        [
          new Ext.menu.Item(
          {
            text: 'App 1',
            handler: function( btn )
            {
              Common.ui.dashboard.Navigation.go_to( 'app1', DataForm, {} );
            }
          })
        ]
      })
    ]
  });

  var bbar = new Ext.Toolbar(
  {
    items:
    [
      new Ext.Toolbar.TextItem(
      {
        text: '<a href="http://www.google.com" target="_blank">Google</a>'
      })
    ]
  });

  window.dashboard = new Common.ui.dashboard.Dashboard(
  {
    top_toolbar: tbar,
    bottom_toolbar: bbar
  });

  window.dashboard.start();
});
