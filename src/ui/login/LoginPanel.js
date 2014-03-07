
/**
 * Login Panel
 *
 */
Ext.define( 'Common.ui.login.LoginPanel',
{
  extend: 'Ext.Panel',
  cls: 'login',


  /**
   * Init component
   *
   * @private
   */
  initComponent: function()
  {
    this._logo = new Ext.Panel(
    {
      cls: 'login_header'
    });

    this._errors = new Ext.Panel(
    {
      cls: 'errors',
      hidden: true
    });

    this._createForm();

    this.items =
    [
      this._logo,
      this._errors,
      this._form
    ];

    this.on( 'afterrender', this._afterrender, this );
    this.callParent( arguments );
  },



  /**
   * Creates login form
   *
   * @private
   */
  _createForm: function()
  {
    this.login_input = new Ext.form.TextField(
    {
      fieldLabel: Common.Langs.get( 'user' )
    });

    this.password_input = new Ext.form.TextField(
    {
      inputType: 'password',
      fieldLabel: Common.Langs.get( 'password' )
    });

    this.remember_input = new Ext.form.Checkbox(
    {
      boxLabel: Common.Langs.get( 'do_not_close_session' )
    });

    this.remember_link = new Ext.BoxComponent(
    {
      cls: 'recover_pass',
      fieldLabel: ' ',
      labelSeparator: '',
      autoEl: { tag: 'a', cn: Common.Langs.get( 'remember_password' ) },
      listeners:
      {
        scope: this,
        render: function( cmp )
        {
          cmp.getEl().on( 'click', function()
          {
            this.fireEvent( 'remember' );
          }, this );
        }
      }
    });

    // Hidden submit is required to intercept onsubmit event
    this._hidden_submit = new Ext.form.Field(
    {
      inputType: 'submit',
      hidden: true
    });

    this.login_button = new Ext.Button(
    {
      text: Common.Langs.get( 'enter' ),
      formBind: true,
      scope: this,
      handler: function()
      {
        this._hidden_submit.el.dom.click();
      }
    });

    this._form = new Ext.FormPanel(
    {
      standardSubmit: true,
      items:
      [
        this.login_input,
        this.password_input,
        this.remember_input,
        this.remember_link,
        this._hidden_submit
      ],
      buttons:
      [
        this.login_button
      ],
      keys:
      [
        {
          key: [ Ext.EventObject.ENTER ],
          scope: this,
          handler: function()
          {
            this._submit();
          }
        }
      ]
    });
  },



  /**
   * Displays an error message
   *
   * @param {String} message
   */
  setError: function( message )
  {
    this._errors.show();
    this._errors.update( message );
  },



  /**
   * Clears error message
   *
   */
  clearError: function()
  {
    this._errors.hide();
  },



  /**
   * Submit
   *
   * @private
   */
  _submit: function()
  {
    var login = this.login_input.getValue();
    var password = this.password_input.getValue();
    var remember = this.remember_input.getValue();

    if( login == '' || password == '' )
    {
      return false;
    }

    this.fireEvent( 'login', login, password, remember );
    return false;
  },



  /**
   * After render event handler
   *
   * @private
   */
  _afterrender: function()
  {
    // Set autocomplete "on" to allow browser remember password
    this.login_input.el.set( { autocomplete: 'on' } );
    this.password_input.el.set( { autocomplete: 'on' } );

    this._form.getForm().el.dom.onsubmit = CommonExt.bind( this._submit, this );
  }

});
