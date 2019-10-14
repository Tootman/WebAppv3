import L from "leaflet";
//import firebase from "firebase";
import firebase from "firebase";
//import "firebase/auth";
//import "firebase/database";
import "./style.scss";
import "leaflet-offline";
//import localforage from "localforage";
import logoImg from "./ORCL-logo-cropped.png";
import commentMarkerIcon from "./comment-icon.png";
import breachMarkerIcon from "./breach-icon.png";
import hazardMarkerIcon from "./hazard-icon.png";
import unmappedMarkerIcon from "./unmapped-icon.png";
import MarkerIconShadow from "./marker-shadow.png";
//import leafletKnn from "leaflet-knn";
import fontello_ttf from "./fontello/font/fontello.ttf";
require("./L.Control.Sidebar");
require("./L.Control.Locate.min");
import { tilesDb } from "./offline-tiles-module.js";
import { User } from "./User.js";
import Pica from "pica";

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
    version: { number: "0.9.132", date: "14 Oct 2019" },
    settings: {
      map: {
        defaultCenter: [51.4384332, -0.3147865], // Ham
        defaultZoom: 18,
        maxZoom: 26,
        minZoom: 12,
        zoomDelta: 1
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
    projectsOb: {},
    projectConfig: {
      projectHash: "",
      mapHash: null,
      projectName: "",
      projectDescription: "",
      //completedResetDate: new Date(2000, 1, 1, 0, 0, 0, 0)
      completedResetDate: null
    },
    //projectHash:"",
    relatedData: {}, // init vall - could contain data for other maps as well as this one
    //mapHash: null,
    relatedDataMapHash: null,
    Markers: {},
    featureIdLookup: {},
    //firstReturnedRelDataCallback: true,
    latestLocation: null, // lat Lng
    currentLineaddMarkerLat: null,
    currentLineaddMarkerLng: null,
    relDataSyncStatus: {}, // objects holds relatedData sync status flag for each feature, TRUE if synced , False
    //surveyed: {}, // true when inspected ie completed , false when not-yet-instected
    //completedResetDate: new Date(2000, 1, 1, 0, 0, 0, 0),
    symbology: {
      uncompletedColor: "red",
      uncompletedfillColor: "red",
      uncompletedLineWeight: 8,
      completedLineWeight: 4,
      uncompletedRadius: 8,
      uncompletedFillOpacity: 0.4,
      uncompletedOpacity: 1,
      completedColor: "grey",
      completedFillColor: "grey",
      completedRadius: 5,
      completedOpacity: 0.4
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
        c6: "6 - (as new)",
        rm: "removed / not found",
        nv: "not visable",
        pv: "partially visable"
      }
    },
    markerTypes: {
      hazard: "hazard",
      unmappedAsset: "Unmapped asset",
      comment: "Comment / note",
      breach: "Barrier breach (hole in fence)"
    },

    relDataPhotoBlob: null,
    relDataPhotoName: null,
    markerIcons: {
      commentIcon: {},
      breachIcon: {},
      unmappedIcon: {},
      hazardIcon: {}
    }
  },

  populateInputOptions: (el, items) => {
    Object.keys(items).forEach(key => {
      const option = document.createElement("option");
      option.value = key;
      option.text = items[key];
      el.add(option);
    });
  },

  populateInfoPanel: state => {
    const projectInfoContent = `<h3>Project info </h3> <p>
    Name: ${state.projectConfig.projectName}<br>
    Description: ${state.projectConfig.projectDescription}<br>
    ResetDate: ${state.projectConfig.completedResetDate}<p>
    `;
    const mapInfoContent = ` <h3> Map info </h3><p>
    map name: ${state.projectConfig.mapName}
    </p>
    `;
    const sysInfo = `<h3>App info</h3>
    <p>
    Software version number: ${state.version.number} <br>
    Software version date: ${state.version.date}
    </p>
    `;
    return `${mapInfoContent}<hr>${projectInfoContent}<hr>${sysInfo}`;
  },

  updateRelDataSyncMsg: (syncStatus, el) => {
    if (el == null) return; //exit if element doesn yet exist ie of form is'nt open
    let msg = "";
    if (syncStatus == null) {
      msg = "";
    } else if (syncStatus == true) {
      msg = "successful sync";
    } else if (syncStatus == false) {
      msg = `Data not yet synced - please connect to network before closing this App`;
      if (document.getElementById("photo-capture").value != "") {
        msg += `<br> <span style="color:red"> Photo will be lost if panel closed
        before data sent </span>`;
      }
    }

    el.innerHTML = msg;

    el.style = "color:'CornflowerBlue' ";
  },

  whenGeoFeatureClicked: selectedFeature => {
    const fId = App.featureToKey(selectedFeature);
    const p = selectedFeature.properties;
    App.State.relDataPhotoBlob = null;
    App.State.relDataPhotoName = null;
    //document.getElementById("photo-capture").value = null;

    App.sidebar.setContent(document.getElementById("form-template").innerHTML);
    const titleDiv = document.getElementById("relatedform-title");
    titleDiv.innerHTML = `Asset: ${p.Asset}`;
    App.generateFeatureEditFormElements(
      p,
      document.getElementById("fields-section")
    );
    App.fetchOriginalDataPhoto(p, "related-orig-photo-img");
    if (!!p.photo) this.getPhoto(p.photo);
    App.updateRelDataSyncMsg(
      App.State.relDataSyncStatus[fId],
      document.getElementById("rel-data-sync-message")
    );
    App.updateSidebarRelatedFromState(
      fId,
      document.getElementById("latest-related"),
      App.State.relatedData
    );
    App.populateInputOptions(
      document.getElementById("related-data-condition"),
      App.State.formFields.condition
    );
    App.sidebar.show();
    // fetch and insert relData photo if exists

    if (!!App.State.relatedData[fId]) {
      if (!!App.State.relatedData[fId].photo) {
        const photoName = App.State.relatedData[fId].photo;
        const relPhotoEl = document.getElementById("related-photo-img");
        //const myTestVar = "Hello";
        const relPhotoPath = "/hounslow/300x400";
        //const relPhotoFileName = App.State.relDataPhotoName;
        RelatedData.fetchPhotoFromFBStorage(
          relPhotoEl,
          relPhotoPath,
          photoName
        );
      }
    }
  },

  generateFeatureEditFormElements: (props, sectionEl) => {
    sectionEl.innerHTML = null;
    const createFormItem = (parentTag, el, type, prop, value) => {
      const createWrapperDiv = () => {
        const x = document.createElement("tr");
        parentTag.appendChild(x);
        return x;
      };
      const createValueLabel = parent => {
        const x = document.createElement("td");
        x.innerHTML = value;
        parent.appendChild(x);
        if (type === "Checkbox") {
          x.checked = value;
        }
        parent.appendChild(x);
      };
      const createLabel = parent => {
        const x = document.createElement("td");
        x.innerHTML = prop;
        parent.appendChild(x);
      };
      const createRow = parent => {
        const x = document.createElement("div");
        x.innerHTML = `${prop}  ${value}<br>`;
        parent.appendChild(x);
      };
      const wrapperDiv = createWrapperDiv(parentTag);
      createLabel(wrapperDiv, el, type, prop, value);
      createValueLabel(wrapperDiv, el, type, prop, value);
    };
    const createFormItems = Object.keys(props).forEach(key => {
      const propType = typeof props[key];
      if (propType === "string" || propType === "number") {
        createFormItem(sectionEl, "Input", "text", key, props[key]);
      } else if (propType === "boolean") {
        createFormItem(sectionEl, "Input", "Checkbox", key, props[key]);
      }
    });
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
    L.Control.settingsControl = L.Control.extend({
      onAdd: e => {
        const settingsControl_div = L.DomUtil.create(
          "button",
          "main-button-control btn btn-lg btn-danger icon-cog"
        );
        settingsControl_div.innerHTML = "";
        settingsControl_div.title = "Settings";
        settingsControl_div.onclick = () => {
          App.sidebar.setContent(
            document.getElementById("settings-template").innerHTML
          );
          User().initLoginForm();
          document
            .getElementById("open-new-project-button")
            .addEventListener("click", function() {
              loadMyLayer("dummy");
            });
          const infoEl = document.getElementById("map-info-section");
          infoEl.innerHTML = App.populateInfoPanel(App.State);
          App.sidebar.show();
        };
        return settingsControl_div;
      }
    });
    L.control.settingsControl = opts => {
      return new L.Control.settingsControl(opts);
    };
    L.control
      .settingsControl({
        position: "bottomleft"
      })
      .addTo(Map);
  },

  busyWorkingIndicator: busyWorking => {
    const cogIcon = document.getElementsByClassName("icon-cog")[0];
    busyWorking
      ? cogIcon.classList.add("icon-cog-spin")
      : cogIcon.classList.remove("icon-cog-spin");
  },

  addMarkerToMarkersLayer: (
    lat,
    lng,
    content,
    photoFileName,
    contentType,
    myThis
  ) => {
    const popup = L.popup();
    popup.setContent(content);
    const myMarker = new App.customMarker([lat, lng], {
      photoFileName: photoFileName,
      //dataPath: dataPath,
      contentType: contentType
    });
    switch (myMarker.options.contentType) {
      case "breach":
        myMarker.options.icon = App.State.markerIcons.breachIcon;
        break;
      case "unmappedAsset":
        myMarker.options.icon = App.State.markerIcons.unmappedIcon;
        // code block
        break;
      case "hazard":
        myMarker.options.icon = App.State.markerIcons.hazardIcon;
        break;
      case "comment":
        myMarker.options.icon = App.State.markerIcons.commentIcon;
        break;
      default:
        myMarker.options.icon = App.State.markerIcons.commentIcon;
    }

    myMarker.addTo(App.MarkersLayer);
    const markerLayerId = myMarker._leaflet_id;
    myMarker.layerId = myMarker._leaflet_id;
    myMarker
      .bindPopup(popup)
      .on("click", function(e) {
        App.markerClickCallback(e);
        //console.log("bindPopup onclick called!", e, markerLayer);
        document
          .querySelector(".deleteMarkerBtn")
          .addEventListener("click", e => {
            App.markerOnDeleteListener(
              e,
              markerLayerId,
              myMarker.options.photoFileName
            );
          });
      })
      .on("popupclose", function(e) {
        document
          .querySelector(".deleteMarkerBtn")
          .removeEventListener("click", e => {
            App.markerOnDeleteListener(e, markerLayerId, photoFileName);
          });
      });
  },

  markerClickCallback: e => {
    const parentEl = document.getElementById("marker-photo-img");
    const path = "/hounslow/300x400";
    const photoId = e.target.options.photoFileName;
    if (!!photoId) {
      RelatedData.fetchPhotoFromFBStorage(parentEl, path, photoId);
    }
  },

  generatePopupPropSet: marker => {
    return Object.keys(marker.properties)
      .map(item => {
        return `${item}: ${marker.properties[item]}`;
      })
      .join("<br>");
  },

  setupMarkersLayer: () => {
    App.MarkersLayer = new L.layerGroup();
    App.MarkersLayer.addTo(Map);
  },

  removeMarkersLayerMarkers: () => {
    if (!!App.MarkersLayer) App.MarkersLayer.clearLayers();
  },

  retrieveMapFromFireBase: function(mapHash, projectHash) {
    const currentRelatedRef = `/App/Maps/${
      App.State.relatedDataMapHash
    }/Related/`;
    fbDatabase.ref(currentRelatedRef).off();
    const currentMarkersRef = `/App/Maps/${
      App.State.projectConfig.mapHash
    }/Markers/`;
    fbDatabase.ref(currentMarkersRef).off();
    // remove ALL existing listeners from current map
    let nodePath = `/App/Maps/${mapHash}`;
    //App.State.completedResetDate = new Date(App.State.projectsOb.)
    App.State.projectConfig.projectName =
      App.State.projectsOb[projectHash].name;
    App.State.projectConfig.projectDescription =
      App.State.projectsOb[projectHash].description;
    App.State.projectConfig.completedResetDate =
      App.State.projectsOb[projectHash].completedResetDate;
    App.State.projectConfig.projectHash = projectHash;
    App.State.projectConfig.mapName =
      App.State.projectsOb[projectHash].mapSet[mapHash];
    App.markersLayer = null;
    App.sidebar.hide();
    App.busyWorkingIndicator(true);
    fbDatabase
      .ref(nodePath)
      .once("value")
      .then(snapshot => {
        const mapData = snapshot.val();
        App.clearLocalStorageMaps();
        try {
          App.State.relatedDataMapHash = App.State.projectConfig.mapHash; //cbt todo
        } catch (err) {
          App.State.relatedDataMapHash = null;
        }
        App.setupGeoLayer(mapHash, mapData);
        App.removeMarkersLayerMarkers();
        //App.setupMarkersLayer(mapData);
        document.getElementById("opennewproject").style.display = "none";
        App.busyWorkingIndicator(false);

        try {
          App.setupAddRelatedRecordEventListener(
            App.State.projectConfig.mapHash
          );
        } catch (err) {
          console.log("set relatedData callbacks failed");
        }

        try {
          App.setupFbAddMarkerNodeEventCallback(
            App.State.projectConfig.mapHash
          );
          //console.log("setUpMarkersCallback - from retrieve from Firebase");
        } catch (err) {}
      })
      .catch(err => {
        console.log("Error! cannot retrieve mapdata from firebase:", err);
        App.busyWorkingIndicator(false);
      });
  },

  saveMapToLocalStorage: (myKey, mapData) => {
    try {
      localStorage.setItem("mapData." + myKey, JSON.stringify(mapData));
    } catch (e) {
      alert("couldnt save map to localStorage - maybe too big ");
    }
    try {
      localStorage.setItem(
        "projectConfig",
        JSON.stringify(App.State.projectConfig)
      );
    } catch (e) {
      alert("couldnt save project config to localStorage");
    }
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
  propsTotabularContent: myOb => {
    return contentStr;
  },
  pushNewMarkerToFirebase: ({ mapID, json }) => {
    const refPath = `App/Maps/${mapID}/Markers/`;

    fbDatabase
      .ref(refPath)
      .push(json)
      .then(snap => {
        //console.log("pushed new marker!");
      })
      .then(snap => {
        App.sendThumbnailToCloudStorage({
          blob: App.State.relDataPhotoBlob,
          storagePathAndName: `hounslow/300x400/${App.State.relDataPhotoName}`,
          photoInputId: "marker-photo-capture",
          blobNamePath: App.State,
          blobNameKey: "relDataPhotoBlob",
          failMessage:
            "photo not uploaded - you need to upload it manually  from your device"
        });
      })
      .then(res => {
        App.sidebar.hide();
      });
  },

  deleteThumbnailFromCloudStorage: ({ path, key }) => {
    console.log("delete: ", path, key);
    const pathAndFileName = `${path}/${key}`;
    const fbFileRef = firebase
      .storage()
      .ref(pathAndFileName)
      .delete();
    //const fbFileRef = storageRef.child(key);
    //fbFileRef.delete();
  },

  sendThumbnailToCloudStorage: ({
    blob,
    storagePathAndName,
    photoInputId,
    blobNamePath,
    blobNameKey,
    failMessage
  }) => {
    console.log("sendThumbnailToCloudStorage");
    if (!!blob) {
      //document.getElementById("related-data-photo").value = relPhotoEl.files[0].name;
      const storageRef = firebase.storage().ref();
      const fbFileRef = storageRef.child(storagePathAndName);

      // see orcl-refactoring-photo-put-and-get.txt for refactor
      return fbFileRef.put(blob).then(snapshot => {
        //console.log("Uploaded a marker photo!");
        document.getElementById(photoInputId).value = null;
        //document.getElementById("related-data-photo").value = null;
        blob.value = null;
        blobNamePath[blobNameKey] = null;
        App.sidebar.hide();
      });
    }
  },

  generateNewPointGeoJson: ({
    type, // point/ Marker type
    lat,
    lng,
    user,
    timeStamp,
    photo,
    comment
  }) => {
    const properties = {};
    properties.user = user;
    properties.timeStamp = timeStamp;
    properties.comment = comment;
    properties.photo = photo;
    properties.type = type;
    const geometry = {};
    geometry.coordinates = [lng, lat];
    geometry.type = "Point";
    const feature = {};
    feature.type = "Feature";
    feature.geometry = geometry;
    feature.properties = properties;
    return feature;
  },
  /*
  populateRelated: related => {
    // this method is now redundent?
    if (!related) return;
    const relDataObject = {}; // to be replaced with State etc
    const relDataSyncObject = {}; // just to make sure it's initially empty
    const getLastRelDataItem = RelDataSet => {
      const sortedKeys = Object.keys(RelDataSet).sort();
      const lastDataItem = RelDataSet[sortedKeys[sortedKeys.length - 1]];
      return lastDataItem;
    };
    App.State.relatedData = Object.keys(related).map((relKey, index) => {
      const itemOb = {};
      const lastItem = getLastRelDataItem(related[relKey]);
      itemOb[relKey] = lastItem;
      itemOb.childKey = relKey;
      relDataObject[relKey] = lastItem;
      relDataSyncObject[relKey] = true; // ie the feature's rela data is now synced
      return itemOb;
    });
    App.getRelDataFromLocalStorage(App.State.projectConfig.mapHash);
    return {
      relDataObject,
      relDataSyncObject
    };
  },
 */
  getRelDataFromLocalStorage: mapHash => {
    console.log("fetching related from local storage");
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

      //const localStorageTime = new Date(item.timestamp);
      //const stateTime = new Date(
      //  App.State.relatedData[itemFeatureKey].timestamp
      // );
      //if (localStorageTime.getTime() > stateTime.getTime()) {
      //    App.updateFeatureRelatedState(itemFeatureKey, item);
      //    App.State.relDataSyncStatus[key] = false; // while item is sucessfully pushed to db

      RelatedData.pushRelatedDataRecord(
        relDataFeaturePath,
        itemFeatureKey,
        item
      );

      // Trigger push of item (does this update sync status and message automatically ? )
      //}
    });
  },

  updateFeatureRelatedState: (featureKey, relatedData, childKey) => {
    if (relatedData != null) {
      App.State.relatedData[featureKey] = relatedData;
      App.State.relatedData[featureKey].childKey = childKey;
    } else {
      // related data for this feature is romoved
      delete App.State.relatedData[featureKey];
    }
  },

  setCompletedStyle: ({
    feature,
    layer,
    isCompleted,
    completedResetDate = new Date(App.State.projectConfig.completedResetDate)
  }) => {
    const symbology = App.State.symbology;
    const relatedData = App.State.relatedData;
    const featureKey = App.featureToKey(feature);
    if (relatedData[featureKey] !== undefined) {
      var relDataDate = new Date(Date.parse(relatedData[featureKey].timestamp));
      const refDate = completedResetDate.getTime();
      var relDate = relDataDate.getTime();
      if (relDataDate > completedResetDate) {
        layer.setStyle({
          color: symbology.completedColor, // why not working??
          fillColor: symbology.completedFillColor,
          weight: symbology.completedLineWeight,
          radius: 8,
          opacity: 0.3
        });
      }
    }
  },

  updateSidebarRelatedFromState: (featureKey, reldiv, relatedData) => {
    // update a feature's RelatedRecord State
    let relDivContent = "";
    const relSet = relatedData[featureKey];
    const delRelatedSection = document.getElementById(
      "delete-latest-rel-data-section"
    );
    if (relSet) {
      relDivContent = `<h4>Latest related data</h4>
<table id="reldata-fields-section" class="table table-sm table-striped">`;
      Object.keys(relSet).map(key => {
        relDivContent += `<tr><td>${key}:</td> <td>${relSet[key]}</td></tr>`;
      });
      relDivContent += `</table>`;
      delRelatedSection.style.display = "block";
    } else {
      relDivContent = "no related data available";
      delRelatedSection.style.display = "none";
    }
    reldiv.innerHTML = relDivContent;
  },

  setupGeoLayer: (key, mapData) => {
    // TODO: major refactor needed to make functional
    App.mapMeta = mapData.meta;
    App.State.projectConfig.mapHash = key;
    myMap.myLayerGroup.clearLayers(App.geoLayer);
    App.State.featureIdLookup = {};
    const featureLabelField = mapData.Meta
      ? mapData.Meta.LabelProperty
      : "Asset";

    const setupFeatureToObjectIdLookup = () => {
      Object.keys(App.geoLayer._layers).map(layerId => {
        const layer = App.geoLayer._layers[layerId];
        const key = App.featureToKey(layer.feature);
        App.State.featureIdLookup[key] = layerId;
      });
    };

    App.geoLayer = L.geoJson(mapData.Geo, {
      onEachFeature: (feature, layer) => {
        let featureLabel = feature.properties[featureLabelField];
        App.setCompletedStyle({
          feature: feature,
          layer: layer,
          isCompleted: true
        });

        let featureContentPopup = "";
        let addNoteButtonContent = "";
        featureContentPopup = `<div class="btn btn-primary large icon-pencil" onClick="App.whenGeoFeatureClicked(App.selectedFeature);"><br>
          ${featureLabel} </div>`;
        if (feature.geometry.type == "LineString" || "Polygon") {
          const buttonsOb = App.createPopupContentButtonSet({
            buttonSet: App.State.markerTypes
          });
          addNoteButtonContent = buttonsOb.popupContent;
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
            App.State.currentLineaddMarkerLat = e.latlng.lat;
            App.State.currentLineaddMarkerLng = e.latlng.lng;
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
          fillOpacity: App.State.symbology.uncompletedFillOpacity,
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
    setupFeatureToObjectIdLookup();
    Map.fitBounds(App.geoLayer.getBounds());
    App.movePolygonsToBack();
    App.saveMapToLocalStorage(key, mapData);
  },

  unsetSelectedStyle: () => {
    if (!App.selectedLayer) return;
    App.selectedLayer.setStyle({
      color: App.State.symbology.beforeSelectedColor,
      fillColor: App.State.symbology.beforeSelectedFillColor,
      weight: App.State.symbology.beforeSelectedLineWeight
    });
  },

  movePolygonsToBack() {
    App.geoLayer.eachLayer(layer => {
      if (layer.feature.geometry.type == "Polygon") {
        layer.bringToBack();
      }
    });
  },

  getLocalStorageMapDataKey: () => {
    // return keys that start with mapData
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

    try {
      App.State.projectConfig = JSON.parse(
        localStorage.getItem("projectConfig")
      );
    } catch (err) {
      console.log("couldn't retrieve projectConfig from localStorage");
    }

    try {
      App.State.relatedDataMapHash = mapData.config.relDataMapHash; // todo CBT - now from child map so rename to parentMapHash
    } catch (err) {
      App.State.relatedDataMapHash = null;
    }
    const mapKey = storageKey[0].split("mapData.")[1];
    App.setupGeoLayer(mapKey, mapData);
    try {
      App.setupAddRelatedRecordEventListener(App.State.projectConfig.mapHash);
    } catch (err) {
      console.log("failed to set RelatedData listeners");
    }
    try {
      App.setupFbAddMarkerNodeEventCallback(App.State.projectConfig.mapHash);
    } catch (err) {
      console.log("failed to set Markers listeners");
    }
    App.getRelDataFromLocalStorage(App.State.projectConfig.mapHash);
  },

  addMarkerForm: buttonSetType => {
    const options = {};
    App.State.relDataPhotoBlob = null;
    App.State.relDataPhotoName = null;
    const sidebarContent = `
    <h3>Add marker  - ${buttonSetType}</h3>
    type: <input type="hidden" id="addMarker-type" readonly value = "${buttonSetType}">

    <p>  <textarea class="form-control" rows="2" id="addMarker-comment" placeholder = "Comment / further info ..."></textarea></p>
    <canvas id="add-point-canvas" style="display:none;margin:auto"></canvas>
   <p><label for="marker-photo-capture" id="marker-take-photo-btn" class="btn btn-sm btn-warning">Take photo</label>
        <input id="marker-photo-capture" onChange="RelatedData.addMarkerPhoto()" name="marker-photo-capture" style="visibility:hidden;" capture="camera" accept="image/*" type="file"/></p>
    <p><button class="btn btn-primary" onclick="App.submitAddButtonForm()">
    Submit </button> </p>`;
    App.sidebar.setContent(sidebarContent);
    App.sidebar.show();
  },

  submitAddButtonForm: () => {
    const type = document.getElementById("addMarker-type");
    const comment = document.getElementById("addMarker-comment");
    const photo = App.State.relDataPhotoName;
    App.State.relDataPhotoName;
    const timeStamp = new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric"
    });
    const geojsonOb = App.generateNewPointGeoJson({
      type: type.value,
      lat: App.State.currentLineaddMarkerLat,
      lng: App.State.currentLineaddMarkerLng,
      user: firebase.auth().currentUser.displayName,
      comment: comment.value,
      photo: photo,
      timeStamp: timeStamp
    });
    App.pushNewMarkerToFirebase({
      mapID: App.State.projectConfig.mapHash,
      json: geojsonOb
    });
  },

  createPopupContentButtonSet: ({ markerTypes }) => {
    let popupContent = `<div class='dropdown'>
    <button class='btn btn-primary left-spacing'>Add marker ...
    </button> <div class='dropdown-content'>0.`;
    const createButtons = Object.entries(App.State.markerTypes).map(
      markerType => {
        popupContent += `<button onclick="App.addMarkerForm('${markerType[0]}')"
       class="btn btn-primary dropdown-button" >${markerType[1]}</button>`;
      }
    );
    popupContent += `</div></div>`;
    return {
      popupContent
    };
  },

  featureLabels: () => {
    // TODO: refactor to functional
    const bounds = Map.getBounds();
    //console.log("zoom:", Map.getZoom());
    if (App.State.visableFeatures !== null) {
      App.State.visableFeatures.map(layer => {
        layer.unbindTooltip();
      });
      App.State.visableFeatures = [];
    }
    if (Map.getZoom() < 19) {
      //was 19
      return;
    }

    const redrawToolTips = () => {
      App.geoLayer.eachLayer(layer => {
        let relID = "";
        let hasRelData;
        try {
          relID = App.featureToKey(layer.feature);
          hasRelData = App.State.relatedData[relID];
        } catch (err) {
          relID = undefined;
          hasRelData = false;
        }

        //if (layer.getLatLng && !hasRelData) {
        if (layer.getLatLng) {
          if (bounds.contains(layer.getLatLng())) {
            if (
              layer.options.color == App.State.symbology.uncompletedColor ||
              layer.options.fillColor ==
                App.State.symbology.uncompletedfillColor
            ) {
              App.State.visableFeatures.push(layer);
              //console.log("point layer pushed!");
            }
          }
          //} else if (layer.getBounds && !hasRelData) {
        } else if (layer.getBounds) {
          if (
            bounds.intersects(layer.getBounds()) ||
            bounds.contains(layer.getBounds())
          ) {
            if (
              layer.options.color == App.State.symbology.uncompletedColor ||
              layer.options.fillColor ==
                App.State.symbology.uncompletedfillColor
            ) {
              App.State.visableFeatures.push(layer);
            }
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
  },
  setupFbAddMarkerNodeEventCallback: mapHash => {
    let firstReturnedSnap = true;
    const dbRef = fbDatabase.ref(`/App/Maps/${mapHash}/Markers/`);
    dbRef.on("child_added", (snapshot, prevChildKey) => {
      const json = snapshot.val();
      const markerKey = snapshot.key;
      //console.log("path:", dbRef + "/" + snapshot.key);
      const markerContent = `<h4>${
        json.properties.type
      }</h4><hr> <img id="marker-photo-img"></img><p>${App.generatePopupPropSet(
        json
      )}</p><p><button class="btn btn-danger btn-sm deleteMarkerBtn"  value = "${markerKey}"  >Delete</button></p>`;
      App.addMarkerToMarkersLayer(
        json.geometry.coordinates[1],
        json.geometry.coordinates[0],
        markerContent,
        json.properties.photo,
        json.properties.type,
        this
      );
    });
  },

  markerOnDeleteListener: (e, markerLayerId, photoFileName) => {
    const result = confirm("Delete this Marker?");
    //const leafletId = sourceThis._leaflet_id;
    const markerKey = e.target.value;
    //console.log("leafletId:", markerLayerId);
    if (result != true) {
      return;
    }
    console.log(
      "will delete:",
      `/App/Maps/${App.State.projectConfig.mapHash}/Markers/${markerKey}`,
      markerKey
    );

    const refPath = `/App/Maps/${
      App.State.projectConfig.mapHash
    }/Markers/${markerKey}`;
    fbDatabase
      .ref(refPath)
      .set(null)
      .then(() => {
        App.MarkersLayer.removeLayer(markerLayerId);
      });

    App.deleteThumbnailFromCloudStorage({
      path: "hounslow/300x400/",
      key: photoFileName
    });
  },

  setFeatureSymbologyToCompleted: featureKey => {
    const layer = App.geoLayer.getLayer(App.State.featureIdLookup[featureKey]);
    try {
      App.setCompletedStyle({
        layer: layer,
        feature: layer.feature,
        isCompleted: true
      });
    } catch (err) {}
  },

  setupAddRelatedRecordEventListener: myRelDataMapHash => {
    // triggered on NewRelRecord in FB. Creates Ob, or overwtires Ob when already exists

    const dbRef = fbDatabase.ref(`/App/Maps/${myRelDataMapHash}/Related/`);
    const handleRelatedCallback = snapshot => {
      const snap = snapshot.val();
      /*
      const record =
        snap[
          Object.keys(snap)
            .sort()
            .reverse()[0]
        ];
*/
      const latestChildKey = Object.keys(snap)
        .sort()
        .reverse()[0];
      const record = snap[latestChildKey]; // need to rename vars - confusing
      //console.log("latestChildKey, record", latestChildKey, record);
      App.updateFeatureRelatedState(snapshot.key, record, latestChildKey);
      App.setFeatureSymbologyToCompleted(snapshot.key);
    };
    fbDatabase.ref(dbRef).on("child_added", (snapshot, prev) => {
      handleRelatedCallback(snapshot);
    });

    fbDatabase.ref(dbRef).on("child_changed", snapshot => {
      handleRelatedCallback(snapshot);
      //Map.closePopup();
    });
    fbDatabase.ref(dbRef).on("child_removed", snapshot => {
      //handleRelatedCallback(snapshot);
      App.updateFeatureRelatedState(snapshot.key, null, null);
      //App.setFeatureSymbologyToCompleted(snapshot.key); CTBC hack -
      const layer = App.geoLayer.getLayer(
        App.State.featureIdLookup[snapshot.key]
      );
      layer.setStyle({
        color: App.State.symbology.uncompletedColor, // why not working??
        fillColor: App.State.symbology.uncompletedfillColor,
        weight: App.State.symbology.uncompletedLineWeight,
        radius: App.State.symbology.uncompletedRadius,
        opacity: App.State.symbology.uncompletedOpacity
      });
      (App.State.symbology.beforeSelectedColor =
        App.State.symbology.uncompletedColor),
        (App.State.symbology.beforeSelectedFillColor =
          App.State.symbology.uncompletedfillColor),
        (App.State.symbology.beforeSelectedLineWeight =
          App.State.symbology.uncompletedLineWeight);

      console.log("removed callback called", snapshot);
      Map.closePopup();
    });
  },
  featureToKey: feature => {
    return `${feature.properties.OBJECTID}${feature.geometry.type}`;
  },

  fetchOriginalDataPhoto: (props, imgElId) => {
    //console.log("fetchOriginalDataPhoto called!", props);
    const photoPath = "/hounslow/300x400";
    const imgEl = document.getElementById(imgElId);
    if (!props.Photo) {
      return;
    }
    if ((props.Photo == null) | (props.Photo == "")) {
      return;
    }
    console.log("Existing Photo:", props.Photo);
    RelatedData.fetchPhotoFromFBStorage(imgEl, photoPath, props.Photo);
  }
  // end of App ob
};

window.App = App;

const RelatedData = {
  saveRelDataRecordToLocalStorage: (mapHash, featureKey, relatedData) => {
    localStorage.setItem(
      "backup.relatedData." + mapHash + "." + featureKey,
      JSON.stringify(relatedData)
    );
  },

  fetchPhotoFromFBStorage: (parentEl, path, photoId) => {
    const storage = firebase.storage();
    const pathRef = storage.ref(path);
    pathRef
      .child(photoId)
      .getDownloadURL()
      .then(url => {
        fetch(url)
          .then(response => {
            return response.blob();
          })
          .then(imageBlob => {
            parentEl.src = URL.createObjectURL(imageBlob);
            parentEl.style.width = "100%";
          });
      });
  },

  pushRelatedDataRecord: (relDataPath, featureKey, relatedRecord) => {
    fbDatabase
      .ref(relDataPath) // need to move this constant into App.State
      .push(relatedRecord)
      .then(snap => {
        // if successfully synced
        const f_id = snap.parent.key; // fudege to retrieve feature key
        App.State.relDataSyncStatus[f_id] = true;
        App.sidebar.hide();
        // Remove record from local storage
        const localStorageKey =
          "backup.relatedData." +
          App.State.projectConfig.mapHash +
          "." +
          featureKey;
        localStorage.removeItem(localStorageKey);
      })
      .then(snap => {
        App.sendThumbnailToCloudStorage({
          blob: App.State.relDataPhotoBlob,
          storagePathAndName: `hounslow/300x400/${App.State.relDataPhotoName}`,
          //storagePathAndName: `test/300x400/${App.State.relDataPhotoName}`,
          photoInputId: "photo-capture",
          blobNamePath: App.State,
          blobNameKey: "relDataPhotoBlob",
          failMessage:
            "photo not uploaded - you need to upload it manually  from your device"
        });
      })
      .then(res => {
        App.sidebar.hide();
      });
  },

  submit: () => {
    // validate condition inputbox
    const conditionInputEl = document.getElementById("related-data-condition");
    if (conditionInputEl.value == "null") {
      conditionInputEl.focus();
      return;
    }

    RelatedData.featureKey = App.featureToKey(App.selectedFeature);
    RelatedData.nodePath = `App/Maps/${
      App.State.projectConfig.mapHash
    }/Related/${RelatedData.featureKey}/`;
    const relatedRecord = {};
    const timeStamp = new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric"
    });
    relatedRecord.timestamp = timeStamp;
    relatedRecord.user = firebase.auth().currentUser.displayName;
    relatedRecord.condition = document.getElementById(
      "related-data-condition"
    ).value;
    if (document.getElementById("related-data-comments").value) {
      relatedRecord.comments = document.getElementById(
        "related-data-comments"
      ).value;
    }
    if (App.State.relDataPhotoName) {
      relatedRecord.photo = App.State.relDataPhotoName;
    }

    const key = RelatedData.featureKey;
    App.State.relDataSyncStatus[key] = false; // while push promise is unresolved
    App.updateRelDataSyncMsg(
      App.State.relDataSyncStatus[key],
      document.getElementById("rel-data-sync-message")
    );
    App.updateFeatureRelatedState(key, relatedRecord);
    App.updateSidebarRelatedFromState(
      key,
      document.getElementById("latest-related"),
      App.State.relatedData
    );
    //RelatedData.backupUpRelStateToLocalStorage()
    RelatedData.saveRelDataRecordToLocalStorage(
      App.State.projectConfig.mapHash,
      key,
      relatedRecord
    );
    // RelatedData.backupUpRelStateToLocalStorage();

    delete relatedRecord.childKey; // strip off childKey if present, before sending
    RelatedData.pushRelatedDataRecord(RelatedData.nodePath, key, relatedRecord);
    //document.getElementById("related-data-info").innerHTML = "Submitted!";
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

  addMarkerPhoto: () => {
    const canvas = document.getElementById("add-point-canvas");
    const imgInputEl = document.getElementById("marker-photo-capture");
    RelatedData.addPhoto(
      canvas,
      App.State,
      imgInputEl,
      "relDataPhotoBlob",
      "relDataPhotoName"
    );
  },

  addRelatedPhoto: () => {
    const canvas = document.getElementById("myCanvas");
    const imgInputEl = document.getElementById("photo-capture");
    RelatedData.addPhoto(
      canvas,
      App.State,
      imgInputEl,
      "relDataPhotoBlob",
      "relDataPhotoName"
    );
  },

  addPhoto: (myC, state, imgInputBtnEl, blobProp, blobNameProp, ifProp) => {
    const pica = Pica();
    myC.style.display = "block";
    const myImg = new Image();
    const myImage = imgInputBtnEl.files[0];
    const fr = new FileReader();
    fr.readAsDataURL(myImage);
    fr.addEventListener("load", () => {
      const img = new Image();
      img.src = fr.result;
      img.onload = () => {
        const newWidth = 300; // ie fixed width px
        const sizeRatio = newWidth / img.width;
        myC.width = newWidth;
        myC.height = img.height * sizeRatio;
        pica
          .resize(img, myC, {
            unsharpAmount: 80,
            unsharpRadius: 0.6,
            unsharpThreshold: 2
          })
          .then(result => pica.toBlob(result, "image/jpeg", 0.7))
          .then(result => {
            //document.getElementById("dest-photo").src = URL.createObjectURL(
            //  result
            //);
            state[blobNameProp] = imgInputBtnEl.files[0].name;
            state[blobProp] = result;
          })
          .catch(error => {
            console.log("error:", error);
          });
      };
    });
  },

  deleteLatestRelated: params => {
    //console.log("deleteLatestRelated called!", params);
    // App.State.relatedData[App.selectedFeature.properties.OBJECTID + App.selectedFeature.geometry.type].childKey

    // need path, childkey, and photo path, and photo id
    /*
    const refPath = `/App/Maps/${
      App.State.projectConfig.mapHash
    }/Related/${params.childNodeKey}`;
*/

    const deleteNodePath = `${params.relDataPath}/${params.childNodeKey}`;
    console.log("delete: ", params.feature);
    const myFeature = params.feature;
    fbDatabase
      .ref(deleteNodePath)
      .set(null)
      .then(() => {
        App.sidebar.hide();
        // delete App.State.relatedData[myFeature];
        console.log("delete relDataPath:", myFeature);
        //App.MarkersLayer.removeLayer(markerLayerId);
        // update App.State, map, panel, listener
      })
      .catch(error => {
        console.log("delete catch error:", error);
      });

    if (params.photo == null) {
      return;
    }

    console.log("deletePhoto:", `${params.photoPath}/${params.photo}`);
    App.deleteThumbnailFromCloudStorage({
      path: params.photoPath,
      key: params.photo
    });
  },

  onLatestRelatedButtonClick: () => {
    //console.log("deleteLatestRe:lated called!");
    const result = confirm(
      "Are you sure you want to delete this related data?"
    );
    if (result != true) {
      return;
    }
    const featureKey =
      App.selectedFeature.properties.OBJECTID +
      App.selectedFeature.geometry.type;

    const childKey = App.State.relatedData[featureKey].childKey;
    const relDataPath = `/App/Maps/${
      App.State.projectConfig.mapHash
    }/Related/${featureKey}`;
    const photoName = App.State.relatedData[featureKey].photo;
    RelatedData.deleteLatestRelated({
      relDataPath: relDataPath,
      childNodeKey: childKey,
      photo: photoName,
      feature: featureKey,
      photoPath: "hounslow/300x400"
    });
  }
};

window.RelatedData = RelatedData;

window.User = User;
const loadMyLayer = layerName => {
  document.getElementById("open-new-project-button").style.display = "none";
  loadProject();

  function loadProject() {
    const retrieveProjectsFromFirebase = () => {
      document.getElementById(
        "message-area"
      ).innerHTML = `<p>waiting for network connection ...</p>`;
      fbDatabase
        .ref("/App/Projects")
        .once("value")
        .then(snapshot => {
          document.getElementById("message-area").innerHTML = null;
          const el = document.getElementById("opennewproject");
          App.State.projectsOb = snapshot.val();
          displayProjectList(snapshot.val());
        })
        .catch(error => {
          document.getElementById("message-area").innerHTML =
            "Sorry - " + error.message;
        });
    };

    const displayProjectList = projectsOb => {
      // console.log("Display projects ...", projectListOb)
      const el = document.getElementById("opennewproject");
      //el.insertAdjacentHTML("afterBegin", "Select a project");
      document.getElementById("message-area").innerHTML = "Select a project";
      Object.entries(projectsOb).map(item => {
        const btn = document.createElement("button");
        btn.setAttribute("value", item[0]); // index) is the  key
        btn.setAttribute("title", item[1].description); // index 1 is value
        btn.className = "btn btn-primary open-project-button";
        btn.addEventListener("click", e => {
          displayMapSetOpenButtons(e.target.value); // store map Index
        });
        btn.innerHTML = item[1].name;
        maplist.appendChild(btn);
      });
    };
    retrieveProjectsFromFirebase();
  }
};

const displayMapSetOpenButtons = projectHash => {
  //console.log("projectHash:", projectHash);
  // clear button list
  document.getElementById("message-area").innerHTML = "Now select a map";
  const buttonParentEl = document.querySelector("#maplist");
  buttonParentEl.innerHTML = ""; // clear container of buttons
  const mapSet = App.State.projectsOb[projectHash].mapSet;
  Object.entries(mapSet).map(item => {
    const btn = document.createElement("button");
    btn.setAttribute("value", item[0]); // index) is the  key
    btn.setAttribute("title", item[1]); // index 1 is value
    btn.className = "btn btn-primary open-project-button";
    btn.addEventListener("click", e => {
      App.retrieveMapFromFireBase(e.target.value, projectHash);
      //App.State.settings.mapIndex = e.target.value; // store map Index
    });
    btn.innerHTML = item[1];
    maplist.appendChild(btn);
  });
};

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
  L.control
    .watermark({
      position: "bottomright"
    })
    .addTo(Map);
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
    OfflineBaselayersControl_div.innerHTML = "Tiles";
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
var fbStorage = {};
var offlineLayerControls = {};
const initApp = () => {
  App.State.relatedData = {};
  App.State.visableFeatures = [];
  App.State.featureIdLookup = {};
  App.State.symbology.beforeSelectedColor = {};
  App.State.symbology.beforeSelectedFillColor = {};
  firebase.initializeApp(fireBaseconfig);
  fbDatabase = firebase.database();
  fbStorage = firebase.storage();

  // --------------------------------------- Main ---------------------
  Map = myMap.setupBaseLayer();
  // initDebugControl()
  initLogoWatermark();
  L.control
    .scale({
      position: "bottomleft"
    })
    .addTo(Map);
  App.customMarker = L.Marker.extend({
    options: {
      photoFileName: null,
      dataPath: null,
      contentType: null,
      layerId: null
      //minWidth: 500,
      //maxWidth: 500
    }
  });
  App.initSettingsControl();
  setupSideBar();
  initLocationControl();
  Map.doubleClickZoom.disable();
  L.control
    .OfflineBaselayersControl({
      position: "topright"
    })
    .addTo(Map);
  offlineLayerControls = setupOfflineBaseLayerControls();
  offlineLayerControls.map(layer => {
    layer.addTo(Map);
  });
  document.querySelectorAll(".leaflet-control-offline").forEach(el => {
    el.style.display = "none";
  });
  //RelatedData.restoreRelStateFromLocalStorage()

  App.State.markerIcons.commentIcon = L.icon({
    iconUrl: "comment-icon.png",
    shadowUrl: "marker-shadow.png",
    //iconSize: [38, 95], // size of the icon
    //shadowSize: [50, 64], // size of the shadow
    iconAnchor: [13, 41], // point of the icon which will correspond to marker's location
    shadowAnchor: [13, 41] // the same for the shadow
    //popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
  });

  App.State.markerIcons.hazardIcon = L.icon({
    iconUrl: "hazard-icon.png",
    shadowUrl: "marker-shadow.png",
    iconAnchor: [13, 41], // point of the icon which will correspond to marker's location
    shadowAnchor: [13, 41] // the same for the shadow
  });

  App.State.markerIcons.breachIcon = L.icon({
    iconUrl: "breach-icon.png",
    shadowUrl: "marker-shadow.png",
    iconAnchor: [13, 41], // point of the icon which will correspond to marker's location
    shadowAnchor: [13, 41] // the same for the shadow
  });
  App.State.markerIcons.unmappedIcon = L.icon({
    iconUrl: "unmapped-icon.png",
    shadowUrl: "marker-shadow.png",
    iconAnchor: [13, 41], // point of the icon which will correspond to marker's location
    shadowAnchor: [13, 41] // the same for the shadow
  });

  App.setupMarkersLayer();
  App.loadMapDataFromLocalStorage();

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

Map.on("contextmenu", e => {
  const addPopupToClick = e => {
    const buttonOb = App.createPopupContentButtonSet({
      //buttonSet: App.State.addMarkerButtons
      buttonSet: App.State.markerTypes
    });
    L.popup()
      .setLatLng(e.latlng)
      .setContent(buttonOb.popupContent)
      .openOn(Map);
  };
  addPopupToClick(e);
  App.State.currentLineaddMarkerLat = e.latlng.lat;
  App.State.currentLineaddMarkerLng = e.latlng.lng;
  App.State;
});
Map.on("moveend", () => {
  App.featureLabels();
});

function updateLatestLocation(e) {
  App.State.latestLocation = e.latlng;
}
