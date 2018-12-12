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

/***/ "./node_modules/babel-loader/lib/index.js?!./src/App.js":
/*!************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4!./src/App.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.App = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _leaflet = __webpack_require__(/*! leaflet */ "undefined?011d");

var _leaflet2 = _interopRequireDefault(_leaflet);

var _firebase = __webpack_require__(/*! firebase */ "undefined?6a4a");

var _firebase2 = _interopRequireDefault(_firebase);

__webpack_require__(/*! ./style.scss */ 1);

__webpack_require__(/*! leaflet-offline */ "undefined?6f5c");

var _localforage = __webpack_require__(/*! localforage */ "undefined?ba33");

var _localforage2 = _interopRequireDefault(_localforage);

var _ORCLLogoCropped = __webpack_require__(/*! ./ORCL-logo-cropped.png */ 2);

var _ORCLLogoCropped2 = _interopRequireDefault(_ORCLLogoCropped);

var _leafletKnn = __webpack_require__(/*! leaflet-knn */ "undefined?1515");

var _leafletKnn2 = _interopRequireDefault(_leafletKnn);

var _fontello = __webpack_require__(/*! ./fontello/font/fontello.ttf */ 3);

var _fontello2 = _interopRequireDefault(_fontello);

var _offlineTilesModule = __webpack_require__(/*! ./offline-tiles-module.js */ 4);

