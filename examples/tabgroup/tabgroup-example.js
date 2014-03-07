
Ext.onReady( function()
{
  var simpletab1 = new Ext.Panel(
  {
    title: 'Simple Tab 1',
    closable: true,
    html: 'simple tab 1 contents'
  });

  var simpletab2 = new Ext.Panel(
  {
    title: 'Simple Tab 2',
    html: 'simple tab 2 contents'
  });

  var subtab1 = new Ext.Container(
  {
    closable: true,
    subtab: new Common.ui.tabgroup.TabGroupButton(
    {
      text: 'Tab1'
    }),
    items: new Ext.Container( { html: 'aaa' } )
  });

  var subtab2 = new Ext.Container(
  {
    html: 'Tab2 contents',
    closable: true,
    subtab: new Common.ui.tabgroup.TabGroupButton(
    {
      iconCls: 'icontab',
      text: 'Tab2'
    })
  });

  var tabgroup = new Common.ui.tabgroup.TabGroupPanel(
  {
    closable: true,
    activeSubtab: 1,
    items: [ subtab1, subtab2 ]
  });

  var tabgroup_title = new Common.ui.tabgroup.TabGroupPanel(
  {
    closable: true,
    title: 'Tab title:',
    items:
    [
      new Ext.Container(
      {
        html: 'Tab contents',
        closable: true,
        subtab: new Common.ui.tabgroup.TabGroupButton(
        {
          text: 'Tab'
        })
      })
    ]
  });

  var tabgroup_title_and_icon = new Common.ui.tabgroup.TabGroupPanel(
  {
    closable: true,
    iconCls: 'icontab',
    title: 'Tab title:',
    items:
    [
      new Ext.Container(
      {
        html: 'Tab contents',
        closable: true,
        subtab: new Common.ui.tabgroup.TabGroupButton(
        {
          text: 'Tab'
        })
      })
    ]
  });

  var tabgroup_icon = new Common.ui.tabgroup.TabGroupPanel(
  {
    closable: true,
    iconCls: 'icontab',
    items:
    [
      new Ext.Container(
      {
        html: 'Tab contents',
        closable: true,
        subtab: new Common.ui.tabgroup.TabGroupButton(
        {
          text: 'Tab'
        })
      })
    ]
  });

  new Ext.Panel(
  {
    renderTo: Ext.getBody(),
    tbar: new Ext.Toolbar(
    {
      items:
      [
        new Ext.Button(
        {
          text: 'Add subtab',
          handler: function()
          {
            var id = CommonExt.Date.now();
            var subtab = new Ext.Container(
            {
              html: 'Tab contents ' + id,
              subtab: new Common.ui.tabgroup.TabGroupButton(
              {
                text: 'Tab ' + id
              })
            });

            tabgroup.add( subtab );
          }
        }),
        '-',
        new Ext.Button(
        {
          text: 'Add subtab closable',
          handler: function()
          {
            var id = CommonExt.Date.now();
            var subtab = new Ext.Container(
            {
              html: 'Tab contents ' + id,
              closable: true,
              subtab: new Common.ui.tabgroup.TabGroupButton(
              {
                text: 'Tab ' + id
              })
            });

            tabgroup.add( subtab );
          }
        })
      ]
    }),
    items:
    [
      new Ext.TabPanel(
      {
        deferredRender: false,
        enableTabScroll: true,
        activeTab: 0,
        items:
        [
          simpletab1,
          simpletab2,
          tabgroup,
          tabgroup_title,
          tabgroup_title_and_icon,
          tabgroup_icon
        ]
      })
    ]
  });

});
