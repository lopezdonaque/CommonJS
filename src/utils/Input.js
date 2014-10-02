
/**
 * Input utility methods
 *
 */
CommonExt.define( 'Common.utils.Input',
{
  singleton: true,


  /**
   * Inserts text at current field cursor position
   *
   * @param {HTMLElement} el
   * @param {String} text
   */
  insertAtCursor: function( el, text )
  {
    if( document.selection ) // IE
    {
      el.focus();
      var sel = document.selection.createRange();
      sel.text = text;
    }
    else if( el.selectionStart || el.selectionStart == '0' )
    {
      el.focus();
      var startPos = el.selectionStart;
      var endPos = el.selectionEnd;
      el.value = el.value.substring( 0, startPos ) + text + el.value.substring( endPos, el.value.length );
      el.setSelectionRange( endPos + text.length, endPos + text.length );
    }
    else
    {
      el.value += text;
    }
  },



  /**
   * Sets the cursor position
   *
   * @param {HTMLElement} el
   * @param {Number} pos
   */
  setCursorTo: function( el, pos )
  {
    if( el.createTextRange )
    {
      var range = el.createTextRange();
      range.move( 'character', pos );
      range.select();
    }
    else if( el.selectionStart )
    {
      el.focus();
      el.setSelectionRange( pos, pos );
    }
  },



  /**
   * Returns the cursor position
   *
   * @param {*} el
   * @returns {Number}
   */
  getCursorPosition: function( el )
  {
    var rng, pos = -1;

    if( typeof el.selectionStart == 'number' )
    {
      pos = el.selectionStart;
    }
    else if( document.selection && el.createTextRange )
    {
      rng = document.selection.createRange();
      rng.collapse( true );
      rng.moveStart( 'character', -el.value.length );
      pos = rng.text.length;
    }

    return pos;
  }

});
