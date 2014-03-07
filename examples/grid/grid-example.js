
window.language_resources =
{

};

Ext.onReady( function()
{

  var grid = new Common.ui.Grid(
  {
    width: 500,
    autoHeight: true,
    autoExpandColumn: 'column_surname',
    auto_load: false,
    page_sizer: false,
    store: new Ext.data.JsonStore(
    {
      //root: 'data',
      idProperty: 'name',
      fields: [ 'name', 'surname' ],
      data:
      [
        { name: 'Bart', surname: 'Simpson' },
        { name: 'Seymour', surname: 'Skinner' },
        { name: 'Apu', surname: 'Nahasapeemapetilon' }
      ]
    }),
    _get_columns: function()
    {
      return [
        {
          id: 'column_name',
          header: 'Name',
          dataIndex: 'name'
        },
        {
          id: 'column_surname',
          header: 'Surname',
          dataIndex: 'surname'
        }
      ];
    },
    submenu: new Ext.menu.Menu(
    {
      items:
      [
        new Ext.menu.Item(
        {
          text: 'Option 1'
        })
      ]
    })
  });

  new Ext.Panel(
  {
    renderTo: Ext.getBody(),
    items: [ grid ]
  });

});
