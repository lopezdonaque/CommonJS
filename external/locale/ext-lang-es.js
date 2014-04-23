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
 * Spanish/Latin American Translation by genius551v 04-08-2007
 * Revised by efege, 2007-04-15.
 * Revised by Rafaga2k 10-01-2007 (mm/dd/yyyy)
 * Revised by FeDe 12-13-2007 (mm/dd/yyyy)
 * Synchronized with 2.2 version of CommonExt-lang-en.js (provided by Condor 8 aug 2008)
 *     by halkon_polako 14-aug-2008
 */
CommonExt.onReady(function() {

    if (CommonExt.Date) {
        CommonExt.Date.monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

        CommonExt.Date.getShortMonthName = function(month) {
            return CommonExt.Date.monthNames[month].substring(0, 3);
        };

        CommonExt.Date.monthNumbers = {
            Ene: 0,
            Feb: 1,
            Mar: 2,
            Abr: 3,
            May: 4,
            Jun: 5,
            Jul: 6,
            Ago: 7,
            Sep: 8,
            Oct: 9,
            Nov: 10,
            Dic: 11
        };

        CommonExt.Date.getMonthNumber = function(name) {
            return CommonExt.Date.monthNumbers[name.substring(0, 1).toUpperCase() + name.substring(1, 3).toLowerCase()];
        };

        CommonExt.Date.dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

        CommonExt.Date.getShortDayName = function(day) {
            if (day == 3) return "Mié";
            if (day == 6) return "Sáb";
            return CommonExt.Date.dayNames[day].substring(0, 3);
        };

        CommonExt.Date.parseCodes.S.s = "(?:st|nd|rd|th)";
    }

    if (CommonExt.util && CommonExt.util.Format) {
        CommonExt.apply(CommonExt.util.Format, {
            thousandSeparator: '.',
            decimalSeparator: ',',
            currencySign: '\u20ac',
            // Spanish Euro
            dateFormat: 'd/m/Y'
        });
    }
});
