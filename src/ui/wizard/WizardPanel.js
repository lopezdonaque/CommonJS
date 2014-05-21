
/**
 * Wizard Panel
 *
 */
Ext.define( 'Common.ui.wizard.WizardPanel',
{
  extend: 'Ext.Panel',


  /**
   * Init component
   *
   * @private
   */
  initComponent: function()
  {
    this.items =
    [
      this._get_wizard_bar(),
      this._get_steps_container()
    ];

    this.callParent( arguments );
  },



  /**
   * Returns the wizard bar
   *
   * @return {Common.ui.wizard.WizardBar}
   * @private
   */
  _get_wizard_bar: function()
  {
    this._wizard_bar = new Common.ui.wizard.WizardBar(
    {
      steps: CommonExt.Array.map( this.steps, function( step )
      {
        return {
          title: step.wizard_options.title
        };
      })
    });

    this._wizard_bar.on( 'activestepclick', function( index )
    {
      this.set_active_step( index );
    }, this );

    return this._wizard_bar;
  },



  /**
   * Returns the steps container
   *
   * @private
   */
  _get_steps_container: function()
  {
    /*this._steps_container = new Ext.Container(
    {
      layout: 'card',
      activeItem: 0,
      items: CommonExt.Array.map( this.steps, function( step )
      {
        step.wizard = this; // Added a reference to wizard component to share some Model object
        return step;
      }, this )
    });*/



    // Added a reference to wizard component to share some Model object
    CommonExt.Array.each( this.steps, function( step ){ step.wizard = this; }, this );


    this._steps_container = new Ext.Container(
    {
      items: this.steps[0]
    });

    return this._steps_container;
  },



  /**
   * Sets the active step
   *
   * @param {Number} index
   */
  set_active_step: function( index )
  {
    if( this.fireEvent( 'beforechangestep', index ) === false )
    {
      return;
    }

    this._wizard_bar.set_active_step( index );


    //this._steps_container.getLayout().setActiveItem( index );
    this._steps_container.removeAll();
    this._steps_container.add( this.steps[ index ] );


    this.fireEvent( 'changestep', index );
  }

});
