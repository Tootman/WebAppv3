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

/***/ "./node_modules/babel-loader/lib/index.js?!./src/djs_module.js":
/*!*******************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4!./src/djs_module.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/*
export const otherMod = {
  //console.log("myFunc in djsMod!")
  goodbye: () => {
    console.log("bye from djs mod!");
    return "godbye";
    //alert("hello from djs mod!");
  }
};
*/

/*
export const djsModmyFunc = {
  //console.log("myFunc in djsMod!")
  hello: () => {
    console.log("hello from djs mod!");
    return "hello";
    //alert("hello from djs mod!");
  }
};
*/
var pushNewPointToFirebase = exports.pushNewPointToFirebase = function pushNewPointToFirebase(_ref) {
  var mapID = _ref.mapID,
      Json = _ref.Json;

  var fbDatabase = firebase.database();
  var refPath = "App/Maps/" + mapID + "/Markers/";
  // need to test if /Markers exists though
  //fbDatabase.ref(refPath).push(Json)) //
};
var markersFromSnapshot = exports.markersFromSnapshot = function markersFromSnapshot(_ref2) {
  var snapshot = _ref2.snapshot;

  var geojsonMarkers = Object.keys(snapshot).map(function (featureKey) {
    return {
      coordinates: snapshot[featureKey].coordinates,
      type: snapshot[featureKey].type,
      propertires: snapshot[featureKey].properties
    };
  });

  return geojsonMarkers;
};

var generateNewPointGeoJson = exports.generateNewPointGeoJson = function generateNewPointGeoJson(_ref3) {
  var type = _ref3.type,
      lat = _ref3.lat,
      lng = _ref3.lng,
      user = _ref3.user,
      timeStamp = _ref3.timeStamp,
      photo = _ref3.photo,
      comment = _ref3.comment;

  var properties = {};
  properties.user = user;
  properties.timeStamp = timeStamp;
  properties.comment = comment;
  properties.photo = photo;
  properties.type = type;

  var geometry = {};
  geometry.coordinates = [lng, lat];
  geometry.type = "Point";

  var feature = {};
  feature.type = "Feature";
  feature.geometry = geometry;
  feature.properties = properties;
  return feature;
};

/***/ }),

/***/ 0:
/*!*******************************************!*\
  !*** entry reference ./src/djs_module.js ***!
  \*******************************************/
/*! no exports provided */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  "805373aab5a74bf01d95efbe3f7b43a0aaec14bc": function() {return __webpack_require__('./node_modules/babel-loader/lib/index.js?!./src/djs_module.js');}
};


/***/ })

/******/ });
//# sourceMappingURL=djs_module.js.map