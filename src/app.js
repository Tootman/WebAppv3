"use strict";

import L from 'leaflet';
import firebase from 'firebase';
import './style.scss';
import 'leaflet-offline';
import localforage from 'localforage';
import logoImg from './ORCL-logo-cropped.png';
import leafletKnn from 'leaflet-knn';
import fontello_ttf from './fontello/font/fontello.ttf';
require('./L.Control.Sidebar');
require('./L.Control.Locate.min');
import { tilesDb } from './offline-tiles-module.js';
import { User } from './User.js';

let myMap = {
    settings: {
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
    state: { // Hopefully this is where all data will live, after the app is refactored to be more like React
        latestLocation: null // lat Lng

    },

    setupBaseLayer: function() {
        const greyscaleLayer = L.tileLayer.offline(this.settings.mbUrl, tilesDb, {
            id: "mapbox.light",
            attribution: myMap.settings.mbAttr,
            maxZoom: 26,
            maxNativeZoom: 18
        });
        const streetsLayer = L.tileLayer.offline(this.settings.mbUrl, tilesDb, {
            id: "mapbox.streets",
            attribution: myMap.settings.mbAttr,
            maxZoom: 26,
            //minNativeZoom: 22,
            maxNativeZoom: 18 // was 20
        });
        streetsLayer.on('offline:save-end', function() {
            alert('All the tiles were saved.');
        });

        const satLayer = L.tileLayer.offline(this.settings.mbUrl, tilesDb, {
            id: "mapbox.satellite",
            attribution: myMap.settings.mbAttr,
            maxZoom: 26,
            minZoom: 18
        });
        const myLayerGroup = L.layerGroup();
        this.myLayerGroup = myLayerGroup;
        // create map with 3 layers
        const map = L.map("map", {
            center: [51.4384332, -0.3147865],
            zoom: 18,
            maxZoom: 26,
            minZoom: 12,
            zoomDelta: 2,
            layers: [streetsLayer, myLayerGroup] // loads with this layer initially
        });
        // create group of basemap layers
        let baseMaps = {
            Greyscale: greyscaleLayer,
            Streets: streetsLayer,
            Satellite: satLayer
        };
        this.basemaps = baseMaps;
        myMap.streetsLayer = streetsLayer
        myMap.satLayer = satLayer
        myMap.greyscaleLayer = greyscaleLayer

        // create group of overlay layers
        let overlayMaps = {
            myLayers: myLayerGroup
        };
        this.overlayMap = overlayMaps;
        this.LayersControl = L.control.layers(baseMaps).addTo(map);
        return map;
    }
};

// the App object holds the GeoJSON layer and manages all it's interactions with the user
const App = {
    State: {
        relatedData: {}, // init va3l

        relDataSyncStatus: {}, // objects holds relatedData sync status flag for each feature, TRUE if synced , False  
        surveyed: {}, // true when inspected ie completed , false when not-yet-instected  
        completedResetDate: new Date(2018, 9, 1, 0, 0, 0, 0),
        symbology: {
            uncompletedColor: "red",
            uncompletedfillColor: "red",
            uncompletedLineWeight: 8,
            completedLineWeight: 4,
            uncompletedRadius: 8,
            completedColor: 'grey',
            completedFillColor: 'grey',
            completedRadius: 2 // placeholder  - start of year
        },
        visableFeatures: [],
        formFields: {
            condition:{
                "c1":"(1 - hazard)",
                "c2": "2 - (unfit for purpose)",
                "c3": "3",
                "c4" : "4",
                "c5" : "5",
                "c6" : "6",
                "rm": "removed / not found",
                "nv": "not visable",
                "pv": "partially visable"
            }
        }
    },

    populateConditionInputField: ()=>{

    },





    updateRelDataSyncMsg: (featureID) => {
        const relSyncDiv = document.getElementById("rel-data-sync-message")
        if (relSyncDiv == null) return; //exit if element doesn yet exist ie of form is'nt open
        let msg = ""
        const s = App.State.relDataSyncStatus[featureID]
        if (s == null) {
            msg = "not related data"
        } else if (s == true) { msg = "successful sync" } else if (s == false) {
            msg = "Data not yet synced - please connect to network before closing this App"
        }
        relSyncDiv.innerHTML = msg
        relSyncDiv.style = "color:'CornflowerBlue' "
    },

    whenGeoFeatureClicked: function() {
        const fId = App.selectedFeature.properties.OBJECTID + App.selectedFeature.geometry.type

        function renderSideBar() {
            App.sidebar.setContent(
                document.getElementById("form-template").innerHTML
            );
        }
        let p = App.selectedFeature.properties;
        renderSideBar();
        this.generateFormElements(p);
        if (p.photo !== null && p.photo !== undefined) {
            this.getPhoto(p.photo);
        }
        App.updateRelDataSyncMsg(fId)
        App.updateSidebarRelatedFromState(fId)
        App.sidebar.show();
    },

    findNearestFeatures: function() {
        if (myMap.state.latestLocation) {
            const nearest = leafletKnn(App.geoLayer).nearest(L.latLng(myMap.state.latestLocation), 1) // example usage for Ham Green
            nearest[0].layer.fire('click')
        } else {
            window.alert("Sorry failed - You need to get a GPS location first")
        }
    },

    /*
    createFormItem: function(parentTag, el, type, prop, value) {
        const wrapperDiv = createWrapperDiv(parentTag);
        createLabel(wrapperDiv, el, type, prop, value);
        createInputBox(wrapperDiv, el, type, prop, value);

        function createWrapperDiv() {
            let x = document.createElement("div");
            x.classList.add("form-group");
            parentTag.appendChild(x);
            return x;
        }

        function createInputBox(parent) {
            let x = document.createElement(el);
            x.setAttribute("type", type);
            x.type = type;
            x.classList.add("form-control");
            x.value = value;
            x.id = String("input_" + prop);
            if (type === "Checkbox") {
                console.log("checkboxValue: " + value);
                x.checked = value;
            }
            parent.appendChild(x);
        }

        function createLabel(parent) {
            let x = document.createElement("label");
            x.innerHTML = prop;
            parent.appendChild(x);
        }
    },

    */

    createFormItem: function(parentTag, el, type, prop, value) {
        const wrapperDiv = createWrapperDiv(parentTag);
        createLabel(wrapperDiv, el, type, prop, value);
        //createInputBox(wrapperDiv, el, type, prop, value);
        createValueLabel(wrapperDiv, el, type, prop, value);
        //createRow(wrapperDiv, el, type, prop, value);

        function createWrapperDiv() {
            let x = document.createElement("tr");
            // x.classList.add("");
            parentTag.appendChild(x);
            return x;
        }

        function createValueLabel(parent) {
            let x = document.createElement("td");
            //x.classList.add("col-sm-9")
            x.innerHTML = value;
            parent.appendChild(x);
            if (type === "Checkbox") {
                x.checked = value;
            }
            parent.appendChild(x);
        }

        function createLabel(parent) {
            let x = document.createElement("td");
            //x.classList.add("col-sm-3")
            x.innerHTML = prop;
            parent.appendChild(x);
        }

        function createRow(parent) {
            let x = document.createElement("div");
            x.innerHTML = prop + " " + value + "<br>";
            parent.appendChild(x);
        }


    },

    generateFormElements: function(props) {
        const fs = document.getElementById("fields-section");
        fs.innerHTML = null;
        const myFunc = Object.keys(props).forEach(function(key) {
            const propType = typeof props[key];
            if (propType === "string" || propType === "number") {
                App.createFormItem(fs, "Input", "text", key, props[key]);
            } else if (propType === "boolean") {
                App.createFormItem(fs, "Input", "Checkbox", key, props[key]);
            } else {
                console.log("NOT OK: " + typeof key);
            }
        });
    },

    submitForm: function() {
        let p = App.selectedFeature.properties;
        readSidebarFormProperties(p);
        App.selectedLayer.setTooltipContent(p.Asset);
        App.sidebar.hide();
        //this.assignTaskCompletedStyle(this.selectedLayer, p);
        //Map.closePopup();
        this.selectedFeature = null;
        localStorage.setItem(
            "geoJSON",
            JSON.stringify(this.geoLayer.toGeoJSON())
        );

        function readSidebarFormProperties(props) {
            const myFunc = Object.keys(props).forEach(function(key) {
                const propType = typeof props[key];
                const el = document.getElementById(String("input_" + key));
                if (propType === "string" || propType === "number") {
                    props[key] = el.value;
                } else if (propType === "boolean") {
                    props[key] = el.checked;
                }
            });
        }

        function saveFeatureToFirebase() {
            // current id - id of 1st element in geo Array - I guess
            if (!window.confirm("Save feature to cloud")) {
                console.log("save Cancelled!");
                return;
            }
            const featureIndex =
                App.selectedLayer._leaflet_id -
                Object.keys(App.geoLayer._layers)[0] -
                1;
            const nodePath = String(
                "App/Maps/" + App.mapHash + "/Geo/features"
            );
            const Ob = {};
            const myKey = featureIndex;
            Ob[myKey] = App.selectedFeature;
            fbDatabase
                .ref(nodePath)
                .update(Ob)
                .then(function() {
                    console.log("saved to firebase!");
                })
                .catch(function() {
                    alert("Sorry - you need to be logged in to do this");
                });
        }
    },

    assignTaskCompletedStyle: function(layer, featureProperty) {
        const s = myMap.settings.symbology;
        if (featureProperty.taskCompleted == true) {
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

    resetMap: function() {
        localStorage.removeItem("geoJSON");
        App.geoLayer = {};
    },
    getPhoto: function(photoURL) {
        fetch(photoURL)
            .then(res => res.blob()) // Gets the response and returns it as a blob
            .then(blob => {
                console.log("blob!");
                const objectURL = URL.createObjectURL(blob);
                const myImage = new Image(350);
                myImage.src = objectURL;
                myImage.css = "width:500px";
                document.getElementById("photo-div").appendChild(myImage);
            });
    },
    uploadChanges: function() {
        // posts to shared hosting
        const url = App.settings.uploadjsonURL;
        fetch(url, {
                method: "POST", // or 'PUT'
                body: "name=" + JSON.stringify(this.geoLayer.toGeoJSON()), // data can be `string` or {object}!
                headers: {
                    "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                }
            })
            .then(res => {
                console.log("json sent ok apparently!");
            })
            .catch(error => console.error("Error:", error))
            .then(response => console.log("Success:", response));
    },

    initSettingsControl: () => {
        L.Control.myControl = L.Control.extend({
            onAdd: e => {
                const myControl_div = L.DomUtil.create("button", "main-button-control btn btn-lg btn-danger icon-cog");
                myControl_div.innerHTML = ""
                myControl_div.title = "Settings"
                myControl_div.onclick = () => {
                    App.sidebar.setContent(
                        document.getElementById("settings-template").innerHTML
                    );

                    User().initLoginForm();

                    /*
                    const savefb = document.getElementById(
                        "upload-map-to-firebase"
                    );
                    */
                    if (App.geoLayer === undefined || App.geoLayer === null) {
                        //savefb.style.display = "none";
                    } else {
                        //savefb.style.display = "block";
                        App.populateMapMeta();
                    }
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
            if (item !== null && item !== undefined) {
                console.log("meta attribute: " + item);
                content += String(item + ": " + App.mapMeta[item] + "<br>");
            }
        }
        container.innerHTML = content;
    },

    busyWorkingIndicator: (busyWorking) => {
        const cogIcon = document.getElementsByClassName('icon-cog')[0]
        if (busyWorking) {
            cogIcon.classList.add('icon-cog-spin')
        } else {
            cogIcon.classList.remove('icon-cog-spin')
        }
    },

    retrieveMapFromFireBase: function(index) {
        let nodePath = String("/App/Maps/" + index);
        App.sidebar.hide();
        App.busyWorkingIndicator(true)
        fbDatabase
            .ref(nodePath)
            .once("value")
            .then(snapshot => {
                const mapData = snapshot.val();
                App.clearLocalStorageMaps()
                App.setupGeoLayer(index, mapData);
                document.getElementById("opennewproject").style.display = "none";
                App.busyWorkingIndicator(false)

            })
            .catch(
                err => {
                    console.log("error! cannot get from firebase!", err)
                    App.busyWorkingIndicator(false)
                }
            );
    },

    saveMapToLocalStorage: (myKey, mapData) => {
        localStorage.setItem(
            "mapData." + myKey, JSON.stringify(mapData)
        );
    },

    clearLocalStorageMaps: () => {
        const keys = App.getLocalStorageMapDataKey()
        keys.map(item => { localStorage.removeItem(item) })
    },

    clearLocalStorageLatestRelDataBackup: () => {
        localStorage.removeItem('latestRelDataBackup')
    },

    populateRelated: related => {
        if ((related == null) || related == undefined) { return }

        const relDataObject = {}; // to be replaced with State etc
        const relDataSyncObject = {} // just to make sure it's initially empty
        App.State.relDataSyncStatus = {} // make sure start with empty obj
        App.State.relatedData = {}
        const getLastRelDataItem = RelDataSet => {
            const sortedKeys = Object.keys(RelDataSet).sort();
            const lastDataItem = RelDataSet[sortedKeys[sortedKeys.length - 1]];
            return lastDataItem;
        };

        App.State.relatedData = Object.keys(related).map((relKey, index) => {

            //attachRelatedToRecord(relKey, index, relDataObject);
            console.log("relkey, Index:", relKey, index)
            const itemOb = {}
            const lastItem = getLastRelDataItem(related[relKey])
            itemOb[relKey] = lastItem
            relDataObject[relKey] = lastItem
            relDataSyncObject[relKey] = true // ie the feature's rela data is now synced 
            return itemOb
        });
        App.State.relatedData = relDataObject
        App.State.relDataSyncStatus = relDataSyncObject
        App.getRelDataFromLocalStorage(App.mapHash)
    },

    getRelDataFromLocalStorage: (mapHash) => {

        const regex = "backup\.relatedData\." + mapHash + "\."

        const relDataKeys = Object.keys(localStorage).filter((item) => item.match(regex));
        if (relDataKeys.length == 0) return;
        relDataKeys.map(key => {
            const item = JSON.parse(localStorage.getItem(key))
            const itemFeatureKey = key.split(regex)[1] //  element 1 is str after split point 
            const relDataFeaturePath = "App/Maps/" + mapHash + "/Related/" + itemFeatureKey;
            const localStorageTime = new Date(item.timestamp)
            const stateTime = new Date(App.State.relatedData[itemFeatureKey].timestamp)
            console.log(localStorageTime.getTime(), stateTime.getTime())
            if (localStorageTime.getTime() > stateTime.getTime()) {
                console.log("New item to upload! : ", itemFeatureKey, item.timestamp, "State Timestamp:", App.State.relatedData[itemFeatureKey].timestamp)
                App.updateFeatureRelatedState(itemFeatureKey, item)
                App.State.relDataSyncStatus[key] = false // while item is sucessfully pushed to db
                RelatedData.pushRelatedDataRecord(relDataFeaturePath, itemFeatureKey, item)
                // Trigger push of item (does this update sync status and message automatically ? )  
            }
        })
    },

    updateFeatureRelatedState: (featureKey, relatedData) => {
        // update a single feature's RelatedRecord State
        App.State.relatedData[featureKey] = relatedData
        //App.setCompleted(featureKey, true)
    },

    setCompletedStyle: (featureOb, layerOb, objectID, ObjectType, isCompleted) => {
        console.log(featureOb, objectID, ObjectType, isCompleted)
        const featureKey = objectID + ObjectType // strings

        if (App.State.relatedData[featureKey] !== undefined) {
            var relDataDate = new Date(Date.parse(App.State.relatedData[featureKey].timestamp))
            console.log("relDataDate: ", relDataDate)
            const refDate = App.State.completedResetDate.getTime()
            var relDate = relDataDate.getTime()
            console.log("related for " + featureKey + "exists!")
            if (relDataDate > App.State.completedResetDate) {
                layerOb.setStyle({
                    color: App.State.symbology.completedColor, // why not working??
                    fillColor: App.State.symbology.completedFillColor,
                    weight: App.State.symbology.completedLineWeight,
                    radius: 1
                    //radius: App.State.symbology.completedRadius
                })
                // if (ObjectType == 'Point'){layerOb.setStyle({radius: App.State.symbology.completedRadius})}
            }
        }
    },

    updateSidebarRelatedFromState: (featureKey) => {
        // update a feature's RelatedRecord State
        const reldiv = document.getElementById("latest-related")
        reldiv.innerHTML = ""
        const relSet = App.State.relatedData[featureKey]
        if (relSet) {
            Object.keys(relSet).map((key) => {
                reldiv.innerHTML += key + ": " + relSet[key] + "<br>"
            })
        } else
            reldiv.innerHTML = ""
    },

    /*
    appendRelatedDataToFeatureState(featureSet, related) {
        if (related === null || related === undefined) {
            return featureSet; // return straight back as is
        }
        const getLastRelDataItem = RelDataSet => {
            const sortedKeys = Object.keys(RelDataSet).sort();
            const lastDataItem = RelDataSet[sortedKeys[sortedKeys.length - 1]];
            return lastDataItem;
        };

        const attachRelatedToRecord = (relKey, index, relDataOb) => {
            // creates an ob with set of keys with related properties as their values
            relDataOb[relKey] = getLastRelDataItem(related[relKey]);
        };
        const relDataObject = {};
        Object.keys(related).map((relKey, index) => {
            attachRelatedToRecord(relKey, index, relDataObject);
        });

        const assignPropsToFeature = (feature, featureIndex, relDataObject) => {
            const ObId = String(
                feature.properties.OBJECTID + feature.geometry.type
            );
            Object.assign(
                featureSet[featureIndex].properties,
                relDataObject[ObId]
            ); // asign related Props to feature
        };
        const updatedFeatureSet = featureSet.map((feature, index) => {
            assignPropsToFeature(feature, index, relDataObject);
        });
        const featureState = this.state.geoJson; // get a ref to state
        //featureState.features = featureSet;
        //this.setState(featureState);
    },
    */

    setupGeoLayer: (key, mapData) => {
        App.mapMeta = mapData.meta;
        App.mapHash = key;
        myMap.myLayerGroup.clearLayers(App.geoLayer);
        const featureLabelField = mapData.Meta ? mapData.Meta.LabelProperty : "Asset"
        App.populateRelated(mapData.Related); // need to catch when no related available
        App.geoLayer = L.geoJson(mapData.Geo, {
            onEachFeature: (feature, layer) => {
                let featureLabel = feature.properties[featureLabelField]
                //App.assignTaskCompletedStyle(layer, feature.properties);
                App.setCompletedStyle(feature, layer, feature.properties['OBJECTID'], feature.geometry.type, true)
                //if (feature.geometry.type=="Polygon"){console.log("sent to back!"); layer.bringToBack()}
                //console.log("feature type:", feature.geometry.type)

                layer.bindPopup('<div class="btn btn-primary large icon-pencil" onClick="App.whenGeoFeatureClicked();">' + "<br>" + featureLabel + " " + '</div')
                //layer.bindTooltip ("hello!")
                //layer.bindPopup (featureLabel)
                layer.on("click", e => {
                    // restore previouslly selected colours
                    //console.log("layer:", layer, "selectedLayer: ", App.selectedLayer, "same:", (layer !== App.selectedLayer))
                    if (App.selectedLayer !== layer) {
                        console.log("selected Layer NOT same as Layer")
                        if (App.selectedLayer) { App.unsetSelectedStyle() }
                        App.State.symbology.beforeSelectedColor = layer.options.color
                        App.State.symbology.beforeSelectedFillColor = layer.options.fillColor
                        App.State.symbology.beforeSelectedLineWeight = layer.options.weight

                        // now reset the style of the old layer

                    } else { console.log("selected Layer IS same as Layer") }

                    App.selectedFeature = feature; // expose selected feature and layer
                    App.selectedLayer = layer;
                    App.selectedLayer.setStyle({ color: 'blue', fillColor: 'blue', weight: 2 })

                    // App.whenGeoFeatureClicked();
                    //let myButton = L.DomUtil.create('button');
                    //myButton.innerHTML = "Hello"
                    //this.bindPopup = myButton
                });
                /*
                try {
                    layer.bindTooltip(featureLabel, {
                        className: "tool-tip-class",
                        permanent: false,
                        interactive: true
                    }).openTooltip();
                } catch (err) {
                    console.log("failed to find prop", err);
                }
                */
            },
            style: feature => {
                return {
                    fillOpacity: 0.4,
                    color: App.State.symbology.uncompletedColor,
                    fillColor: App.State.symbology.uncompletedFillColor,
                    weight: App.State.symbology.uncompletedLineWeight
                    //fillColor: App.State.symbology.uncompletedRadius,
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
        App.saveMapToLocalStorage(key, mapData)

    },

    unsetSelectedStyle: () => {

        console.log("unselected", App.selectedLayer)
        App.selectedLayer.setStyle({

            //color: App.State.symbology.beforeSelectedColor,
            color: App.State.symbology.beforeSelectedColor,
            fillColor: App.State.symbology.beforeSelectedFillColor,
            weight: App.State.symbology.beforeSelectedLineWeight
            //fillColor: App.State.symbology.beforeSelectedFillColor
        })
    },

    movePolygonsToBack() {
        //move polygons to back
        App.geoLayer.eachLayer(layer => { if (layer.feature.geometry.type == "Polygon") { layer.bringToBack() } })
    },

    getLocalStorageMapDataKey: () => {
        // return keys that start with maoData
        return Object.keys(localStorage).filter(item => { return new RegExp('^mapData.*').test(item) })
    },

    loadMapDataFromLocalStorage: () => {
        // attempt to retrieve map from local
        const storageKey = App.getLocalStorageMapDataKey()
        if (storageKey.length == 0) { return }
        const mapData = JSON.parse(localStorage.getItem(storageKey))
        const mapKey = storageKey[0].split("mapData.")[1]
        App.setupGeoLayer(mapKey, mapData)
    },

    featureLabels: () => {
        const bounds = Map.getBounds();
        if (App.State.visableFeatures !== null) {
            App.State.visableFeatures.map(layer => {
                layer.unbindTooltip()
            })
            App.State.visableFeatures = []
        }
        if (Map.getZoom() < 20) { return }
        const redrawToolTips = () => {
            App.geoLayer.eachLayer(
                function(layer) {
                    //console.log (layer)
                    //layer.unbindTooltip()
                    let relID = ""
                    let hasRelData
                    try { relID = layer.feature.properties.OBJECTID + layer.feature.geometry.type
                    	hasRelData = App.State.relatedData[relID]
                    	//console.log (hasRelData)
                     } 
                    catch (err) { 
                    	relID = undefined
                    	hasRelData = false 
                    	//console.log("undefined!", )
                    }
                    //console.log(hasRelData)

                    if (layer.getLatLng && !hasRelData) {
                        //console.log ("latlng:",layer.getLatlng)
                        if (bounds.contains(layer.getLatLng())) {
                            //console.log(layer)
                            App.State.visableFeatures.push(layer)
                        }
                    } else if (layer.getBounds && !hasRelData) {
                        if (bounds.intersects(layer.getBounds()) || (bounds.contains(layer.getBounds()))) {
                            //console.log(layer)
                            App.State.visableFeatures.push(layer)
                        }
                    }
                })
        }
        redrawToolTips();
        // console.log("new bounds", bounds)
        App.State.visableFeatures.map(layer => {
            layer.bindTooltip(layer.feature.properties.Asset, { permanent: true, interactive: true })
        })
    }
};

window.App = App

const RelatedData = {

    saveRelDataRecordToLocalStorage: (mapHash, featureKey, relatedData) => {
        localStorage.setItem('backup.relatedData.' + mapHash + "." + featureKey, JSON.stringify(relatedData));
    },

    pushRelatedDataRecord: (relDataPath, featureKey, relatedRecord) => {
        fbDatabase
            .ref(relDataPath) // meed to move this constant into App.State
            .push(relatedRecord)
            .then((snap) => {
                // if successfully synced

                const f_id = snap.parent.key // fudege to retrieve feature key
                App.State.relDataSyncStatus[f_id] = true
                App.updateRelDataSyncMsg(f_id)
                console.log("Pushed new Related Record :", f_id)
                // Remove record from local storage
                const localStorageKey = "backup.relatedData." + App.mapHash + "." + featureKey
                localStorage.removeItem(localStorageKey)
            })
            .catch(error => {
                console.log("My Error: " + error.message);
                alert("Sorry - something went wrong - have you logged in etc?");

            });
    },

    submit: () => {
        // calculate key from OBJECTID + geometrytype
        RelatedData.featureKey = String(
            App.selectedFeature.properties.OBJECTID + App.selectedFeature.geometry.type
        );

        App.selectedFeature.geometry.type + "/";
        console.log("key: " + RelatedData.featureKey);
        RelatedData.nodePath = String(
            "App/Maps/" + App.mapHash + "/Related/" + RelatedData.featureKey + "/"
        );
        console.log("nodePath: " + RelatedData.nodePath);
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
            relatedRecord.photo = document.getElementById(
                "related-data-photo"
            ).value;
        }
        const key = RelatedData.featureKey
        App.State.relDataSyncStatus[key] = false // while push promise is unresolved
        App.updateRelDataSyncMsg(key)
        App.updateFeatureRelatedState(key, relatedRecord)

        App.updateSidebarRelatedFromState(key)
        //RelatedData.backupUpRelStateToLocalStorage()
        RelatedData.saveRelDataRecordToLocalStorage(App.mapHash, key, relatedRecord)
        // RelatedData.backupUpRelStateToLocalStorage();
        RelatedData.pushRelatedDataRecord(RelatedData.nodePath, key, relatedRecord)
        document.getElementById("related-data-info").innerHTML = "Submitted!";
        App.State.symbology.beforeSelectedColor = App.State.symbology.completedColor;
        App.State.symbology.beforeSelectedFillColor = App.State.symbology.completedFillColor;
    },

    backupUpRelStateToLocalStorage: () => {
        localStorage.setItem('latestRelDataBackup', JSON.stringify(App.State.relatedData))
    },

    restoreRelStateFromLocalStorage: () => {
        if (localStorage.getItem('latestRelDataBackup') !== null) {
            App.State.relatedData = JSON.parse(localStorage.getItem('latestRelDataBackup'))
        } else {
            App.State.relatedData = {}
        }
    },


    addPhoto: function() {
        const el = document.getElementById("photo-capture");
        console.log(el.files[0].name);
        document.getElementById("related-data-photo").value = el.files[0].name;
    }
};

window.RelatedData = RelatedData

function uploadMapToFirebase() {
    // grab the blobal Mapindex, then send gson layer up to node
    //const nodePath = String("'/App/Maps/" + myMap.settings.mapIndex)
    const nodePath = String("App/Maps/" + App.mapHash + "/Geo");

    fbDatabase
        .ref(nodePath)
        .set(App.geoLayer.toGeoJSON())
        .catch(function(error) {
            alert("Sorry you need to be logged in to do this");
        });
}

window.User = User

function loadMyLayer(layerName) {
    // just for testing

    document.getElementById("open-new-project-button").style.display = "none";
    //loadFromPresetButtons(layerName);
    // console.log("LoadmyLayer!")
    loadProject();

    function loadProject() {
        /*
        const mapIndexList = getLocalStorageMapIndexList()
        if (mapIndexList) {
            displayMapIndeces(mapIndexList)
        } else {
            console.log("local mapIndex list not found so try from Firebase")
            retriveMapIndexFromFirebase()
        }
        */

        retriveMapIndexFromFirebase()

        //const el = document.getElementById("opennewproject");
        // el.insertAdjacentHTML("afterBegin", "Open project");
        // displayMapIndeces(myMapIndeces);

        /*
        function getLocalStorageMapIndexList() {
            const mapIndexList = JSON.parse(localStorage.getItem('mapIndexList'))
            return mapIndexList
        }

        function setLocalStorageMapIndexList(mapIndexList) {
            localStorage.setItem(
                'mapIndexList', JSON.stringify(mapIndexList)
            )
        };

         */
        /*

        function retriveMapIndexFromFirebase() {
            fbDatabase
                .ref("/App/Mapindex")
                .once("value")
                .then(snapshot => {
                    document.getElementById("message-area").innerHTML = null;
                    console.log("fetched ok: ");
                    //const el = document.getElementById("opennewproject");
                    //el.insertAdjacentHTML("afterBegin", "Open project");
                    // setLocalStorageMapIndexList(snapshot)
                    displayMapIndeces(snapshot);
                })
                .catch(error => {
                    console.log("My Error: " + error.message);
                    document.getElementById("message-area").innerHTML =
                        "Sorry - " + error.message;
                });
        };

        */

        function retriveMapIndexFromFirebase() {
            document.getElementById("message-area").innerHTML =
                "<p>waiting for network connection ...</p>";
            fbDatabase
                .ref("/App/Mapindex")
                .once("value")
                .then(function(snapshot) {
                    document.getElementById("message-area").innerHTML = null;
                    console.log("map index fetched ok: ");
                    const el = document.getElementById("opennewproject");
                    el.insertAdjacentHTML("afterBegin", "Open project");
                    displayMapIndeces(snapshot.val());
                })
                .catch(error => {
                    console.log("My Error: " + error.message);
                    document.getElementById("message-area").innerHTML =
                        "Sorry - " + error.message;
                });
        };

        function displayMapIndeces(mapIndexList) {
            //const el = document.getElementById("opennewproject");
            //el.insertAdjacentHTML("afterBegin", "Open project");

            const el = document.getElementById("opennewproject");
            el.insertAdjacentHTML("afterBegin", "Open project");
            // Object.values(snapshot.val()).map(item => {
            Object.values(mapIndexList).map(item => {
                const btn = document.createElement("button");
                console.log(item.description);
                btn.setAttribute("value", item.mapID);
                btn.setAttribute("title", item.description);
                btn.className = "btn btn-primary open-project-button";
                const id = item.mapID;
                btn.addEventListener("click", function(e) {
                    App.retrieveMapFromFireBase(e.target.value);
                    myMap.settings.mapIndex = e.target.value; // store map Index
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
            const watermark = L.DomUtil.create("IMG", 'watermark');
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

/*
function initDebugControl() {
    let debugControl_div;
    Map.on("locationfound", onLocationFound);
    Map.on("locationerror", onLocationError);

    function onLocationFound(e) {
        debugToMap("type: " + e.type + ", accuracy: " + e.accuracy + "<br>");
        console.log("location success");
        console.log("location found: ", e);
    }

    function onLocationError() {
        debugToMap("location failed");
    }

    function debugToMap(message) {
        let d = new Date();
        debugControl_div.innerHTML +=
            d.getMinutes() + ":" + d.getSeconds() + " " + message + "<br>";
    }

    L.Control.debugControl = L.Control.extend({
        onAdd: e => {
            debugControl_div = L.DomUtil.create("div");
            debugControl_div.onclick = function() {
                console.log("debug control clicked!");
            };

            debugControl_div.style = "background-color:white; max-width:50vw";
            return debugControl_div;
        }
    });
    L.control.debugControl = opts => {
        return new L.Control.debugControl(opts);
    };
    L.control
        .debugControl({
            position: "bottomleft"
        })
        .addTo(Map);
}

*/

// --------------------------------- Offline Basemap Caching ------
const setupOfflineBaseLayerControls = () => {
    const myBaseLayerControls = [
        { object: myMap.streetsLayer, label: "Streets", class: 'streets-offline-control' },
        { object: myMap.greyscaleLayer, label: "Greyscale", class: 'greyscale-offline-control' },
        { object: myMap.satLayer, label: "Satellite", class: 'satellite-offline-control' }

    ]
    return (
        myBaseLayerControls.map(layer => {
            return (
                L.control.offline(layer.object, tilesDb, {
                    saveButtonHtml: `<i id="${layer.object}" title="Save ${layer.label} layer to use offline" class="${layer.class} layer icon-download">${layer.label} </i>`,
                    removeButtonHtml: '<i class="icon-trash " aria-hidden="true">Delete</i>',
                    confirmSavingCallback: function(nTilesToSave, continueSaveTiles) {
                        if (window.confirm('Save ' + nTilesToSave + ' background tiles?')) {
                            continueSaveTiles();
                        }
                    },
                    confirmRemovalCallback: function(continueRemoveTiles) {
                        if (window.confirm('Delete All offline tiles?')) {
                            continueRemoveTiles();
                        }
                    },
                    minZoom: 14,
                    maxZoom: 18,
                    position: "topright"

                })
            )
        })
    )
};

L.Control.OfflineBaselayersControl = L.Control.extend({
    onAdd: function(map) {
        const OfflineBaselayersControl_div = L.DomUtil.create('button', "btn btn-sm icon-download btn-info");
        OfflineBaselayersControl_div.innerHTML = "Offline <br>Baselayers"
        OfflineBaselayersControl_div.title = "Save Background layers (tiles) for Offline use"
        OfflineBaselayersControl_div.onclick = () => {
            const offlineLayerCtrls = document.querySelectorAll(".leaflet-control-offline");
            if (offlineLayerCtrls[0].style.display == "none") {
                offlineLayerCtrls.forEach(el => el.style.display = "block")

            } else {
                offlineLayerCtrls.forEach(el => el.style.display = "none")
            }
        }
        return OfflineBaselayersControl_div
    },

    onRemove: function(map) {
        // Nothing to do here
    }
});
L.control.OfflineBaselayersControl = opts => {
    return new L.Control.OfflineBaselayersControl(opts);
};

// ------------------------------------------------------------------

// firebase
const fireBaseconfig = {
    apiKey: "AIzaSyB977vJdWTGA-JJ03xotQkeu8X4_Ds_BLQ",
    authDomain: "fir-realtime-db-24299.firebaseapp.com",
    databaseURL: "https://fir-realtime-db-24299.firebaseio.com",
    projectId: "fir-realtime-db-24299",
    storageBucket: "fir-realtime-db-24299.appspot.com",
    messagingSenderId: "546067641349"
};

var Map = {}
var fbDatabase = {}
var offlineLayerControls = {}
const initApp = () => {
    App.State.relatedData = {};
    App.State.visableFeatures = []
    App.State.symbology.beforeSelectedColor = {}
    App.State.symbology.beforeSelectedFillColor = {}
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
    offlineLayerControls = setupOfflineBaseLayerControls()
    offlineLayerControls.map(layer => { layer.addTo(Map) })
    document.querySelectorAll(".leaflet-control-offline").forEach(el => { el.style.display = "none" });
    //RelatedData.restoreRelStateFromLocalStorage()
    App.loadMapDataFromLocalStorage()
    console.log("v 0.9.05");
    window.alert("v 0.9.05")

    // ----- offline service worker -----------
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js').then(registration => { //  for dev
                console.log('SW registered: ', registration);
            }).catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
        });
    }

}

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
            icon: 'icon-direction'
        })
        .addTo(Map);
}


Map.on("locationfound", updateLatestLocation)
//Map.on("viewreset", () => console.log("VIEW RESET"));

Map.on("click", e => {
    console.log("map clicked!")
    /*
    App.selectedLayer.setStyle({
        //color: App.State.symbology.beforeSelectedColor,
        //color: 'red',
        //fillColor: App.State.symbology.beforeSelectedFillColor
        //fillColor: 'red'
    })
    */
    App.unsetSelectedStyle()
    App.selectedLayer = null
    App.selectedFeature = null

})




Map.on('moveend', function(e) {
    App.featureLabels()
});

Map.on('zoomend', function(e) {
    /*
    if (Map.getZoom <21){
    	if (App.State.visableFeatures !== null){
    		App.State.visableFeatures.map (layer =>{
    			layer.unbindTooltip ()
    		})
    	}
    }
    App.featureLabels()
*/
});


function updateLatestLocation(e) {
    //console.log("locates location:", e)

    myMap.state.latestLocation = e.latlng
}

/*
Map.on("popupclose", function(e) {
    App.sidebar.hide();
    App.selectedFeature = null;
    console.log("popupClosed!")
});
*/