var _User = __webpack_require__(/*! ./User.js */ 5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

__webpack_require__(/*! ./L.Control.Sidebar */ 6);
__webpack_require__(/*! ./L.Control.Locate.min */ 7);

//import { djsModmyFunc } from "./djs_module.js";

var myMap = {
  setupBaseLayer: function setupBaseLayer() {
    this.greyscaleLayer = _leaflet2.default.tileLayer.offline(App.State.settings.mbUrl, _offlineTilesModule.tilesDb, {
      id: "mapbox.light",
      attribution: App.State.settings.mbAttr,
      maxZoom: 26,
      maxNativeZoom: 18
    });
    this.streetsLayer = _leaflet2.default.tileLayer.offline(App.State.settings.mbUrl, _offlineTilesModule.tilesDb, {
      id: "mapbox.streets",
      attribution: App.State.settings.mbAttr,
      maxZoom: 26,
      maxNativeZoom: 18
    });
    this.streetsLayer.on("offline:save-end", function () {
      alert("All the tiles were saved.");
    });

    this.satLayer = _leaflet2.default.tileLayer.offline(App.State.settings.mbUrl, _offlineTilesModule.tilesDb, {
      id: "mapbox.satellite",
      attribution: App.State.settings.mbAttr,
      maxZoom: 26,
      minZoom: 14
    });
    this.myLayerGroup = _leaflet2.default.layerGroup();

    var map = _leaflet2.default.map("map", {
      center: App.State.settings.map.defaultCenter,
      zoom: App.State.settings.map.defaultZoom,
      maxZoom: App.State.settings.map.maxZoom,
      minZoom: App.State.settings.map.minZoom,
      zoomDelta: App.State.settings.map.zoomDelta,
      layers: [this.streetsLayer, this.myLayerGroup] // loads with this layer initially
    });
    // create group of basemap layers
    var baseMaps = {
      Greyscale: this.greyscaleLayer,
      Streets: this.streetsLayer,
      Satellite: this.satLayer
    };

    this.overlayMaps = {
      myLayers: this.myLayerGroup
    };
    this.LayersControl = _leaflet2.default.control.layers(baseMaps).addTo(map);
    return map;
  }
};

// the App object holds the GeoJSON layer and manages all it's interactions with the user
var App = exports.App = {
  State: {
    settings: {
      map: {
        defaultCenter: [51.4384332, -0.3147865], // Ham
        defaultZoom: 18,
        maxZoom: 26,
        minZoom: 12,
        zoomDelta: 2
      },
      symbology: {
        taskCompleteStyle: {
          fillColor: "grey",
          color: "black",
          weight: 1
        },
        pointTaskNotCompleteStyle: {
          fillColor: "yellow",
          color: "red"
        },
        lineTaskNotCompleteStyle: {
          fillColor: "yellow",
          color: "red",
          weight: 12
        },
        polyTaskNotCompleteStyle: {
          fillColor: "yellow",
          color: "red",
          weight: 1
        }
      },
      mbAttr: '<a href="http://openstreetmap.org">OSMap</a> ©<a href="http://mapbox.com">Mapbox</a>',
      mbUrl: "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZGFuc2ltbW9ucyIsImEiOiJjamRsc2NieTEwYmxnMnhsN3J5a3FoZ3F1In0.m0ct-AGSmSX2zaCMbXl0-w",
      uploadjsonURL: "https://geo.danieljsimmons.uk/dan1/upload/uploadjson.php",
      editform: {
        assetConditionOptions: [6, 5, 4, 3, 2, 1, "n/a"]
      }
    },
    relatedData: {}, // init va3l
    latestLocation: null, // lat Lng
    relDataSyncStatus: {}, // objects holds relatedData sync status flag for each feature, TRUE if synced , False
    surveyed: {}, // true when inspected ie completed , false when not-yet-instected
    completedResetDate: new Date(2018, 9, 1, 0, 0, 0, 0),
    symbology: {
      uncompletedColor: "red",
      uncompletedfillColor: "red",
      uncompletedLineWeight: 8,
      completedLineWeight: 4,
      uncompletedRadius: 8,
      completedColor: "grey",
      completedFillColor: "grey",
      completedRadius: 2
    },
    visableFeatures: [],
    formFields: {
      condition: {
        null: "",
        c1: "(1 - hazard)",
        c2: "2 - (unfit for purpose)",
        c3: "3",
        c4: "4",
        c5: "5",
        c6: "6",
        rm: "removed / not found",
        nv: "not visable",
        pv: "partially visable"
      }
    },
    AddPointButtonsPoints: [{ label: "Hazard", id: "hazard" }, { label: "Unmapped asset", id: "unmappedAsset" }, { label: "general comment", id: "comment" }],
    AddPointButtonsLines: [{ label: "Hazard", id: "hazard" }, { label: "Unmapped asset", id: "unmappedAsset" }, { label: "General comment", id: "comment" }, { label: "Breach in barrier", id: "breach" }]
  },

  populateInputOptions: function populateInputOptions(el, items) {
    Object.keys(items).forEach(function (key) {
      var option = document.createElement("option");
      option.value = key;
      option.text = items[key];
      el.add(option);
    });
  },

  updateRelDataSyncMsg: function updateRelDataSyncMsg(syncStatus, el) {
    if (el == null) return; //exit if element doesn yet exist ie of form is'nt open
    var msg = "";
    if (syncStatus == null) {
      msg = "no related data";
    } else if (syncStatus == true) {
      msg = "successful sync";
    } else if (syncStatus == false) {
      msg = "Data not yet synced - please connect to network before closing this App";
    }
    el.innerHTML = msg;
    el.style = "color:'CornflowerBlue' ";
  },

  whenGeoFeatureClicked: function whenGeoFeatureClicked() {
    var fId = App.selectedFeature.properties.OBJECTID + App.selectedFeature.geometry.type;

    function renderSideBar() {
      App.sidebar.setContent(document.getElementById("form-template").innerHTML);
    }
    var p = App.selectedFeature.properties;
    renderSideBar();
    this.generateFeatureEditFormElements(p, document.getElementById("fields-section"));
    if (!!p.photo) this.getPhoto(p.photo);
    App.updateRelDataSyncMsg(App.State.relDataSyncStatus[fId], document.getElementById("rel-data-sync-message"));
    App.updateSidebarRelatedFromState(fId, document.getElementById("latest-related"), App.State.relatedData);
    App.populateInputOptions(document.getElementById("related-data-condition"), App.State.formFields.condition);
    App.sidebar.show();
  },

  findNearestFeatures: function findNearestFeatures() {
    if (App.State.latestLocation) {
      var nearest = (0, _leafletKnn2.default)(App.geoLayer).nearest(_leaflet2.default.latLng(App.State.latestLocation), 1);
      nearest[0].layer.fire("click");
    } else {
      window.alert("Sorry - GPS lock needed first ");
    }
  },

  generateFeatureEditFormElements: function generateFeatureEditFormElements(props, sectionEl) {
    sectionEl.innerHTML = null;
    var createFormItem = function createFormItem(parentTag, el, type, prop, value) {
      var createWrapperDiv = function createWrapperDiv() {
        var x = document.createElement("tr");
        parentTag.appendChild(x);
        return x;
      };
      var createValueLabel = function createValueLabel(parent) {
        var x = document.createElement("td");
        x.innerHTML = value;
        parent.appendChild(x);
        if (type === "Checkbox") {
          x.checked = value;
        }
        parent.appendChild(x);
      };

      var createLabel = function createLabel(parent) {
        var x = document.createElement("td");
        x.innerHTML = prop;
        parent.appendChild(x);
      };

      var createRow = function createRow(parent) {
        var x = document.createElement("div");
        x.innerHTML = prop + " " + value + "<br>";
        parent.appendChild(x);
      };

      var wrapperDiv = createWrapperDiv(parentTag);
      createLabel(wrapperDiv, el, type, prop, value);
      createValueLabel(wrapperDiv, el, type, prop, value);
    };

    var createFormItems = Object.keys(props).forEach(function (key) {
      var propType = _typeof(props[key]);
      if (propType === "string" || propType === "number") {
        createFormItem(sectionEl, "Input", "text", key, props[key]);
      } else if (propType === "boolean") {
        createFormItem(sectionEl, "Input", "Checkbox", key, props[key]);
      }
    });
  },

  resetMap: function resetMap() {
    localStorage.removeItem("geoJSON");
    App.geoLayer = {};
  },
  getPhoto: function getPhoto(photoURL) {
    fetch(photoURL).then(function (res) {
      return res.blob();
    }) // Gets the response and returns it as a blob
    .then(function (blob) {
      var objectURL = URL.createObjectURL(blob);
      var myImage = new Image(350);
      myImage.src = objectURL;
      myImage.css = "width:500px";
      document.getElementById("photo-div").appendChild(myImage);
    });
  },

  initSettingsControl: function initSettingsControl() {
    _leaflet2.default.Control.myControl = _leaflet2.default.Control.extend({
      onAdd: function onAdd(e) {
        var myControl_div = _leaflet2.default.DomUtil.create("button", "main-button-control btn btn-lg btn-danger icon-cog");
        myControl_div.innerHTML = "";
        myControl_div.title = "Settings";
        myControl_div.onclick = function () {
          App.sidebar.setContent(document.getElementById("settings-template").innerHTML);
          (0, _User.User)().initLoginForm();
          if (!!App.geoLayer) App.populateMapMeta();

          document.getElementById("open-new-project-button").addEventListener("click", function () {
            loadMyLayer("dummy");
          });
          App.sidebar.show();
        };
        return myControl_div;
      }
    });
    _leaflet2.default.control.myControl = function (opts) {
      return new _leaflet2.default.Control.myControl(opts);
    };
    _leaflet2.default.control.myControl({
      position: "bottomleft"
    }).addTo(Map);
  },

  populateMapMeta: function populateMapMeta() {
    var container = document.getElementById("map-info-section");
    var content = "";
    for (var item in App.mapMeta) {
      if (!!item) {
        content += String(item + ": " + App.mapMeta[item] + "<br>");
      }
    }
    container.innerHTML = content;
  },

  busyWorkingIndicator: function busyWorkingIndicator(busyWorking) {
    var cogIcon = document.getElementsByClassName("icon-cog")[0];
    busyWorking ? cogIcon.classList.add("icon-cog-spin") : cogIcon.classList.remove("icon-cog-spin");
  },

  retrieveMapFromFireBase: function retrieveMapFromFireBase(index) {
    var nodePath = String("/App/Maps/" + index);
    App.sidebar.hide();
    App.busyWorkingIndicator(true);
    fbDatabase.ref(nodePath).once("value").then(function (snapshot) {
      var mapData = snapshot.val();
      App.clearLocalStorageMaps();
      App.setupGeoLayer(index, mapData);
      document.getElementById("opennewproject").style.display = "none";
      App.busyWorkingIndicator(false);
    }).catch(function (err) {
      console.log("Error! cannot retrieve mapdata from firebase:", err);
      App.busyWorkingIndicator(false);
    });
  },

  saveMapToLocalStorage: function saveMapToLocalStorage(myKey, mapData) {
    localStorage.setItem("mapData." + myKey, JSON.stringify(mapData));
  },

  clearLocalStorageMaps: function clearLocalStorageMaps() {
    var keys = App.getLocalStorageMapDataKey();
    keys.map(function (item) {
      localStorage.removeItem(item);
    });
  },

  clearLocalStorageLatestRelDataBackup: function clearLocalStorageLatestRelDataBackup() {
    localStorage.removeItem("latestRelDataBackup");
  },

  populateRelated: function populateRelated(related) {
    if (!related) return;
    var relDataObject = {}; // to be replaced with State etc
    var relDataSyncObject = {}; // just to make sure it's initially empty
    var getLastRelDataItem = function getLastRelDataItem(RelDataSet) {
      var sortedKeys = Object.keys(RelDataSet).sort();
      var lastDataItem = RelDataSet[sortedKeys[sortedKeys.length - 1]];
      return lastDataItem;
    };
    App.State.relatedData = Object.keys(related).map(function (relKey, index) {
      var itemOb = {};
      var lastItem = getLastRelDataItem(related[relKey]);
      itemOb[relKey] = lastItem;
      relDataObject[relKey] = lastItem;
      relDataSyncObject[relKey] = true; // ie the feature's rela data is now synced
      return itemOb;
    });
    App.getRelDataFromLocalStorage(App.mapHash);
    return { relDataObject: relDataObject, relDataSyncObject: relDataSyncObject };
  },

  getRelDataFromLocalStorage: function getRelDataFromLocalStorage(mapHash) {
    var regex = "backup.relatedData." + mapHash + ".";
    var relDataKeys = Object.keys(localStorage).filter(function (item) {
      return item.match(regex);
    });
    if (relDataKeys.length == 0) return;
    relDataKeys.map(function (key) {
      var item = JSON.parse(localStorage.getItem(key));
      var itemFeatureKey = key.split(regex)[1]; //  element 1 is str after split point
      var relDataFeaturePath = "App/Maps/" + mapHash + "/Related/" + itemFeatureKey;
      var localStorageTime = new Date(item.timestamp);
      var stateTime = new Date(App.State.relatedData[itemFeatureKey].timestamp);
      if (localStorageTime.getTime() > stateTime.getTime()) {
        console.log("New item to upload! : ", itemFeatureKey, item.timestamp, "State Timestamp:", App.State.relatedData[itemFeatureKey].timestamp);
        App.updateFeatureRelatedState(itemFeatureKey, item);
        App.State.relDataSyncStatus[key] = false; // while item is sucessfully pushed to db
        RelatedData.pushRelatedDataRecord(relDataFeaturePath, itemFeatureKey, item);
        // Trigger push of item (does this update sync status and message automatically ? )
      }
    });
  },

  updateFeatureRelatedState: function updateFeatureRelatedState(featureKey, relatedData) {
    // update a single feature's RelatedRecord State
    App.State.relatedData[featureKey] = relatedData;
  },

  setCompletedStyle: function setCompletedStyle(featureOb, layerOb, objectID, ObjectType, isCompleted, relatedData, completedResetDate, symbology) {
    var featureKey = objectID + ObjectType; // strings
    if (relatedData[featureKey] !== undefined) {
      var relDataDate = new Date(Date.parse(relatedData[featureKey].timestamp));
      var refDate = completedResetDate.getTime();
      var relDate = relDataDate.getTime();
      if (relDataDate > completedResetDate) {
        layerOb.setStyle({
          color: symbology.completedColor, // why not working??
          fillColor: symbology.completedFillColor,
          weight: symbology.completedLineWeight,
          radius: 1
        });
      }
    }
  },

  updateSidebarRelatedFromState: function updateSidebarRelatedFromState(featureKey, reldiv, relatedData) {
    // update a feature's RelatedRecord State
    reldiv.innerHTML = "";
    var relSet = relatedData[featureKey];
    if (relSet) {
      Object.keys(relSet).map(function (key) {
        reldiv.innerHTML += key + ": " + relSet[key] + "<br>";
      });
    } else reldiv.innerHTML = "";
  },

  setupGeoLayer: function setupGeoLayer(key, mapData) {
    // TODO: major refactor needed to make functional
    App.mapMeta = mapData.meta;
    App.mapHash = key;
    myMap.myLayerGroup.clearLayers(App.geoLayer);
    var featureLabelField = mapData.Meta ? mapData.Meta.LabelProperty : "Asset";
    var relData = App.populateRelated(mapData.Related); // need to catch when no related available
    if (!!relData) {
      App.State.relatedData = relData.relDataObject;
      App.State.relDataSyncStatus = relData.relDataSyncObject;
    } else {
      App.State.relatedData = {};
      App.State.relDataSyncStatus = {};
    }
    App.geoLayer = _leaflet2.default.geoJson(mapData.Geo, {
      onEachFeature: function onEachFeature(feature, layer) {
        var featureLabel = feature.properties[featureLabelField];
        App.setCompletedStyle(feature, layer, feature.properties["OBJECTID"], feature.geometry.type, true, App.State.relatedData, App.State.completedResetDate, App.State.symbology);

        var featureContentPopup = "";
        var addNoteButtonContent = "";
        featureContentPopup = "<div class=\"btn btn-primary large icon-pencil\" onClick=\"App.whenGeoFeatureClicked();\"><br>\n          " + featureLabel + " </div>";
        if (feature.geometry.type == "LineString") {
          addNoteButtonContent = App.createPopupContentButtonSet(App.State.AddPointButtonsLines);
        }
        layer.bindPopup(featureContentPopup + addNoteButtonContent);
        layer.on("click", function (e) {
          if (App.selectedLayer !== layer) {
            if (App.selectedLayer) {
              App.unsetSelectedStyle();
            }
            App.State.symbology.beforeSelectedColor = layer.options.color;
            App.State.symbology.beforeSelectedFillColor = layer.options.fillColor;
            App.State.symbology.beforeSelectedLineWeight = layer.options.weight;

            // now reset the style of the old layer
          }
          App.selectedFeature = feature; // expose selected feature and layer
          App.selectedLayer = layer;
          App.selectedLayer.setStyle({
            color: "blue",
            fillColor: "blue",
            weight: 2
          });
        });
      },
      style: function style(feature) {
        return {
          fillOpacity: 0.4,
          color: App.State.symbology.uncompletedColor,
          fillColor: App.State.symbology.uncompletedFillColor,
          weight: App.State.symbology.uncompletedLineWeight
        };
      },
      pointToLayer: function pointToLayer(feature, latlng) {
        return _leaflet2.default.circleMarker(latlng, {
          radius: App.State.symbology.uncompletedRadius,
          stroke: true,
          weight: 3,
          opacity: 1,
          fillOpacity: 1
        });
      },
      interactive: true
    });
    myMap.myLayerGroup.addLayer(App.geoLayer);
    Map.fitBounds(App.geoLayer.getBounds());
    App.movePolygonsToBack();
    App.saveMapToLocalStorage(key, mapData);
  },

  unsetSelectedStyle: function unsetSelectedStyle() {
    if (!App.selectedLayer) return;
    App.selectedLayer.setStyle({
      color: App.State.symbology.beforeSelectedColor,
      fillColor: App.State.symbology.beforeSelectedFillColor,
      weight: App.State.symbology.beforeSelectedLineWeight
    });
  },

  movePolygonsToBack: function movePolygonsToBack() {
    //move polygons to back
    App.geoLayer.eachLayer(function (layer) {
      if (layer.feature.geometry.type == "Polygon") {
        layer.bringToBack();
      }
    });
  },


  getLocalStorageMapDataKey: function getLocalStorageMapDataKey() {
    // return keys that start with maoData
    return Object.keys(localStorage).filter(function (item) {
      return new RegExp("^mapData.*").test(item);
    });
  },

  loadMapDataFromLocalStorage: function loadMapDataFromLocalStorage() {
    // attempt to retrieve map from local
    var storageKey = App.getLocalStorageMapDataKey();
    if (storageKey.length == 0) {
      return;
    }
    var mapData = JSON.parse(localStorage.getItem(storageKey));
    var mapKey = storageKey[0].split("mapData.")[1];
    App.setupGeoLayer(mapKey, mapData);
  },

  addPointForm: function addPointForm(buttonSetType) {
    var sidebarContent = "\n    <h3>Add point </h3>\n    type: " + buttonSetType + "\n    <p>  <textarea class=\"form-control\" rows=\"2\" id=\"add-point-comment\" placeholder = \"optional comment here ...\"></textarea></p>\n    <p><button class=\"btn btn-primary\">Add photo</button></p><hr>\n    <p><button class=\"btn btn-primary\">Submit </button> </p>";
    App.sidebar.setContent(sidebarContent);
    App.sidebar.show();
  },

  createPopupContentButtonSet: function createPopupContentButtonSet(buttonSet) {
    var popupContent = "<div class='dropdown'>\n    <button class='btn btn-primary left-spacing'>Add point ...\n    </button> <div class='dropdown-content'>";
    var createButtons = buttonSet.map(function (button) {
      popupContent += "<button onclick=\"App.addPointForm('" + button.id + "')\"\n       class=\"btn btn-primary dropdown-button\" >" + button.label + "</button>";
    });
    popupContent += "</div></div>";
    return popupContent;
  },

  featureLabels: function featureLabels() {
    // TODO: refactor to functional
    var bounds = Map.getBounds();
    if (App.State.visableFeatures !== null) {
      App.State.visableFeatures.map(function (layer) {
        layer.unbindTooltip();
      });
      App.State.visableFeatures = [];
    }
    if (Map.getZoom() < 20) {
      return;
    }
    var redrawToolTips = function redrawToolTips() {
      App.geoLayer.eachLayer(function (layer) {
        var relID = "";
        var hasRelData = void 0;
        try {
          relID = layer.feature.properties.OBJECTID + layer.feature.geometry.type;
          hasRelData = App.State.relatedData[relID];
        } catch (err) {
          relID = undefined;
          hasRelData = false;
        }

        if (layer.getLatLng && !hasRelData) {
          if (bounds.contains(layer.getLatLng())) {
            App.State.visableFeatures.push(layer);
          }
        } else if (layer.getBounds && !hasRelData) {
          if (bounds.intersects(layer.getBounds()) || bounds.contains(layer.getBounds())) {
            App.State.visableFeatures.push(layer);
          }
        }
      });
    };
    redrawToolTips();
    App.State.visableFeatures.map(function (layer) {
      layer.bindTooltip(layer.feature.properties.Asset, {
        permanent: true,
        interactive: true
      });
    });
  }
};

window.App = App;

var RelatedData = {
  saveRelDataRecordToLocalStorage: function saveRelDataRecordToLocalStorage(mapHash, featureKey, relatedData) {
    localStorage.setItem("backup.relatedData." + mapHash + "." + featureKey, JSON.stringify(relatedData));
  },

  pushRelatedDataRecord: function pushRelatedDataRecord(relDataPath, featureKey, relatedRecord) {
    fbDatabase.ref(relDataPath) // meed to move this constant into App.State
    .push(relatedRecord).then(function (snap) {
      // if successfully synced
      var f_id = snap.parent.key; // fudege to retrieve feature key
      App.State.relDataSyncStatus[f_id] = true;
      App.updateRelDataSyncMsg(App.State.relDataSyncStatus[f_id], document.getElementById("rel-data-sync-message"));
      // Remove record from local storage
      var localStorageKey = "backup.relatedData." + App.mapHash + "." + featureKey;
      localStorage.removeItem(localStorageKey);
    }).catch(function (error) {
      alert("Sorry - something went wrong - have you logged in etc?");
    });
  },

  submit: function submit() {
    // calculate key from OBJECTID + geometrytype
    RelatedData.featureKey = String(App.selectedFeature.properties.OBJECTID + App.selectedFeature.geometry.type);

    App.selectedFeature.geometry.type + "/";
    RelatedData.nodePath = String(
    //    "App/Maps/" + App.mapHash + "/Related/" + RelatedData.featureKey + "/"
    "App/Maps/" + App.mapHash + "/Related/" + RelatedData.featureKey + "/");

    var relatedRecord = {};
    relatedRecord.timestamp = Date();
    relatedRecord.user = _firebase2.default.auth().currentUser.displayName;
    relatedRecord.condition = document.getElementById("related-data-condition").value;
    if (document.getElementById("related-data-comments").value) {
      relatedRecord.comments = document.getElementById("related-data-comments").value;
    }
    if (document.getElementById("related-data-photo").value) {
      relatedRecord.photo = document.getElementById("related-data-photo").value;
    }
    var key = RelatedData.featureKey;
    App.State.relDataSyncStatus[key] = false; // while push promise is unresolved
    App.updateRelDataSyncMsg(App.State.relDataSyncStatus[key], document.getElementById("rel-data-sync-message"));
    App.updateFeatureRelatedState(key, relatedRecord);

    App.updateSidebarRelatedFromState(key, document.getElementById("latest-related"), App.State.relatedData);
    //RelatedData.backupUpRelStateToLocalStorage()
    RelatedData.saveRelDataRecordToLocalStorage(App.mapHash, key, relatedRecord);
    // RelatedData.backupUpRelStateToLocalStorage();
    RelatedData.pushRelatedDataRecord(RelatedData.nodePath, key, relatedRecord);
    document.getElementById("related-data-info").innerHTML = "Submitted!";
    App.State.symbology.beforeSelectedColor = App.State.symbology.completedColor;
    App.State.symbology.beforeSelectedFillColor = App.State.symbology.completedFillColor;
  },

  backupUpRelStateToLocalStorage: function backupUpRelStateToLocalStorage() {
    localStorage.setItem("latestRelDataBackup", JSON.stringify(App.State.relatedData));
  },

  restoreRelStateFromLocalStorage: function restoreRelStateFromLocalStorage() {
    if (localStorage.getItem("latestRelDataBackup") !== null) {
      App.State.relatedData = JSON.parse(localStorage.getItem("latestRelDataBackup"));
    } else {
      App.State.relatedData = {};
    }
  },

  addPhoto: function addPhoto() {
    var el = document.getElementById("photo-capture");
    document.getElementById("related-data-photo").value = el.files[0].name;
  }
};

window.RelatedData = RelatedData;

function uploadMapToFirebase() {
  // grab the blobal Mapindex, then send gson layer up to node
  var nodePath = String("App/Maps/" + App.mapHash + "/Geo");

  fbDatabase.ref(nodePath).set(App.geoLayer.toGeoJSON()).catch(function (error) {
    alert("Sorry you need to be logged in to do this");
  });
}

window.User = _User.User;
function loadMyLayer(layerName) {
  // just for testing

  document.getElementById("open-new-project-button").style.display = "none";
  //loadFromPresetButtons(layerName);
  loadProject();

  function loadProject() {
    retriveMapIndexFromFirebase();

    function retriveMapIndexFromFirebase() {
      document.getElementById("message-area").innerHTML = "<p>waiting for network connection ...</p>";
      fbDatabase.ref("/App/Mapindex").once("value").then(function (snapshot) {
        document.getElementById("message-area").innerHTML = null;
        var el = document.getElementById("opennewproject");
        el.insertAdjacentHTML("afterBegin", "Open project");
        displayMapIndeces(snapshot.val());
      }).catch(function (error) {
        document.getElementById("message-area").innerHTML = "Sorry - " + error.message;
      });
    }

    function displayMapIndeces(mapIndexList) {
      var el = document.getElementById("opennewproject");
      el.insertAdjacentHTML("afterBegin", "Open project");
      Object.values(mapIndexList).map(function (item) {
        var btn = document.createElement("button");
        btn.setAttribute("value", item.mapID);
        btn.setAttribute("title", item.description);
        btn.className = "btn btn-primary open-project-button";
        var id = item.mapID;
        btn.addEventListener("click", function (e) {
          App.retrieveMapFromFireBase(e.target.value);
          App.State.settings.mapIndex = e.target.value; // store map Index
        });
        btn.innerHTML = item.name;
        maplist.appendChild(btn);
      });
    }
  }
}

function initLogoWatermark() {
  _leaflet2.default.Control.watermark = _leaflet2.default.Control.extend({
    onAdd: function onAdd(e) {
      var watermark = _leaflet2.default.DomUtil.create("IMG", "watermark");
      watermark.src = "ORCL-logo-cropped.png";
      watermark.style.opacity = 0.3;
      return watermark;
    }
  });
  _leaflet2.default.control.watermark = function (opts) {
    return new _leaflet2.default.Control.watermark(opts);
  };
  _leaflet2.default.control.watermark({ position: "bottomright" }).addTo(Map);
}

// --------------------------------- Offline Basemap Caching ------
var setupOfflineBaseLayerControls = function setupOfflineBaseLayerControls() {
  var myBaseLayerControls = [{
    object: myMap.streetsLayer,
    label: "colour streets",
    class: "streets-offline-control"
  }, {
    object: myMap.greyscaleLayer,
    label: "Greyscale",
    class: "greyscale-offline-control"
  }, {
    object: myMap.satLayer,
    label: "Satellite",
    class: "satellite-offline-control"
  }];

  return myBaseLayerControls.map(function (layer) {
    return _leaflet2.default.control.offline(layer.object, _offlineTilesModule.tilesDb, {
      saveButtonHtml: "<i id=\"" + layer.object + "\" title=\"Save " + layer.label + " layer to use offline\" class=\"" + layer.class + " layer icon-download\">" + layer.label + " </i>",
      removeButtonHtml: '<i class="icon-trash " aria-hidden="true">Delete</i>',
      confirmSavingCallback: function confirmSavingCallback(nTilesToSave, continueSaveTiles) {
        if (window.confirm("Save " + nTilesToSave + " background tiles?")) {
          continueSaveTiles();
        }
      },
      confirmRemovalCallback: function confirmRemovalCallback(continueRemoveTiles) {
        if (window.confirm("Delete All offline tiles?")) {
          continueRemoveTiles();
        }
      },
      minZoom: 14,
      maxZoom: 18,
      position: "topright"
    });
  });
};

_leaflet2.default.Control.OfflineBaselayersControl = _leaflet2.default.Control.extend({
  onAdd: function onAdd(map) {
    var OfflineBaselayersControl_div = _leaflet2.default.DomUtil.create("button", "btn btn-sm icon-download btn-info");
    OfflineBaselayersControl_div.innerHTML = "Offline <br>Baselayers";
    OfflineBaselayersControl_div.title = "Save Background layers (tiles) for Offline use";
    OfflineBaselayersControl_div.onclick = function () {
      var offlineLayerCtrls = document.querySelectorAll(".leaflet-control-offline");
      if (offlineLayerCtrls[0].style.display == "none") {
        offlineLayerCtrls.forEach(function (el) {
          return el.style.display = "block";
        });
      } else {
        offlineLayerCtrls.forEach(function (el) {
          return el.style.display = "none";
        });
      }
    };
    return OfflineBaselayersControl_div;
  }
});
_leaflet2.default.control.OfflineBaselayersControl = function (opts) {
  return new _leaflet2.default.Control.OfflineBaselayersControl(opts);
};

var fireBaseconfig = {
  apiKey: "AIzaSyB977vJdWTGA-JJ03xotQkeu8X4_Ds_BLQ",
  authDomain: "fir-realtime-db-24299.firebaseapp.com",
  databaseURL: "https://fir-realtime-db-24299.firebaseio.com",
  projectId: "fir-realtime-db-24299",
  storageBucket: "fir-realtime-db-24299.appspot.com",
  messagingSenderId: "546067641349"
};

var Map = {};
var fbDatabase = {};
var offlineLayerControls = {};
var initApp = function initApp() {
  App.State.relatedData = {};
  App.State.visableFeatures = [];
  App.State.symbology.beforeSelectedColor = {};
  App.State.symbology.beforeSelectedFillColor = {};
  _firebase2.default.initializeApp(fireBaseconfig);
  fbDatabase = _firebase2.default.database();

  // --------------------------------------- Main ---------------------
  Map = myMap.setupBaseLayer();
  // initDebugControl()
  initLogoWatermark();
  _leaflet2.default.control.scale({ position: "bottomleft" }).addTo(Map);
  App.initSettingsControl();
  setupSideBar();
  initLocationControl();
  Map.doubleClickZoom.disable();
  _leaflet2.default.control.OfflineBaselayersControl({ position: "topright" }).addTo(Map);
  offlineLayerControls = setupOfflineBaseLayerControls();
  offlineLayerControls.map(function (layer) {
    layer.addTo(Map);
  });
  document.querySelectorAll(".leaflet-control-offline").forEach(function (el) {
    el.style.display = "none";
  });
  //RelatedData.restoreRelStateFromLocalStorage()
  App.loadMapDataFromLocalStorage();
  window.alert("ORCL WebApp version 0.9.103");

  // ----- offline service worker -----------
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").then(function (registration) {}).catch(function (registrationError) {
        console.log("SW registration failed: ", registrationError);
      });
    });
  }
};

