/*
import L from "leaflet";
import firebase from "firebase";
//import "./style.scss";
import "leaflet-offline";
import localforage from "localforage";
//import logoImg from "./ORCL-logo-cropped.png";
import leafletKnn from "leaflet-knn";
//import fontello_ttf from "./fontello/font/fontello.ttf";
require("./L.Control.Sidebar");
require("./L.Control.Locate.min");
import { tilesDb } from "./offline-tiles-module.js";
import { User } from "./User.js";
*/

export const otherMod = {
  //console.log("myFunc in djsMod!")
  goodbye: () => {
    console.log("bye from djs mod!");
    return "godbye";
    //alert("hello from djs mod!");
  }
};

export const djsModmyFunc = {
  //console.log("myFunc in djsMod!")
  hello: () => {
    console.log("hello from djs mod!");
    return "hello";
    //alert("hello from djs mod!");
  }
};
