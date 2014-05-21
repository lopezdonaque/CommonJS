
/**
 * Wizard Bar
 *
 * Usage:
 *
 *     new Common.ui.wizard.WizardBar(
 *     {
 *       selected_step: 0,
 *       steps:
 *       [
 *         {
 *           title: 'Step 1'
 *         },
 *         {
 *           title: 'Step 2',
 *         }
 *       ]
 *     });
 *
 */
Ext.define( 'Common.ui.wizard.WizardBar',
{
  extend: 'Ext.Container',
  cls: 'common-wizard-bar',


  /**
   * @event stepclick
   */

  /**
   * @event activestepclick
   */


  /**
   * Selected step
   *
   * @property {Number}
   */
  selected_step: 0,


  /**
   * Steps
   *
   * @property {Array}
   */
  steps: [],



  /**
   * Inits component
   *
   * @private
   */
  initComponent: function()
  {
    this.items = CommonExt.Array.map( this.steps, function( step, index )
    {
      var cls = 'common-wizard-bar-step';

      if( step.activated === true )
      {
        cls += ' common-wizard-bar-step-activated';
      }

      if( this.selected_step == index )
      {
        step.activated = true;
        cls += ' common-wizard-bar-step-selected';
      }

      return new Ext.Container(
      {
        html: step.title,
        index: index,
        step: step,
        cls: cls,
        listeners:
        {
          scope: this,
          afterrender: function( cmp )
          {
            cmp.el.on( 'click', CommonExt.bind( function( cmp )
            {
              this.fireEvent( 'stepclick', cmp.index, cmp, this );

              if( cmp.step.activated && !cmp.step.selected )
              {
                this.fireEvent( 'activestepclick', cmp.index, cmp, this );
              }
            }, this, [ cmp ] ) );
          }
        }
      });
    }, this );

    this.callParent( arguments );
  },



  /**
   * Sets the active step
   *
   * @param {Number} index
   */
  set_active_step: function( index )
  {
    this.items.each( function( item, idx )
    {
      item.removeClass( 'common-wizard-bar-step-selected' );
      item.removeClass( 'common-wizard-bar-step-activated' );

      if( idx == index )
      {
        item.step.selected = true;
        item.step.activated = true;
        item.addClass( 'common-wizard-bar-step-selected' );
      }
      else
      {
        item.step.selected = false;

        if( item.step.activated )
        {
          item.addClass( 'common-wizard-bar-step-activated' );
        }
      }
    }, this );
  }

});