initApp();

//  ------------------------  leaflet controls -------------

// ------sidebar controll plugin
function setupSideBar() {
  App.sidebar = window.L.control.sidebar("sidebar", {
    position: "left",
    closeButton: "true",
    autoPan: false
  });

  Map.addControl(App.sidebar);
}

// -------------------- GPS location plugin
function initLocationControl() {
  App.lc = _leaflet2.default.control.locate({
    position: "topright",
    keepCurrentZoomLevel: true,
    strings: {
      title: "My location (will use GPS if available)"
    },
    cacheLocation: false,
    locateOptions: {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 3000
      //watch: true
    },
    icon: "icon-direction"
  }).addTo(Map);
}

Map.on("locationfound", updateLatestLocation);

Map.on("click", function (e) {
  App.unsetSelectedStyle();
  App.selectedLayer = null;
  App.selectedFeature = null;
});

Map.on("dblclick", function (e) {
  var addPopupToClick = function addPopupToClick(e) {
    _leaflet2.default.popup().setLatLng(e.latlng).setContent(App.createPopupContentButtonSet(App.State.AddPointButtonsPoints)).openOn(Map);
  };
  addPopupToClick(e);
});

Map.on("moveend", function () {
  App.featureLabels();
});

function updateLatestLocation(e) {
  App.State.latestLocation = e.latlng;
}

