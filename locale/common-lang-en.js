
/**
 * English locale
 *
 */
CommonExt.define( 'Common.locale',
{
  singleton: true,

  Date:
  {
    startDay: 0,
    patterns:
    {
      ShortDate: 'j/n/Y',
      ShortTime: 'g:i A',
      LongTime: 'g:i:s A',
      ShortDateTime: 'j/n/Y g:i A',
      LongDateTime: 'j/n/Y g:i:s A',
      VeryShortDate: 'd M',
      FullDateTime: "l, F d, Y g:i:s A"
    }
  }

});
