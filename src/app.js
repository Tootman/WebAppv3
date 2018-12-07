import L from "leaflet";
import firebase from "firebase";
import "./style.scss";
import "leaflet-offline";
import localforage from "localforage";
import logoImg from "./ORCL-logo-cropped.png";
import leafletKnn from "leaflet-knn";
import fontello_ttf from "./fontello/font/fontello.ttf";
require("./L.Control.Sidebar");
require("./L.Control.Locate.min");
import { tilesDb } from "./offline-tiles-module.js";
import { User } from "./User.js";
//import { djsModmyFunc } from "./djs_module.js";

const myMap = {
  setupBaseLayer: function() {
    this.greyscaleLayer = L.tileLayer.offline(
      App.State.settings.mbUrl,
      tilesDb,
      {
        id: "mapbox.light",
        attribution: App.State.settings.mbAttr,
        maxZoom: 26,
        maxNativeZoom: 18
      }
    );
    this.streetsLayer = L.tileLayer.offline(App.State.settings.mbUrl, tilesDb, {
      id: "mapbox.streets",
      attribution: App.State.settings.mbAttr,
      maxZoom: 26,
      maxNativeZoom: 18
    });
    this.streetsLayer.on("offline:save-end", function() {
      alert("All the tiles were saved.");
    });

    this.satLayer = L.tileLayer.offline(App.State.settings.mbUrl, tilesDb, {
      id: "mapbox.satellite",
      attribution: App.State.settings.mbAttr,
      maxZoom: 26,
      minZoom: 14
    });
    this.myLayerGroup = L.layerGroup();

    const map = L.map("map", {
      center: App.State.settings.map.defaultCenter,
      zoom: App.State.settings.map.defaultZoom,
      maxZoom: App.State.settings.map.maxZoom,
      minZoom: App.State.settings.map.minZoom,
      zoomDelta: App.State.settings.map.zoomDelta,
      layers: [this.streetsLayer, this.myLayerGroup] // loads with this layer initially
    });
    // create group of basemap layers
    let baseMaps = {
      Greyscale: this.greyscaleLayer,
      Streets: this.streetsLayer,
      Satellite: this.satLayer
    };

    this.overlayMaps = {
      myLayers: this.myLayerGroup
    };
    this.LayersControl = L.control.layers(baseMaps).addTo(map);
    return map;
  }
};

