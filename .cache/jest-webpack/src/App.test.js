module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/App.test.js":
/*!*************************!*\
  !*** ./src/App.test.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _djs_module = __webpack_require__(/*! ./djs_module.js */ 1);

var _leaflet = __webpack_require__(/*! leaflet */ "undefined?011d");

var _leaflet2 = _interopRequireDefault(_leaflet);

var _firebase = __webpack_require__(/*! firebase */ "undefined?6a4a");

var _firebase2 = _interopRequireDefault(_firebase);

__webpack_require__(/*! leaflet-offline */ "undefined?6f5c");

var _localforage = __webpack_require__(/*! localforage */ "undefined?ba33");

var _localforage2 = _interopRequireDefault(_localforage);

var _leafletKnn = __webpack_require__(/*! leaflet-knn */ "undefined?1515");

var _leafletKnn2 = _interopRequireDefault(_leafletKnn);

var _offlineTilesModule = __webpack_require__(/*! ./offline-tiles-module.js */ 2);

var _User = __webpack_require__(/*! ./User.js */ 3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

__webpack_require__(/*! ./L.Control.Sidebar */ 4);
__webpack_require__(/*! ./L.Control.Locate.min */ 5);

//import { User } from "./User.js";
//import { myOb } from "./app.js";

// const myNameSet = ['Jimmy', 'Scott', 'scott', 'Courtney','Steve']
var properties = {};
properties.user = "vavYsTGAwWZJBP47NFx2kOz2wI13";
properties.photo = "1234567.jpg";
properties.type = "hazard";
properties.timeStamp = "Tue Dec 11 2018 11:23:20 GMT+0000 (Greenwich Mean Time)";
properties.comment = "my comment..";

var geometry = {};
geometry.coordinates = [-0.4523214453133929, 51.441147766557826];
geometry.type = "Point";

var returnedSnapshot = {
  "-LTRbmKmXd2SyY3Krztd": {
    geometry: [-0.4447214453133929, 51.443147766557826],
    properties: {
      comment: "my comment",
      photo: "",
      type: "hazard",
      user: "vavYsTGAwWZJBP47NFx2kOz2wI13"
    },
    type: "Point"
  },
  "-LTSWoYhIMh5lhywndaH": {
    geometry: {
      coordinates: [-0.4523214453133929, 51.441147766557826],
      type: "Point"
    },
    properties: {
      comment: "my comment2",
      photo: "12456.jpg",
      type: "hazard",
      user: "vavYsTGAwWZJBP47NFx2kOz2wI13"
    },
    type: "Feature"
  },
  "-LTSXx31Jo3smHf85_fY": {
    geometry: {
      coordinates: [-0.4435214453133929, 51.442147766557826],
      type: "Point"
    },
    properties: {
      comment: "my comment3",
      photo: "12457.jpg",
      type: "hazard",
      user: "vavYsTGAwWZJBP47NFx2kOz2wI13"
    },
    type: "Feature"
  }
};

var refGeosonArr = [{
  geometry: {
    coordinates: [-0.4447214453133929, 51.443147766557826],
    type: "Point"
  },
  properties: {
    comment: "my comment3",
    photo: "12457.jpg",
    type: "hazard",
    user: "vavYsTGAwWZJBP47NFx2kOz2wI13"
  },
  type: "Feature"
}, {
  geometry: {
    coordinates: [-0.4523214453133929, 51.441147766557826],
    type: "Point"
  },
  properties: {
    comment: "my comment2",
    photo: "12456.jpg",
    type: "hazard",
    user: "vavYsTGAwWZJBP47NFx2kOz2wI13"
  },
  type: "Feature"
}, {
  geometry: {
    coordinates: [-0.4435214453133929, 51.442147766557826],
    type: "Point"
  },
  properties: {
    comment: "my comment3",
    photo: "12457.jpg",
    type: "hazard",
    user: "vavYsTGAwWZJBP47NFx2kOz2wI13"
  },
  type: "Feature"
}];

var refGeosonOb = {
  type: "Feature",
  geometry: geometry,
  properties: properties
};

describe("Create GeoJson Feature string", function () {
  //const featureOb = { lat: "hellox!" };

  var options = {
    type: "hazard", // point/ Marker type
    lng: -0.4523214453133929,
    lat: 51.441147766557826,
    user: "vavYsTGAwWZJBP47NFx2kOz2wI13",
    timeStamp: "Tue Dec 11 2018 11:23:20 GMT+0000 (Greenwich Mean Time)",
    photo: "1234567.jpg",
    comment: "my comment.."
  };

  it("should output ob", function () {
    expect((0, _djs_module.generateNewPointGeoJson)(options)).toEqual(refGeosonOb);
  });

  //console.log("jsonStr:", jsonStr);
});

describe("Read Markers json from FB into featuresJSon array", function () {
  //const featureOb = { lat: "hellox!" };

  it("should output ob", function () {
    expect((0, _djs_module.markersFromSnapshot)(returnedSnapshot)).toEqual(refGeosonArr);
  });
});
/*
describe("hello from djsmod", () => {
  it("should output hello", () => {
    expect(djsModmyFunc.hello()).toBe("hello");
  });
});
*/

/*
describe("user functions", () => {
  it("should output hello", () => {
    expect(User.testFunc()).toBe("hello");
  });
});
*/

/*
describe("hello from App", () => {
  it("should output hello", () => {
    expect(myOb.hello()).toBe("hello");
  });
});
*/

/***/ }),