/***/ }),

/***/ 0:
/*!************************************!*\
  !*** entry reference ./src/App.js ***!
  \************************************/
/*! no exports provided */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  "c08917937a13eeb94a8f85b9b93186abcceb99f4": function() {return __webpack_require__('./node_modules/babel-loader/lib/index.js?!./src/App.js');}
};


/***/ }),

/***/ 1:
/*!***************************************************************************!*\
  !*** reference ./src/style.scss.e49800ae3a9501135f89d0d56d975b449b30247b ***!
  \***************************************************************************/
/*! no exports provided */
/***/ (function(module, exports) {

module.exports = require("./style.scss")["e49800ae3a9501135f89d0d56d975b449b30247b"]();

/***/ }),

/***/ 2:
/*!**************************************************************************************!*\
  !*** reference ./src/ORCL-logo-cropped.png.fd90855f632b8c4dc794b0c013a3828e586eac32 ***!
  \**************************************************************************************/
/*! no exports provided */
/***/ (function(module, exports) {

module.exports = require("./ORCL-logo-cropped.png")["fd90855f632b8c4dc794b0c013a3828e586eac32"]();

/***/ }),

/***/ 3:
/*!*******************************************************************************************!*\
  !*** reference ./src/fontello/font/fontello.ttf.7d11bb12b044b495eeea069b77ae290fc795464d ***!
  \*******************************************************************************************/