// the App object holds the GeoJSON layer and manages all it's interactions with the user
export const App = {
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
      mbAttr:
        '<a href="http://openstreetmap.org">OSMap</a> ©<a href="http://mapbox.com">Mapbox</a>',
      mbUrl:
        "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZGFuc2ltbW9ucyIsImEiOiJjamRsc2NieTEwYmxnMnhsN3J5a3FoZ3F1In0.m0ct-AGSmSX2zaCMbXl0-w",
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
    AddPointButtonsPoints: [
      { label: "Hazard", id: "hazard" },
      { label: "Unmapped asset", id: "unmappedAsset" },
      { label: "general comment", id: "comment" }
    ],
    AddPointButtonsLines: [
      { label: "Hazard", id: "hazard" },
      { label: "Unmapped asset", id: "unmappedAsset" },
      { label: "General comment", id: "comment" },
      { label: "Breach in barrier", id: "breach" }
    ]
  },

  populateInputOptions: (el, items) => {
    Object.keys(items).forEach(key => {
      const option = document.createElement("option");
      option.value = key;
      option.text = items[key];
      el.add(option);
    });
  },

  updateRelDataSyncMsg: (syncStatus, el) => {
    if (el == null) return; //exit if element doesn yet exist ie of form is'nt open
    let msg = "";
    if (syncStatus == null) {
      msg = "no related data";
    } else if (syncStatus == true) {
      msg = "successful sync";
    } else if (syncStatus == false) {
      msg =
        "Data not yet synced - please connect to network before closing this App";
    }
    el.innerHTML = msg;
    el.style = "color:'CornflowerBlue' ";
  },

  whenGeoFeatureClicked: function() {
    const fId =
      App.selectedFeature.properties.OBJECTID +
      App.selectedFeature.geometry.type;

    function renderSideBar() {
      App.sidebar.setContent(
        document.getElementById("form-template").innerHTML
      );
    }
    const p = App.selectedFeature.properties;
    renderSideBar();
    this.generateFeatureEditFormElements(
      p,
      document.getElementById("fields-section")
    );
    if (!!p.photo) this.getPhoto(p.photo);
    App.updateRelDataSyncMsg(
      App.State.relDataSyncStatus[fId],
      document.getElementById("rel-data-sync-message")
    );
    App.updateSidebarRelatedFromState(fId);
    App.populateInputOptions(
      document.getElementById("related-data-condition"),
      App.State.formFields.condition
    );
    App.sidebar.show();
  },

  findNearestFeatures: function() {
    if (App.State.latestLocation) {
      const nearest = leafletKnn(App.geoLayer).nearest(
        L.latLng(App.State.latestLocation),
        1
      );
      nearest[0].layer.fire("click");
    } else {
      window.alert("Sorry - GPS lock needed first ");
    }
  },

  createFormItem: (parentTag, el, type, prop, value) => {
    const wrapperDiv = createWrapperDiv(parentTag);
    createLabel(wrapperDiv, el, type, prop, value);
    createValueLabel(wrapperDiv, el, type, prop, value);

    function createWrapperDiv() {
      const x = document.createElement("tr");
      parentTag.appendChild(x);
      return x;
    }

    function createValueLabel(parent) {
      const x = document.createElement("td");
      x.innerHTML = value;
      parent.appendChild(x);
      if (type === "Checkbox") {
        x.checked = value;
      }
      parent.appendChild(x);
    }

    function createLabel(parent) {
      const x = document.createElement("td");
      x.innerHTML = prop;
      parent.appendChild(x);
    }

    function createRow(parent) {
      const x = document.createElement("div");
      x.innerHTML = prop + " " + value + "<br>";
      parent.appendChild(x);
    }
  },

  generateFeatureEditFormElements: (props, sectionEl) => {
    //const fs = document.getElementById("fields-section");
    sectionEl.innerHTML = null;
    const createFormItems = Object.keys(props).forEach(key => {
      const propType = typeof props[key];
      if (propType === "string" || propType === "number") {
        App.createFormItem(sectionEl, "Input", "text", key, props[key]);
      } else if (propType === "boolean") {
        App.createFormItem(sectionEl, "Input", "Checkbox", key, props[key]);
      }
    });
  },

  assignTaskCompletedStyle: (layer, featureProperty) => {
    const s = App.State.settings.symbology;
    if (featureProperty.taskCompleted) {
      layer.setStyle(s.taskCompleteStyle);
    } else {
      if (layer.feature.geometry.type.includes("Poly")) {
        layer.setStyle(s.polyTaskNotCompleteStyle);
      } else if (layer.feature.geometry.type.includes("Line")) {
        layer.setStyle(s.lineTaskNotCompleteStyle);
      } else if (layer.feature.geometry.type.includes("Point")) {
        layer.setStyle(s.pointTaskNotCompleteStyle);
      }
    }
  },

  resetMap: () => {
    localStorage.removeItem("geoJSON");
    App.geoLayer = {};
  },
  getPhoto: photoURL => {
    fetch(photoURL)
      .then(res => res.blob()) // Gets the response and returns it as a blob
      .then(blob => {
        const objectURL = URL.createObjectURL(blob);
        const myImage = new Image(350);
        myImage.src = objectURL;
        myImage.css = "width:500px";
        document.getElementById("photo-div").appendChild(myImage);
      });
  },

  initSettingsControl: () => {
    L.Control.myControl = L.Control.extend({
      onAdd: e => {
        const myControl_div = L.DomUtil.create(
          "button",
          "main-button-control btn btn-lg btn-danger icon-cog"
        );
        myControl_div.innerHTML = "";
        myControl_div.title = "Settings";
        myControl_div.onclick = () => {
          App.sidebar.setContent(
            document.getElementById("settings-template").innerHTML
          );
          User().initLoginForm();
          if (!!App.geoLayer) App.populateMapMeta();

          document
            .getElementById("open-new-project-button")
            .addEventListener("click", function() {
              loadMyLayer("dummy");
            });
          App.sidebar.show();
        };
        return myControl_div;
      }
    });
    L.control.myControl = opts => {
      return new L.Control.myControl(opts);
    };
    L.control
      .myControl({
        position: "bottomleft"
      })
      .addTo(Map);
  },

  populateMapMeta: function() {
    const container = document.getElementById("map-info-section");
    let content = "";
    for (const item in App.mapMeta) {
      if (!!item) {
        content += String(item + ": " + App.mapMeta[item] + "<br>");
      }
    }
    container.innerHTML = content;
  },

  busyWorkingIndicator: busyWorking => {
    const cogIcon = document.getElementsByClassName("icon-cog")[0];
    busyWorking
      ? cogIcon.classList.add("icon-cog-spin")
      : cogIcon.classList.remove("icon-cog-spin");
  },

  retrieveMapFromFireBase: function(index) {
    let nodePath = String("/App/Maps/" + index);
    App.sidebar.hide();
    App.busyWorkingIndicator(true);
    fbDatabase
      .ref(nodePath)
      .once("value")
      .then(snapshot => {
        const mapData = snapshot.val();
        App.clearLocalStorageMaps();
        App.setupGeoLayer(index, mapData);
        document.getElementById("opennewproject").style.display = "none";
        App.busyWorkingIndicator(false);
      })
      .catch(err => {
        console.log("Error! cannot retrieve mapdata from firebase:", err);
        App.busyWorkingIndicator(false);
      });
  },

  saveMapToLocalStorage: (myKey, mapData) => {
    localStorage.setItem("mapData." + myKey, JSON.stringify(mapData));
  },

  clearLocalStorageMaps: () => {
    const keys = App.getLocalStorageMapDataKey();
    keys.map(item => {
      localStorage.removeItem(item);
    });
  },

  clearLocalStorageLatestRelDataBackup: () => {
    localStorage.removeItem("latestRelDataBackup");
  },

  populateRelated: related => {
    if (!related) return;
    const relDataObject = {}; // to be replaced with State etc
    const relDataSyncObject = {}; // just to make sure it's initially empty
    App.State.relDataSyncStatus = {}; // make sure start with empty obj
    App.State.relatedData = {};
    const getLastRelDataItem = RelDataSet => {
      const sortedKeys = Object.keys(RelDataSet).sort();
      const lastDataItem = RelDataSet[sortedKeys[sortedKeys.length - 1]];
      return lastDataItem;
    };

    App.State.relatedData = Object.keys(related).map((relKey, index) => {
      const itemOb = {};
      const lastItem = getLastRelDataItem(related[relKey]);
      itemOb[relKey] = lastItem;
      relDataObject[relKey] = lastItem;
      relDataSyncObject[relKey] = true; // ie the feature's rela data is now synced
      return itemOb;
    });
    App.State.relatedData = relDataObject;
    App.State.relDataSyncStatus = relDataSyncObject;
    App.getRelDataFromLocalStorage(App.mapHash);
    return { relDataObject, relDataSyncObject };
  },

  getRelDataFromLocalStorage: mapHash => {
    const regex = "backup.relatedData." + mapHash + ".";
    const relDataKeys = Object.keys(localStorage).filter(item =>
      item.match(regex)
    );
    if (relDataKeys.length == 0) return;
    relDataKeys.map(key => {
      const item = JSON.parse(localStorage.getItem(key));
      const itemFeatureKey = key.split(regex)[1]; //  element 1 is str after split point
      const relDataFeaturePath =
        "App/Maps/" + mapHash + "/Related/" + itemFeatureKey;
      const localStorageTime = new Date(item.timestamp);
      const stateTime = new Date(
        App.State.relatedData[itemFeatureKey].timestamp
      );
      if (localStorageTime.getTime() > stateTime.getTime()) {
        console.log(
          "New item to upload! : ",
          itemFeatureKey,
          item.timestamp,
          "State Timestamp:",
          App.State.relatedData[itemFeatureKey].timestamp
        );
        App.updateFeatureRelatedState(itemFeatureKey, item);
        App.State.relDataSyncStatus[key] = false; // while item is sucessfully pushed to db
        RelatedData.pushRelatedDataRecord(
          relDataFeaturePath,
          itemFeatureKey,
          item
        );
        // Trigger push of item (does this update sync status and message automatically ? )
      }
    });
  },

  updateFeatureRelatedState: (featureKey, relatedData) => {
    // update a single feature's RelatedRecord State
    App.State.relatedData[featureKey] = relatedData;
  },

  setCompletedStyle: (
    featureOb,
    layerOb,
    objectID,
    ObjectType,
    isCompleted
  ) => {
    const featureKey = objectID + ObjectType; // strings
    if (App.State.relatedData[featureKey] !== undefined) {
      var relDataDate = new Date(
        Date.parse(App.State.relatedData[featureKey].timestamp)
      );
      const refDate = App.State.completedResetDate.getTime();
      var relDate = relDataDate.getTime();
      if (relDataDate > App.State.completedResetDate) {
        layerOb.setStyle({
          color: App.State.symbology.completedColor, // why not working??
          fillColor: App.State.symbology.completedFillColor,
          weight: App.State.symbology.completedLineWeight,
          radius: 1
        });
      }
    }
  },

  updateSidebarRelatedFromState: featureKey => {
    // update a feature's RelatedRecord State
    const reldiv = document.getElementById("latest-related");
    reldiv.innerHTML = "";
    const relSet = App.State.relatedData[featureKey];
    if (relSet) {
      Object.keys(relSet).map(key => {
        reldiv.innerHTML += key + ": " + relSet[key] + "<br>";
      });
    } else reldiv.innerHTML = "";
  },

  setupGeoLayer: (key, mapData) => {
    App.mapMeta = mapData.meta;
    App.mapHash = key;
    myMap.myLayerGroup.clearLayers(App.geoLayer);
    const featureLabelField = mapData.Meta
      ? mapData.Meta.LabelProperty
      : "Asset";
    App.populateRelated(mapData.Related); // need to catch when no related available
    App.geoLayer = L.geoJson(mapData.Geo, {
      onEachFeature: (feature, layer) => {
        let featureLabel = feature.properties[featureLabelField];
        App.setCompletedStyle(
          feature,
          layer,
          feature.properties["OBJECTID"],
          feature.geometry.type,
          true
        );

        let featureContentPopup = "";
        let addNoteButtonContent = "";
        featureContentPopup = `<div class="btn btn-primary large icon-pencil" onClick="App.whenGeoFeatureClicked();"><br>
          ${featureLabel} </div>`;
        if (feature.geometry.type == "LineString") {
          addNoteButtonContent = App.createPopupContentButtonSet(
            App.State.AddPointButtonsLines
          );
        }
        layer.bindPopup(featureContentPopup + addNoteButtonContent);
        layer.on("click", e => {
          if (App.selectedLayer !== layer) {
            if (App.selectedLayer) {
              App.unsetSelectedStyle();
            }
            App.State.symbology.beforeSelectedColor = layer.options.color;
            App.State.symbology.beforeSelectedFillColor =
              layer.options.fillColor;
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
      style: feature => {
        return {
          fillOpacity: 0.4,
          color: App.State.symbology.uncompletedColor,
          fillColor: App.State.symbology.uncompletedFillColor,
          weight: App.State.symbology.uncompletedLineWeight
        };
      },
      pointToLayer: (feature, latlng) => {
        return L.circleMarker(latlng, {
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

  unsetSelectedStyle: () => {
    App.selectedLayer.setStyle({
      color: App.State.symbology.beforeSelectedColor,
      fillColor: App.State.symbology.beforeSelectedFillColor,
      weight: App.State.symbology.beforeSelectedLineWeight
    });
  },

  movePolygonsToBack() {
    //move polygons to back
    App.geoLayer.eachLayer(layer => {
      if (layer.feature.geometry.type == "Polygon") {
        layer.bringToBack();
      }
    });
  },

  getLocalStorageMapDataKey: () => {
    // return keys that start with maoData
    return Object.keys(localStorage).filter(item => {
      return new RegExp("^mapData.*").test(item);
    });
  },

  loadMapDataFromLocalStorage: () => {
    // attempt to retrieve map from local
    const storageKey = App.getLocalStorageMapDataKey();
    if (storageKey.length == 0) {
      return;
    }
    const mapData = JSON.parse(localStorage.getItem(storageKey));
    const mapKey = storageKey[0].split("mapData.")[1];
    App.setupGeoLayer(mapKey, mapData);
  },

  addPointForm: buttonSetType => {
    const sidebarContent = `
    <h3>Add point </h3>
    type: ${buttonSetType}
    <p>  <textarea class="form-control" rows="2" id="add-point-comment" placeholder = "optional comment here ..."></textarea></p>
    <p><button class="btn btn-primary">Add photo</button></p><hr>
    <p><button class="btn btn-primary">Submit </button> </p>`;
    App.sidebar.setContent(sidebarContent);
    App.sidebar.show();
  },

  createPopupContentButtonSet: buttonSet => {
    let popupContent = `<div class='dropdown'>
    <button class='btn btn-primary left-spacing'>Add point ...
    </button> <div class='dropdown-content'>`;
    const createButtons = buttonSet.map(button => {
      popupContent += `<button onclick="App.addPointForm('${button.id}')"
       class="btn btn-primary dropdown-button" >${button.label}</button>`;
    });
    popupContent += `</div></div>`;
    return popupContent;
  },

  featureLabels: () => {
    const bounds = Map.getBounds();
    if (App.State.visableFeatures !== null) {
      App.State.visableFeatures.map(layer => {
        layer.unbindTooltip();
      });
      App.State.visableFeatures = [];
    }
    if (Map.getZoom() < 20) {
      return;
    }
    const redrawToolTips = () => {
      App.geoLayer.eachLayer(function(layer) {
        let relID = "";
        let hasRelData;
        try {
          relID =
            layer.feature.properties.OBJECTID + layer.feature.geometry.type;
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
          if (
            bounds.intersects(layer.getBounds()) ||
            bounds.contains(layer.getBounds())
          ) {
            App.State.visableFeatures.push(layer);
          }
        }
      });
    };
    redrawToolTips();
    App.State.visableFeatures.map(layer => {
      layer.bindTooltip(layer.feature.properties.Asset, {
        permanent: true,
        interactive: true
      });
    });
  }
};

window.App = App;

const RelatedData = {
  saveRelDataRecordToLocalStorage: (mapHash, featureKey, relatedData) => {
    localStorage.setItem(
      "backup.relatedData." + mapHash + "." + featureKey,
      JSON.stringify(relatedData)
    );
  },

  pushRelatedDataRecord: (relDataPath, featureKey, relatedRecord) => {
    fbDatabase
      .ref(relDataPath) // meed to move this constant into App.State
      .push(relatedRecord)
      .then(snap => {
        // if successfully synced

        const f_id = snap.parent.key; // fudege to retrieve feature key
        App.State.relDataSyncStatus[f_id] = true;
        App.updateRelDataSyncMsg(
          App.State.relDataSyncStatus[f_id],
          document.getElementById("rel-data-sync-message")
        );
        // Remove record from local storage
        const localStorageKey =
          "backup.relatedData." + App.mapHash + "." + featureKey;
        localStorage.removeItem(localStorageKey);
      })
      .catch(error => {
        console.log(
          "Problem with pushing related Data to Firebase: " + error.message
        );
        alert("Sorry - something went wrong - have you logged in etc?");
      });
  },

  submit: () => {
    // calculate key from OBJECTID + geometrytype
    RelatedData.featureKey = String(
      App.selectedFeature.properties.OBJECTID +
        App.selectedFeature.geometry.type
    );

    App.selectedFeature.geometry.type + "/";
    RelatedData.nodePath = String(
      "App/Maps/" + App.mapHash + "/Related/" + RelatedData.featureKey + "/"
    );
    const relatedRecord = {};
    relatedRecord.timestamp = Date();
    relatedRecord.user = firebase.auth().currentUser.displayName;
    relatedRecord.condition = document.getElementById(
      "related-data-condition"
    ).value;
    if (document.getElementById("related-data-comments").value) {
      relatedRecord.comments = document.getElementById(
        "related-data-comments"
      ).value;
    }
    if (document.getElementById("related-data-photo").value) {
      relatedRecord.photo = document.getElementById("related-data-photo").value;
    }
    const key = RelatedData.featureKey;
    App.State.relDataSyncStatus[key] = false; // while push promise is unresolved
    App.updateRelDataSyncMsg(
      App.State.relDataSyncStatus[key],
      document.getElementById("rel-data-sync-message")
    );
    App.updateFeatureRelatedState(key, relatedRecord);

    App.updateSidebarRelatedFromState(key);
    //RelatedData.backupUpRelStateToLocalStorage()
    RelatedData.saveRelDataRecordToLocalStorage(
      App.mapHash,
      key,
      relatedRecord
    );
    // RelatedData.backupUpRelStateToLocalStorage();
    RelatedData.pushRelatedDataRecord(RelatedData.nodePath, key, relatedRecord);
    document.getElementById("related-data-info").innerHTML = "Submitted!";
    App.State.symbology.beforeSelectedColor =
      App.State.symbology.completedColor;
    App.State.symbology.beforeSelectedFillColor =
      App.State.symbology.completedFillColor;
  },

  backupUpRelStateToLocalStorage: () => {
    localStorage.setItem(
      "latestRelDataBackup",
      JSON.stringify(App.State.relatedData)
    );
  },

  restoreRelStateFromLocalStorage: () => {
    if (localStorage.getItem("latestRelDataBackup") !== null) {
      App.State.relatedData = JSON.parse(
        localStorage.getItem("latestRelDataBackup")
      );
    } else {
      App.State.relatedData = {};
    }
  },

  addPhoto: function() {
    const el = document.getElementById("photo-capture");
    document.getElementById("related-data-photo").value = el.files[0].name;
  }
};

window.RelatedData = RelatedData;

function uploadMapToFirebase() {
  // grab the blobal Mapindex, then send gson layer up to node
  const nodePath = String("App/Maps/" + App.mapHash + "/Geo");

  fbDatabase
    .ref(nodePath)
    .set(App.geoLayer.toGeoJSON())
    .catch(function(error) {
      alert("Sorry you need to be logged in to do this");
    });
}

window.User = User;
function loadMyLayer(layerName) {
  // just for testing

  document.getElementById("open-new-project-button").style.display = "none";
  //loadFromPresetButtons(layerName);
  loadProject();

  function loadProject() {
    retriveMapIndexFromFirebase();

    function retriveMapIndexFromFirebase() {
      document.getElementById("message-area").innerHTML =
        "<p>waiting for network connection ...</p>";
      fbDatabase
        .ref("/App/Mapindex")
        .once("value")
        .then(snapshot => {
          document.getElementById("message-area").innerHTML = null;
          const el = document.getElementById("opennewproject");
          el.insertAdjacentHTML("afterBegin", "Open project");
          displayMapIndeces(snapshot.val());
        })
        .catch(error => {
          document.getElementById("message-area").innerHTML =
            "Sorry - " + error.message;
        });
    }

    function displayMapIndeces(mapIndexList) {
      const el = document.getElementById("opennewproject");
      el.insertAdjacentHTML("afterBegin", "Open project");
      Object.values(mapIndexList).map(item => {
        const btn = document.createElement("button");
        btn.setAttribute("value", item.mapID);
        btn.setAttribute("title", item.description);
        btn.className = "btn btn-primary open-project-button";
        const id = item.mapID;
        btn.addEventListener("click", e => {
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
  L.Control.watermark = L.Control.extend({
    onAdd: e => {
      const watermark = L.DomUtil.create("IMG", "watermark");
      watermark.src = "ORCL-logo-cropped.png";
      watermark.style.opacity = 0.3;
      return watermark;
    }
  });
  L.control.watermark = opts => {
    return new L.Control.watermark(opts);
  };
  L.control.watermark({ position: "bottomright" }).addTo(Map);
}

// --------------------------------- Offline Basemap Caching ------
const setupOfflineBaseLayerControls = () => {
  const myBaseLayerControls = [
    {
      object: myMap.streetsLayer,
      label: "colour streets",
      class: "streets-offline-control"
    },
    {
      object: myMap.greyscaleLayer,
      label: "Greyscale",
      class: "greyscale-offline-control"
    },

    {
      object: myMap.satLayer,
      label: "Satellite",
      class: "satellite-offline-control"
    }
  ];

  return myBaseLayerControls.map(layer => {
    return L.control.offline(layer.object, tilesDb, {
      saveButtonHtml: `<i id="${layer.object}" title="Save ${
        layer.label
      } layer to use offline" class="${layer.class} layer icon-download">${
        layer.label
      } </i>`,
      removeButtonHtml: '<i class="icon-trash " aria-hidden="true">Delete</i>',
      confirmSavingCallback: function(nTilesToSave, continueSaveTiles) {
        if (window.confirm("Save " + nTilesToSave + " background tiles?")) {
          continueSaveTiles();
        }
      },
      confirmRemovalCallback: function(continueRemoveTiles) {
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

L.Control.OfflineBaselayersControl = L.Control.extend({
  onAdd: function(map) {
    const OfflineBaselayersControl_div = L.DomUtil.create(
      "button",
      "btn btn-sm icon-download btn-info"
    );
    OfflineBaselayersControl_div.innerHTML = "Offline <br>Baselayers";
    OfflineBaselayersControl_div.title =
      "Save Background layers (tiles) for Offline use";
    OfflineBaselayersControl_div.onclick = () => {
      const offlineLayerCtrls = document.querySelectorAll(
        ".leaflet-control-offline"
      );
      if (offlineLayerCtrls[0].style.display == "none") {
        offlineLayerCtrls.forEach(el => (el.style.display = "block"));
      } else {
        offlineLayerCtrls.forEach(el => (el.style.display = "none"));
      }
    };
    return OfflineBaselayersControl_div;
  }
});
L.control.OfflineBaselayersControl = opts => {
  return new L.Control.OfflineBaselayersControl(opts);
};

const fireBaseconfig = {
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
const initApp = () => {
  App.State.relatedData = {};
  App.State.visableFeatures = [];
  App.State.symbology.beforeSelectedColor = {};
  App.State.symbology.beforeSelectedFillColor = {};
  firebase.initializeApp(fireBaseconfig);
  fbDatabase = firebase.database();

  // --------------------------------------- Main ---------------------

  Map = myMap.setupBaseLayer();
  // initDebugControl()
  initLogoWatermark();
  L.control.scale({ position: "bottomleft" }).addTo(Map);
  App.initSettingsControl();
  setupSideBar();
  initLocationControl();
  Map.doubleClickZoom.disable();
  L.control.OfflineBaselayersControl({ position: "topright" }).addTo(Map);
  offlineLayerControls = setupOfflineBaseLayerControls();
  offlineLayerControls.map(layer => {
    layer.addTo(Map);
  });
  document.querySelectorAll(".leaflet-control-offline").forEach(el => {
    el.style.display = "none";
  });
  //RelatedData.restoreRelStateFromLocalStorage()
  App.loadMapDataFromLocalStorage();
  window.alert("ORCL WebApp version 0.9.102");

  // ----- offline service worker -----------
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("sw.js")
        .then(registration => {})
        .catch(registrationError => {
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
  App.lc = L.control
    .locate({
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
    })
    .addTo(Map);
}

Map.on("locationfound", updateLatestLocation);

Map.on("click", e => {
  App.unsetSelectedStyle();
  App.selectedLayer = null;
  App.selectedFeature = null;
});

Map.on("dblclick", e => {
  const addPopupToClick = e => {
    L.popup()
      .setLatLng(e.latlng)
      .setContent(
        App.createPopupContentButtonSet(App.State.AddPointButtonsPoints)
      )
      .openOn(Map);
  };
  addPopupToClick(e);
});

Map.on("moveend", function() {
  App.featureLabels();
});

function updateLatestLocation(e) {
  App.State.latestLocation = e.latlng;
}
