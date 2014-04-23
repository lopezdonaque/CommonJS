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
 * France (France) translation
 * By Thylia
 * 09-11-2007, 02:22 PM
 * updated by disizben (22 Sep 2008)
 * updated by Thylia (20 Apr 2010)
 */
CommonExt.onReady(function() {

    if (CommonExt.Date) {
        CommonExt.Date.shortMonthNames = ["Janv", "Févr", "Mars", "Avr", "Mai", "Juin", "Juil", "Août", "Sept", "Oct", "Nov", "Déc"];

        CommonExt.Date.getShortMonthName = function(month) {
            return CommonExt.Date.shortMonthNames[month];
        };

        CommonExt.Date.monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

        CommonExt.Date.monthNumbers = {
            "Janvier": 0,
            "Janv": 0,
            "Février": 1,
            "Févr": 1,
            "Mars": 2,
            "Avril": 3,
            "Avr": 3,
            "Mai": 4,
            "Juin": 5,
            "Juillet": 6,
            "Juil": 6,
            "Août": 7,
            "Septembre": 8,
            "Sept": 8,
            "Octobre": 9,
            "Oct": 9,
            "Novembre": 10,
            "Nov": 10,
            "Décembre": 11,
            "Déc": 11
        };

        CommonExt.Date.getMonthNumber = function(name) {
            return CommonExt.Date.monthNumbers[CommonExt.util.Format.capitalize(name)];
        };

        CommonExt.Date.dayNames = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

        CommonExt.Date.getShortDayName = function(day) {
            return CommonExt.Date.dayNames[day].substring(0, 3);
        };

        CommonExt.Date.parseCodes.S.s = "(?:er)";

        CommonExt.Date.getSuffix = function() {
            return (this.getDate() == 1) ? "er" : "";
        };
    }

    if (CommonExt.util && CommonExt.util.Format) {
        CommonExt.apply(CommonExt.util.Format, {
            thousandSeparator: '.',
            decimalSeparator: ',',
            currencySign: '\u20ac',
            // French Euro
            dateFormat: 'd/m/Y'
        });
    }
});
