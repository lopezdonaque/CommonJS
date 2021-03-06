
/**
 * German locale
 *
 */
CommonExt.define( 'Common.locale',
{
  singleton: true,

  Date:
  {
    startDay: 1,
    patterns:
    {
      ShortDate: 'd.m.Y',
      ShortTime: 'H:i',
      LongTime: 'H:i:s',
      ShortDateTime: 'd.m.Y H:i',
      LongDateTime: 'd.m.Y H:i:s',
      VeryShortDate: 'd M',
      FullDateTime: "l, d F Y, H:i:s"
    }
  }

});
