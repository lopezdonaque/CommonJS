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
 * Catalonian Translation by halkon_polako 6-12-2007
 * December correction halkon_polako 11-12-2007
 *
 * Synchronized with 2.2 version of CommonExt-lang-en.js (provided by Condor 8 aug 2008)
 *     by halkon_polako 14-aug-2008
 */
CommonExt.onReady(function() {

    if (CommonExt.Date) {
        CommonExt.Date.monthNames = ["Gener", "Febrer", "Mar&#231;", "Abril", "Maig", "Juny", "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre"];

        CommonExt.Date.getShortMonthName = function(month) {
            return CommonExt.Date.monthNames[month].substring(0, 3);
        };

        CommonExt.Date.monthNumbers = {
            Gen: 0,
            Feb: 1,
            Mar: 2,
            Abr: 3,
            Mai: 4,
            Jun: 5,
            Jul: 6,
            Ago: 7,
            Set: 8,
            Oct: 9,
            Nov: 10,
            Dec: 11
        };

        CommonExt.Date.getMonthNumber = function(name) {
            return CommonExt.Date.monthNumbers[name.substring(0, 1).toUpperCase() + name.substring(1, 3).toLowerCase()];
        };

        CommonExt.Date.dayNames = ["Diumenge", "Dilluns", "Dimarts", "Dimecres", "Dijous", "Divendres", "Dissabte"];

        CommonExt.Date.getShortDayName = function(day) {
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
