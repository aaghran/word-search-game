"use strict";
/**
 * Returns a random integer between min and max
 *
 * @param {Number} min
 * @param {Number} max
 * @return {Number}
 */
if (typeof Math.rangeInt !== "function") {
    Math.rangeInt = function (min, max) {
        if (max === undefined) {
            max = min;
            min = 0;
        }
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
}

if (typeof Array.toUpperCase !== "function") {
    Array.toUpperCase = function () {
        for(var i = 0; i < this.length; i ++)
            this[i] = this[i].toUpperCase();
    };
}


/**
 * Merge two objects
 *
 * @param {Object} o1 Object 1
 * @param {Object} o2 Object 2
 * @return {Object}
 */
if (typeof Object.merge !== "function") {
    Object.merge = function (json1, json2) {
        json1 = json1 || {};
        json2 = json2 || {};
        var result = {};
        for (var key in json1) {
            result[key] = json1[key];
        }
        for (var key in json2) {
            result[key] = json2[key];
        }
        return result;
    };
}


// jQuery publish subscribe
var jq = $({});
$.each({
    trigger: "publish",
    on: "subscribe",
    off: "unsubscribe"
}, function (key, val) {
    $[val] = function () {
        jq[key].apply(jq, arguments);
    };
});