/*
This file is part of CommonExt JS 4.2

Copyright (c) 2011-2013 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as
published by the Free Software Foundation and appearing in the file LICENSE included in the
packaging of this file.

Please review the following information to ensure the GNU General Public License version 3.0
requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department
at http://www.sencha.com/contact.

Build date: 2013-05-16 14:36:50 (f9be68accb407158ba2b1be2c226a6ce1f649314)
*/
/**
 * German translation
 * 2007-Apr-07 update by schmidetzki and humpdi
 * 2007-Oct-31 update by wm003
 * 2009-Jul-10 update by Patrick Matsumura and Rupert Quaderer
 * 2010-Mar-10 update by Volker Grabsch
 */
CommonExt.onReady(function() {

    if (CommonExt.Date) {
        CommonExt.Date.monthNames = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

        CommonExt.Date.defaultFormat = 'd.m.Y';

        CommonExt.Date.getShortMonthName = function(month) {
            return CommonExt.Date.monthNames[month].substring(0, 3);
        };

        CommonExt.Date.monthNumbers = {
            Jan: 0,
            Feb: 1,
            "M\u00e4r": 2,
            Apr: 3,
            Mai: 4,
            Jun: 5,
            Jul: 6,
            Aug: 7,
            Sep: 8,
            Okt: 9,
            Nov: 10,
            Dez: 11
        };

        CommonExt.Date.getMonthNumber = function(name) {
            return CommonExt.Date.monthNumbers[name.substring(0, 1).toUpperCase() + name.substring(1, 3).toLowerCase()];
        };

        CommonExt.Date.dayNames = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];

        CommonExt.Date.getShortDayName = function(day) {
            return CommonExt.Date.dayNames[day].substring(0, 3);
        };
    }

    if (CommonExt.util && CommonExt.util.Format) {
        CommonExt.util.Format.__number = CommonExt.util.Format.number;
        CommonExt.util.Format.number = function(v, format) {
            return CommonExt.util.Format.__number(v, format || "0.000,00/i");
        };

        CommonExt.apply(CommonExt.util.Format, {
            thousandSeparator: '.',
            decimalSeparator: ',',
            currencySign: '\u20ac',
            // German Euro
            dateFormat: 'd.m.Y'
        });
    }
});
