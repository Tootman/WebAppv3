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

/***/ "./node_modules/babel-loader/lib/index.js?!./src/User.js":
/*!*************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4!./src/User.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.User = undefined;

var _firebase = __webpack_require__(/*! firebase */ undefined);

var _firebase2 = _interopRequireDefault(_firebase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var User = exports.User = function User() {
    var email = document.getElementById("emailInput");
    var pw = document.getElementById("passwordInput");
    var msg = document.getElementById("Login-status-message");
    var loginBtn = document.getElementById("login-btn");
    var logoutBtn = document.getElementById("logout-btn");
    var loginForm = document.getElementById("login-form");
    var auth = _firebase2.default.auth;

    function signIn() {
        auth().signInWithEmailAndPassword(email.value, pw.value).then(function (user) {
            console.log(user, "signed in!");
            userSignedIn();
        }).catch(function (error) {
            console.log("sorry couldn't sign in -  Error: " + error);
            alert("sorry couldn't sign in -  Error: " + error);
        });
    }

    function signOut() {
        _firebase2.default.auth().signOut().then(function () {
            // Sign-out successful.
            console.log("successfully signed out");
            userSignedOut();
        }, function (error) {
            // An error happened.
            console.log("problem signing out - error: ", error);
        });
    }

    function userSignedIn() {
        msg.innerHTML = "you are now signed in!";
        pw.innerHTML = null;
        loginBtn.style.display = "none";
        logoutBtn.style.display = "block";
        loginForm.style.display = "none";
    }

    function userSignedOut() {
        msg.innerHTML = "Bye  - you have now signed out";
        loginBtn.style.display = "block";
        logoutBtn.style.display = "none";
        loginForm.style.display = "block";
    }

    function testFunc() {
        console.log("testing only!");
    }

    function testFunc2() {
        console.log("testing only - func2!");
    }

    function initLoginForm() {
        console.log("initLoginForm");
        if (_firebase2.default.auth().currentUser) {
            userSignedIn();
            console.log("user is logged in");
        } else {
            console.log("user is logged out");
            userSignedOut();
        }
    }

    return {
        btnLogin: signIn,
        btnLogout: signOut,
        btntest: testFunc,
        initLoginForm: initLoginForm
    };
};

/***/ }),

/***/ 0:
/*!*************************************!*\
  !*** entry reference ./src/User.js ***!
  \*************************************/
/*! no exports provided */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  "b37579f7874130d3946c04714c5a580528923075": function() {return __webpack_require__('./node_modules/babel-loader/lib/index.js?!./src/User.js');}
};


/***/ }),

/***/ undefined:
/*!*************************************************************************!*\
  !*** external "..\\..\\..\\node_modules\\firebase\\dist\\index.cjs.js" ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("..\\..\\..\\node_modules\\firebase\\dist\\index.cjs.js");

/***/ })

/******/ });
//# sourceMappingURL=User.js.map