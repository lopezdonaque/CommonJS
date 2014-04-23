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
 * Italian translation
 * 28 Maggio 2012   updated by Fabio De Paolis (many changes, update to 4.1.0)
 * 21 Dicembre 2007 updated by Federico Grilli
 * 04 Ottobre 2007  updated by eric_void
 */
CommonExt.onReady(function() {

    if (CommonExt.Date) {
        CommonExt.Date.monthNames = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];

        CommonExt.Date.getShortMonthName = function(month) {
            return CommonExt.Date.monthNames[month].substring(0, 3);
        };

        CommonExt.Date.monthNumbers = {
            Gen: 0,
            Feb: 1,
            Mar: 2,
            Apr: 3,
            Mag: 4,
            Giu: 5,
            Lug: 6,
            Ago: 7,
            Set: 8,
            Ott: 9,
            Nov: 10,
            Dic: 11
        };

        CommonExt.Date.getMonthNumber = function(name) {
            return CommonExt.Date.monthNumbers[name.substring(0, 1).toUpperCase() + name.substring(1, 3).toLowerCase()];
        };

        CommonExt.Date.dayNames = ["Domenica", "Lunedi", "Martedi", "Mercoledi", "Giovedi", "Venerdi", "Sabato"];

        CommonExt.Date.getShortDayName = function(day) {
            return CommonExt.Date.dayNames[day].substring(0, 3);
        };
    }

    if (CommonExt.util && CommonExt.util.Format) {
        CommonExt.apply(CommonExt.util.Format, {
            thousandSeparator: '.',
            decimalSeparator: ',',
            currencySign: '\u20ac',  // Euro
            dateFormat: 'd/m/Y'
        });
    }
});