/***/ 0:
/*!*****************************************!*\
  !*** entry reference ./src/App.test.js ***!
  \*****************************************/
/*! no exports provided */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  "70107bc450b2c638789a9ba91c3177dc7672a414": function() {return __webpack_require__('./src/App.test.js');}
};
module.exports["70107bc450b2c638789a9ba91c3177dc7672a414"]();


/***/ }),

/***/ 1:
/*!******************************************************************************!*\
  !*** reference ./src/djs_module.js.805373aab5a74bf01d95efbe3f7b43a0aaec14bc ***!
  \******************************************************************************/
/*! no exports provided */
/***/ (function(module, exports) {

module.exports = require("./djs_module.js")["805373aab5a74bf01d95efbe3f7b43a0aaec14bc"]();

/***/ }),

/***/ 2:
/*!****************************************************************************************!*\
  !*** reference ./src/offline-tiles-module.js.c9556a61702fbebc1cf7b7b56dce0003b86db2ca ***!
  \****************************************************************************************/
/*! no exports provided */
/***/ (function(module, exports) {

module.exports = require("./offline-tiles-module.js")["c9556a61702fbebc1cf7b7b56dce0003b86db2ca"]();

/***/ }),

/***/ 3:
/*!************************************************************************!*\
  !*** reference ./src/User.js.b37579f7874130d3946c04714c5a580528923075 ***!
  \************************************************************************/
/*! no exports provided */
/***/ (function(module, exports) {

module.exports = require("./User.js")["b37579f7874130d3946c04714c5a580528923075"]();

/***/ }),

/***/ 4:
/*!*************************************************************************************!*\
  !*** reference ./src/L.Control.Sidebar.js.ad90e3e33515ebfb105d07f03c8f156cf6374fd6 ***!
  \*************************************************************************************/
/*! no exports provided */
/***/ (function(module, exports) {

module.exports = require("./L.Control.Sidebar.js")["ad90e3e33515ebfb105d07f03c8f156cf6374fd6"]();

/***/ }),

/***/ 5:
/*!****************************************************************************************!*\
  !*** reference ./src/L.Control.Locate.min.js.a68553b1975f24b8d8c582e6799ec92b6446756d ***!
  \****************************************************************************************/
/*! no exports provided */
/***/ (function(module, exports) {

module.exports = require("./L.Control.Locate.min.js")["a68553b1975f24b8d8c582e6799ec92b6446756d"]();

/***/ }),

/***/ "undefined?011d":
/*!**************************************************************************!*\
  !*** external "..\\..\\..\\node_modules\\leaflet\\dist\\leaflet-src.js" ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("..\\..\\..\\node_modules\\leaflet\\dist\\leaflet-src.js");

/***/ }),

/***/ "undefined?1515":
/*!******************************************************************!*\
  !*** external "..\\..\\..\\node_modules\\leaflet-knn\\index.js" ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("..\\..\\..\\node_modules\\leaflet-knn\\index.js");

/***/ }),

/***/ "undefined?6a4a":
/*!*************************************************************************!*\
  !*** external "..\\..\\..\\node_modules\\firebase\\dist\\index.cjs.js" ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("..\\..\\..\\node_modules\\firebase\\dist\\index.cjs.js");

/***/ }),

/***/ "undefined?6f5c":
/*!*************************************************************************************!*\
  !*** external "..\\..\\..\\node_modules\\leaflet-offline\\src\\leaflet-offline.js" ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("..\\..\\..\\node_modules\\leaflet-offline\\src\\leaflet-offline.js");

/***/ }),

/***/ "undefined?ba33":
/*!******************************************************************************!*\
  !*** external "..\\..\\..\\node_modules\\localforage\\dist\\localforage.js" ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("..\\..\\..\\node_modules\\localforage\\dist\\localforage.js");

/***/ })

/******/ });
//# sourceMappingURL=App.test.js.map