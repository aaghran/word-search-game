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
        for (var i = 0; i < this.length; i++)
            this[i] = this[i].toUpperCase();
    };
}

if (typeof window.getCookie !== "function") {
    window.getCookie = function (cname) {
        var name = cname + "=";
        var ca = document.cookie.split(";");
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == " ") c = c.substring(1);
            if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
        }
        return "";
    };
}

if (typeof window.setCookie !== "function") {
    this.setCookie = function (cname, cvalue, exdays) {
        var d = new Date();
        exdays = parseFloat(exdays);
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires + ";path=/";
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


// function onInitFs(fs) {
//
//     fs.root.getFile("file:///home/aaghran/test.json", {}, function(fileEntry) {
//
//         // Get a File object representing the file,
//         // then use FileReader to read its contents.
//         fileEntry.file(function(file) {
//             var reader = new FileReader();
//
//             reader.onloadend = function(e) {
//                 console.log(this.result);
//             };
//
//             reader.readAsText(file);
//         }, function(e){console.log(e)});
//
//     },  function(e){console.log(e)});
//
// }
//
// window.webkitRequestFileSystem(window.TEMPORARY, 1024*1024, onInitFs, function(e){console.log(e)});