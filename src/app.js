"use strict";

import L from 'leaflet';
import firebase from 'firebase';
import './style.scss';
import 'leaflet-offline';
import localforage from 'localforage'


require('./L.Control.Sidebar');
require('./L.Control.Locate.min');

require('./L.Control.Sidebar.css');
require('./L.Control.Locate.min.css');
//import Sidebar from 'L.Control.Sidebar.js';
// import { myUrl } from './djs_module';

// Overview: when a feature on the geo layer is clicked it is assigned to  App.selectedFeature for interaction

// the myMap object holds all the map and global settings, and sets up and manages the basemaps

//let RelatdData = {} // will be reasigned below


// ------------------   Offline background tile caching ----

const tilesDb = {
    getItem: function(key) {
        return localforage.getItem(key);
    },
    saveTiles: function(tileUrls) {
        var self = this;
        this._hideControls()
        var promises = [];
        for (var i = 0; i < tileUrls.length; i++) {
            var tileUrl = tileUrls[i];
            (function(i, tileUrl) {
                promises[i] = new Promise(function(resolve, reject) {
                    var request = new XMLHttpRequest();
                    request.open('GET', tileUrl.url, true);
                    request.responseType = 'blob';
                    request.onreadystatechange = function() {
                        if (request.readyState === XMLHttpRequest.DONE) {
                            if (request.status === 200) {
                                resolve(self._saveTile(tileUrl.key, request.response));
                            } else {
                                reject({
                                    status: request.status,
                                    statusText: request.statusText
                                });
                            }
                        }
                    };
                    request.send();
                });
            })(i, tileUrl);
        }
        return Promise.all(promises);
    },
    clear: function() {
        this._hideControls()
        return localforage.clear();
    },
    _saveTile: function(key, value) {
        return this._removeItem(key).then(function() {
            return localforage.setItem(key, value);
        });
    },
    _removeItem: function(key) {
        return localforage.removeItem(key);
    },
    _hideControls: () => {
        document.querySelectorAll(".leaflet-control-offline").forEach(el => { el.style.display = "none" });
    }
};

//----------------------------------------------


