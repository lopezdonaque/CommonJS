
Ext.onReady( function()
{
  new Ext.Panel(
  {
    renderTo: Ext.getBody(),
    style: 'margin: 10;',
    title: 'Wizard Bar',
    items: new Common.ui.wizard.WizardBar(
    {
      steps:
      [
        {
          title: 'Step 1'
        },
        {
          title: 'Step 2'
        }
      ]
    })
  });


  new Ext.Panel(
  {
    renderTo: Ext.getBody(),
    style: 'margin: 10;',
    title: 'Wizard Bar - Step 2 selected',
    items: new Common.ui.wizard.WizardBar(
    {
      selected_step: 1,
      steps:
      [
        {
          title: 'Step 1',
          activated: true
        },
        {
          title: 'Step 2'
        }
      ]
    })
  });


  new Ext.Panel(
  {
    renderTo: Ext.getBody(),
    style: 'margin: 10;',
    title: 'Wizard Bar - Step 2 activated',
    items: new Common.ui.wizard.WizardBar(
    {
      steps:
      [
        {
          title: 'Step 1'
        },
        {
          title: 'Step 2',
          activated: true
        }
      ]
    })
  });


  Ext.define( 'Wizard',
  {
    extend: 'Ext.Panel',
    title: 'Wizard',
    person: {},
    initComponent: function()
    {
      this._wizard_bar = new Common.ui.wizard.WizardBar(
      {
        steps:
        [
          {
            title: 'Step 1'
          },
          {
            title: 'Step 2'
          }
        ]
      });

      this._wizard_bar.on( 'activestepclick', function( index )
      {
        this._navigate_to( this[ '_get_step' + ++index ]() );
      }, this );

      this.items =
      [
        this._wizard_bar,
        this._get_step1()
      ];

      this.callParent( arguments );
    },

    _navigate_to: function( obj )
    {
      this.get(1).destroy();
      this.add( obj );
      this.doLayout();
    },

    _get_step1: function()
    {
      this._wizard_bar.set_active_step(0);

      return new Ext.FormPanel(
      {
        monitorValid: true,
        autoHeight: true,
        title: 'Form 1',
        items:
        [
          new Ext.form.TextField(
          {
            id: 'name',
            fieldLabel: 'Name',
            allowBlank: false,
            width: 300,
            value: this.person.name
          })
        ],
        buttons:
        [
          new Ext.Button(
          {
            text: 'Next',
            formBind: true,
            scope: this,
            handler: function()
            {
              this.person.name = Ext.getCmp( 'name' ).getValue();
              this._navigate_to( this._get_step2() );
            }
          })
        ]
      });
    },

    _get_step2: function()
    {
      this._wizard_bar.set_active_step( 1 );

      return new Ext.FormPanel(
      {
        monitorValid: true,
        autoHeight: true,
        title: 'Form 2',
        wizard_options:
        {
          title: 'Form 2 step'
        },
        items:
        [
          new Ext.form.TextField(
          {
            id: 'surname',
            fieldLabel: 'Surname',
            allowBlank: false,
            width: 300,
            value: this.person.surname
          })
        ],
        buttons:
        [
          new Ext.Button(
          {
            text: 'Back',
            scope: this,
            handler: function()
            {
              this._navigate_to( this._get_step1() );
            }
          }),
          new Ext.Button(
          {
            text: 'Finish',
            formBind: true,
            scope: this,
            handler: function()
            {
              this.person.surname = Ext.getCmp( 'surname' ).getValue();
              alert( CommonExt.encode( this.person ) );
            }
          })
        ]
      });
    }

  });

  new Wizard(
  {
    renderTo: Ext.getBody(),
    style: 'margin: 10;'
  });


  /*new Common.ui.wizard.WizardPanel(
  {
    renderTo: Ext.getBody(),
    style: 'margin: 10;',
    title: 'Wizard Panel',
    id: 'wizard_panel',
    person: {},
    steps:
    [
      new Ext.FormPanel(
      {
        monitorValid: true,
        autoHeight: true,
        title: 'Form 1',
        wizard_options:
        {
          title: 'Form 1 step'
        },
        items:
        [
          new Ext.form.TextField(
          {
            id: 'name',
            fieldLabel: 'Name',
            allowBlank: false,
            width: 300
          })
        ],
        buttons:
        [
          new Ext.Button(
          {
            text: 'Next',
            formBind: true,
            scope: this,
            handler: function()
            {
              Ext.getCmp( 'wizard_panel' ).person.name = Ext.getCmp( 'name' ).getValue();
              Ext.getCmp( 'wizard_panel' ).set_active_step(1);
            }
          })
        ]
      }),
      new Ext.FormPanel(
      {
        monitorValid: true,
        autoHeight: true,
        title: 'Form 2',
        wizard_options:
        {
          title: 'Form 2 step'
        },
        items:
        [
          new Ext.form.TextField(
          {
            id: 'surname',
            fieldLabel: 'Surname',
            allowBlank: false,
            width: 300
          })
        ],
        buttons:
        [
          new Ext.Button(
          {
            text: 'Back',
            scope: this,
            handler: function()
            {
              Ext.getCmp( 'wizard_panel' ).set_active_step(0);
            }
          }),
          new Ext.Button(
          {
            text: 'Finish',
            formBind: true,
            scope: this,
            handler: function()
            {
              Ext.getCmp( 'wizard_panel' ).person.surname = Ext.getCmp( 'surname' ).getValue();
              alert( CommonExt.encode( Ext.getCmp( 'wizard_panel' ).person ) );
            }
          })
        ]
      })
    ]
  });*/

});
