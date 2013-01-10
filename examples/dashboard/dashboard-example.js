
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


  var HomePanel = Ext.extend( Ext.ux.Portal,
  {
    border: false,
    initComponent: function()
    {
      this.items =
      [
        // Left column
        new Ext.ux.PortalColumn(
        {
          columnWidth: 0.5,
          border: false,
          style: 'padding: 10px 0 0 10px', // At least, 1px for each side (t-r,t-l,b-r,b-l) to be a droppable when empty items
          items:
          [
            new Ext.ux.Portlet(
            {
              title: 'Portlet 1'
            })
          ]
        }),

        // Right column
        new Ext.ux.PortalColumn(
        {
          columnWidth: 0.5,
          border: false,
          style:'padding: 10px 10px 0 15px', // At least, 1px for each side (t-r,t-l,b-r,b-l) to be a droppable when empty items
          items:
          [
            new Ext.ux.Portlet(
            {
              title: 'Portlet 2'
            }),
            new Ext.ux.Portlet(
            {
              title: 'Portlet 3'
            })
          ]
        })
      ];

      HomePanel.superclass.initComponent.apply( this, arguments );
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
    top:
    {
      items: tbar
    },
    bottom:
    {
      items: bbar
    }
  });

  window.dashboard.start();

  Common.ui.dashboard.Navigation.go_to( 'home', HomePanel, {} );
});