let myMap = {
    settings: {
        symbology: {
            taskCompleteStyle: {
                fillColor: "grey",
                color: "black"
            },
            pointTaskNotCompleteStyle: {
                fillColor: "red",
                color: "red"
            },
            lineTaskNotCompleteStyle: {
                fillColor: "red",
                color: "red"
            },
            polyTaskNotCompleteStyle: {
                fillColor: "yellow",
                color: "black",
                weight: 1
            }
        },


        //mbAttr: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        mbAttr: '<a href="http://openstreetmap.org">OSMap</a> ©<a href="http://mapbox.com">Mapbox</a>',
        mbUrl: "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZGFuc2ltbW9ucyIsImEiOiJjamRsc2NieTEwYmxnMnhsN3J5a3FoZ3F1In0.m0ct-AGSmSX2zaCMbXl0-w",
        //demoJSONmapdata: 'ham-green-demo.json',
        // demoJSONmapdata: 'richmondriverside.json',
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
            maxZoom: 24
        });
        const streetsLayer = L.tileLayer.offline(this.settings.mbUrl, tilesDb, {
            id: "mapbox.streets",
            attribution: myMap.settings.mbAttr,
            maxZoom: 24
        });
        const satLayer = L.tileLayer.offline(this.settings.mbUrl, tilesDb, {
            id: "mapbox.satellite",
            attribution: myMap.settings.mbAttr,
            maxZoom: 24
        });
        const myLayerGroup = L.layerGroup();
        this.myLayerGroup = myLayerGroup;

        // create map with 3 layers
        const map = L.map("map", {
            center: [51.4384332, -0.3147865],
            zoom: 18,
            maxZoom: 24,
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
        relDataSyncStatus: {} // objects holds relatedData sync status flag for each feature, TRUE if synced , False  
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
        console.log("fID:", fId)

        function renderSideBar() {
            App.sidebar.setContent(
                document.getElementById("form-template").innerHTML
            );
            //document.getElementById("take-photo-btn").addEventListener('click', RelatedData.addPhoto());
        }
        let p = App.selectedFeature.properties;
        renderSideBar();
        this.generateFormElements(p);
        if (p.photo !== null && p.photo !== undefined) {
            this.getPhoto(p.photo);
        }
        console.log(" read task completed: " + p.taskCompleted);

        App.updateRelDataSyncMsg(fId)
        App.updateSidebarRelatedFromState(fId)

        App.sidebar.show();
    },

    findNearestFeatures: function() {



        if (myMap.state.latestLocation)

        {
            const nearest = leafletKnn(App.geoLayer).nearest(L.latLng(myMap.state.latestLocation), 1) // example usage for Ham Green
            nearest[0].layer.fire('click')

        } else {
            window.alert("Sorry - failed - You need to get a GPS location first")
        }
    },

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
    generateFormElements: function(props) {
        // console.log(sampleGeoData.features[featureID].properties.Asset)
        const fs = document.getElementById("fields-section");
        fs.innerHTML = null;
        // const props = sampleGeoData.features[featureID].properties
        const myFunc = Object.keys(props).forEach(function(key) {
            //console.log("generateElements: " + typeof(key)+ " " + key + ": " + props[key])
            // fs.innerHTML += "<br>"
            const propType = typeof props[key];
            if (propType === "string" || propType === "number") {
                App.createFormItem(fs, "Input", "text", key, props[key]);
            } else if (propType === "boolean") {
                App.createFormItem(fs, "Input", "Checkbox", key, props[key]);
            } else {
                console.log("NOT OK: " + typeof key);
            }
            //fs.insertAdjacentHTML('beforeEnd', '<br>');
        });
    },

    submitForm: function() {
        let p = App.selectedFeature.properties;
        readSidebarFormProperties(p);
        // saveFeatureToFirebase()
        App.selectedLayer.setTooltipContent(p.Asset);
        App.sidebar.hide();
        this.assignTaskCompletedStyle(this.selectedLayer, p);
        Map.closePopup();

        this.selectedFeature = null;
        console.log("toGeo: " + JSON.stringify(this.geoLayer.toGeoJSON()));
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
                "App/Maps/" + App.firebaseHash + "/Geo/features"
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
    loadGeoJSONLayer: function(myFile) {
        fetch(myFile)
            .then(function(response) {
                if (response.status !== 200) {
                    console.log(
                        "Looks like there was a problem. Status Code: " +
                        response.status
                    );
                    return;
                }
                response.json().then(function(data) {
                    App.setupGeoLayer(data);
                    console.log("fetch called!");
                });
            })
            .catch(function(err) {
                console.log("Fetch Error :-S", err);
            });
    },
    resetMap: function() {
        localStorage.removeItem("geoJSON");
        App.geoLayer = {};
        App.loadGeoJSONLayer(demoJSONmapdata);
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

    initSettingsControl: function() {
        L.Control.myControl = L.Control.extend({
            onAdd: e => {
                const myControl_div = L.DomUtil.create("button", "main-button-control btn btn-lg btn-danger icon-cog");
                myControl_div.innerHTML = ""
                myControl_div.title = "Settings"
                myControl_div.onclick = () => {
                    console.log("custom control clicked!");
                    App.sidebar.setContent(
                        document.getElementById("settings-template").innerHTML
                    );
                    //document.getElementById("upload-map-to-firebase").style.display = 'none';
                    //document.getElementById("upload-map-to-firebase").style.visibility = 'hidden';
                    // temp fudge - for if no map loaded into geoLayer yet
                    User().initLoginForm();

                    const savefb = document.getElementById(
                        "upload-map-to-firebase"
                    );
                    if (App.geoLayer === undefined || App.geoLayer === null) {
                        savefb.style.display = "none";
                        console.log(" save display none");
                    } else {
                        savefb.style.display = "block";
                        console.log(" save display block");
                        App.populateMapMeta();
                    }

                    document
                        .getElementById("open-new-project-button")
                        .addEventListener("click", function() {
                            loadMyLayer("dummy");
                        });
                    //loadMyLayer("dummy")
                    App.sidebar.show();
                    //alert("Load Shapefile or do something else");
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
        //containter.innerHTML = content
    },

    retrieveMapFromFireBase: function(index) {
        let nodePath = String("/App/Maps/" + index);

        fbDatabase
            .ref(nodePath)
            .once("value")
            .then(function(snapshot) {
                // loadOverlayLayer(snapshot.val())  // checks storage then tries downliading file
                const layerData = snapshot.val();
                console.log("Node: " + layerData);
                myMap.myLayerGroup.clearLayers(App.geoLayer);
                App.setupGeoLayer(layerData.Geo, layerData.Meta);
                Map.fitBounds(App.geoLayer.getBounds());
                App.firebaseHash = snapshot.key;
                document.getElementById("opennewproject").style.display =
                    "none";
                App.sidebar.hide();
                App.populateRelated(layerData.Related);
            });
    },

    populateRelated: related => {
        //console.log("relData:", related)
        //App.State.relatedData = related
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
        App.getRelDataFromLocalStorage(App.firebaseHash)
        /*
        const attachRelatedToRecord = (relKey, index, relDataOb, tempOb) => {
            // creates an ob with set of keys with related properties as their values
            relDataOb[relKey] = this.getLastRelDataItem(related[relKey]);

        };
        */
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

    setupGeoLayer: function(myJSONdata, meta) {
        //
        console.log("meta: ", meta);
        App.mapMeta = meta;
        //App.mapMeta = myJSONdata.Meta
        App.geoLayer = L.geoJson(myJSONdata, {
            onEachFeature: function(feature, layer) {
                console.log("clicked: " + feature.properties.Asset);
                App.assignTaskCompletedStyle(layer, feature.properties);
                layer.on("click", function(e) {
                    App.selectedFeature = feature; // expose selected feature and layer
                    App.selectedLayer = layer;
                    App.whenGeoFeatureClicked();
                });
                //layer.bindPopup("<button> Edit</button>");
                //layer.bindTooltip(feature.properties.Asset, { className: 'tool-tip-class' });
                try {
                    layer.bindTooltip(feature.properties[meta.LabelProperty], {
                        className: "tool-tip-class"
                    });
                } catch (err) {
                    console.log("failed to find prop", err);
                }
            },
            style: function(feature) {
                return {
                    fillOpacity: 0.6
                };
            },
            pointToLayer: function(feature, latlng) {
                return L.circleMarker(latlng, {
                    radius: 8,
                    stroke: true,
                    weight: 3,
                    opacity: 1,
                    weight: 4,
                    fillOpacity: 1
                });
            },
            interactive: true
        });
        // App.map.addLayer(App.geoLayer);
        myMap.myLayerGroup.addLayer(App.geoLayer);
        //mapOb.myLayerGroup.addLayer(App.geoLayer);
    }
};

window.App = App


//var HOUNDLOWLAYER = {};

/*
const loadHatheropShp = () => {
    HOUNDLOWLAYER = new L.Shapefile("hounslow-photos-almost-complete.zip");
    console.log("my shp: ", HOUNDLOWLAYER);
    HOUNDLOWLAYER.addTo(Map);
};
*/

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
                //const f_id = snap.path.pieces_[4]  // fudege to retrieve feature key (parent piece) from the snapshot
                const f_id = snap.parent.key // fudege to retrieve feature key
                App.State.relDataSyncStatus[f_id] = true
                //console.log("resolved RelData for feature:", RelatedData.featureKey, f_id)
                App.updateRelDataSyncMsg(f_id)
                console.log("Pushed new Related Record :", f_id)
                // Remove record from local storage
                const localStorageKey = "backup.relatedData." + App.firebaseHash + "." + featureKey
                localStorage.removeItem(localStorageKey)

            })
            .catch(error => {
                console.log("My Error: " + error.message);
                alert("Sorry - something went wrong - have you logged in etc?");
                //document.getElementById("message-area").innerHTML="Sorry - "+ error.message
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
            "App/Maps/" + App.firebaseHash + "/Related/" + RelatedData.featureKey + "/"
        );
        console.log("nodePath: " + RelatedData.nodePath);
        const relatedRecord = {};
        relatedRecord.timestamp = Date();
        relatedRecord.user = firebase.auth().currentUser.uid;
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
        RelatedData.saveRelDataRecordToLocalStorage(App.firebaseHash, key, relatedRecord)
        RelatedData.pushRelatedDataRecord(RelatedData.nodePath, key, relatedRecord)
        document.getElementById("related-data-info").innerHTML = "Submitted!";
    },

    addPhoto: function() {
        const el = document.getElementById("photo-capture");
        // console.log("photo file: " + this.files[0].name)
        console.log(el.files[0].name);
        document.getElementById("related-data-photo").value = el.files[0].name;
    }




};

window.RelatedData = RelatedData

/*
saveRelDataRecordToLocalStorage: (mapHash, featureKey, relatedData) => {
        localStorage.setItem('backup.relatedData.' + mapHash + "." + featureKey, JSON.stringify(relateData);
        }

        */

function uploadMapToFirebase() {
    // grab the blobal Mapindex, then send gson layer up to node
    //const nodePath = String("'/App/Maps/" + myMap.settings.mapIndex)
    const nodePath = String("App/Maps/" + App.firebaseHash + "/Geo");

    fbDatabase
        .ref(nodePath)
        .set(App.geoLayer.toGeoJSON())
        .catch(function(error) {
            alert("Sorry you need to be logged in to do this");
        });
}

const User = function() {
    const email = document.getElementById("emailInput");
    const pw = document.getElementById("passwordInput");
    const msg = document.getElementById("Login-status-message");
    const loginBtn = document.getElementById("login-btn");
    const logoutBtn = document.getElementById("logout-btn");
    const loginForm = document.getElementById("login-form");
    const auth = firebase.auth;

    function signIn() {
        auth()
            .signInWithEmailAndPassword(email.value, pw.value)
            .then(function(user) {
                console.log(user, "signed in!");
                userSignedIn();
            })
            .catch(function(error) {
                console.log("sorry couldn't sign in -  Error: " + error);
                alert("sorry couldn't sign in -  Error: " + error);
            });
    }

    function signOut() {
        firebase
            .auth()
            .signOut()
            .then(
                function() {
                    // Sign-out successful.
                    console.log("successfully signed out");
                    userSignedOut();
                },
                function(error) {
                    // An error happened.
                    console.log("problem signing out - error: ", error);
                }
            );
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
        if (firebase.auth().currentUser) {
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
window.User = User


function loadMyLayer(layerName) {
    // just for testing
    //clearMyLayers();
    document.getElementById("open-new-project-button").style.display = "none";
    //loadFromPresetButtons(layerName);
    // console.log("LoadmyLayer!")
    loadProjectFromFirebase();

    function loadProjectFromFirebase() {
        retriveMapIndex();

        function retriveMapIndex() {
            document.getElementById("message-area").innerHTML =
                "<p>waiting for network connection ...</p>";
            fbDatabase
                .ref("/App/Mapindex")
                .once("value")
                .then(function(snapshot) {
                    document.getElementById("message-area").innerHTML = null;
                    console.log("fetched ok: ");
                    const el = document.getElementById("opennewproject");
                    el.insertAdjacentHTML("afterBegin", "Open project");
                    displayMapIndeces(snapshot);
                })
                .catch(error => {
                    console.log("My Error: " + error.message);
                    document.getElementById("message-area").innerHTML =
                        "Sorry - " + error.message;
                });
        }

        function displayMapIndeces(snapshot) {
            const el = document.getElementById("opennewproject");
            Object.values(snapshot.val()).map(item => {
                const btn = document.createElement("button");
                console.log(item.description);
                btn.setAttribute("value", item.mapID);
                btn.setAttribute("title", item.description);
                btn.className = "btn btn-primary open-project-button";
                //btn.setAttribute("onClick", String("this.loadJSONFromFB" + "()"))
                const id = item.mapID;
                btn.addEventListener("click", function(e) {
                    App.retrieveMapFromFireBase(e.target.value);
                    myMap.settings.mapIndex = e.target.value; // store map Index
                });
                btn.innerHTML = item.name;
                maplist.appendChild(btn);
                //const str = String("<p>" + item.description + "</p><br>")
                //el.insertAdjacentHTML('beforeEnd', str);
            });
        }
    }

    /*
    function loadFromPresetButtons(layerName) {
        if (layerName === "Ham") {
            myMap.settings.demoJSONmapdata = "ham-green-demo.json";
            loadOverlayLayer(myMap.settings.demoJSONmapdata);
        } else if (layerName === "Richmond") {
            myMap.settings.demoJSONmapdata = "richmondriverside.json";
            loadOverlayLayer(myMap.settings.demoJSONmapdata);
        } else if (layerName === "Richmond-all") {
            myMap.settings.demoJSONmapdata = "richmond-terr-all.json";
            loadOverlayLayer(myMap.settings.demoJSONmapdata);
        }
    }
    */
}

/*
function clearMyLayers() {
    // just for testing
}
*/

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
                    minZoom: 13,
                    maxZoom: 19,
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
firebase.initializeApp(fireBaseconfig);
const fbDatabase = firebase.database();
// --------------------------------------- Main ---------------------

let Map = myMap.setupBaseLayer();
// initDebugControl()
initLogoWatermark();

L.control.scale({ position: "bottomleft" }).addTo(Map);
App.initSettingsControl();

setupSideBar();
initLocationControl();
Map.doubleClickZoom.disable();

L.control.OfflineBaselayersControl({ position: "topright" }).addTo(Map);
const offlineLayerControls = setupOfflineBaseLayerControls()
offlineLayerControls.map(layer => { layer.addTo(Map) })
document.querySelectorAll(".leaflet-control-offline").forEach(el => { el.style.display = "none" });

// ----- offline service worker -----------

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // navigator.serviceWorker.register('/build/sw.js').then(registration => {  // works for dev
         navigator.serviceWorker.register('/build/sw.js').then(registration => {  // works for dev
            console.log('SW registered: ', registration);
        }).catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
        });
    });
}

// ---------------------------




//loadOverlayLayer("myMap.settings.demoJSONmapdata") // loads GeoJSON Browser's local storage if available otherwise loads local (initial) file

function loadOverlayLayer(fileRef) {
    myMap.myLayerGroup.clearLayers(App.geoLayer);
    if (localStorage.getItem("geoJSON") == null) {
        App.loadGeoJSONLayer(fileRef);
        console.log("no localstoge so retrieving fresh file");
    } else {
        console.log("reading json from Local storage");
        App.setupGeoLayer(JSON.parse(localStorage.getItem("geoJSON")));
    }
}

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

// Map.on("click", onMapClick);

/*
function onMapClick(e) {
    //App.sidebar.hide();
    console.log(e);
}
*/

Map.on("locationfound", updateLatestLocation)




function updateLatestLocation(e) {
    //console.log("locates location:", e)

    myMap.state.latestLocation = e.latlng
}


Map.on("popupclose", function(e) {
    App.sidebar.hide();
    App.selectedFeature = null;
});

/*
const loadFromShp = () => {
    var shpLayer = new L.Shapefile("test-park.zip");
    console.log("shpLayer: ", shpLayer);
    shpLayer.addTo(Map);
};
*/