/*! no exports provided */
/***/ (function(module, exports) {

module.exports = require("./fontello\\font\\fontello.ttf")["7d11bb12b044b495eeea069b77ae290fc795464d"]();

/***/ }),

/***/ 4:
/*!****************************************************************************************!*\
  !*** reference ./src/offline-tiles-module.js.c9556a61702fbebc1cf7b7b56dce0003b86db2ca ***!
  \****************************************************************************************/
/*! no exports provided */
/***/ (function(module, exports) {

module.exports = require("./offline-tiles-module.js")["c9556a61702fbebc1cf7b7b56dce0003b86db2ca"]();

/***/ }),

/***/ 5:
/*!************************************************************************!*\
  !*** reference ./src/User.js.b37579f7874130d3946c04714c5a580528923075 ***!
  \************************************************************************/
/*! no exports provided */
/***/ (function(module, exports) {

module.exports = require("./User.js")["b37579f7874130d3946c04714c5a580528923075"]();

/***/ }),

/***/ 6:
/*!*************************************************************************************!*\
  !*** reference ./src/L.Control.Sidebar.js.ad90e3e33515ebfb105d07f03c8f156cf6374fd6 ***!
  \*************************************************************************************/
/*! no exports provided */
/***/ (function(module, exports) {

module.exports = require("./L.Control.Sidebar.js")["ad90e3e33515ebfb105d07f03c8f156cf6374fd6"]();

/***/ }),

/***/ 7:
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
//# sourceMappingURL=App.js.map