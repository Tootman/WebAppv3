import {
  //djsModmyFunc,
  //otherMod,
  generateNewPointGeoJson,
  markersFromSnapshot
} from "./djs_module.js";
import L from "leaflet";
import firebase from "firebase";
import "leaflet-offline";
import localforage from "localforage";
import leafletKnn from "leaflet-knn";
require("./L.Control.Sidebar");
require("./L.Control.Locate.min");
import { tilesDb } from "./offline-tiles-module.js";
import { User } from "./User.js";
//import { User } from "./User.js";
//import { myOb } from "./app.js";

// const myNameSet = ['Jimmy', 'Scott', 'scott', 'Courtney','Steve']
const properties = {};
properties.user = "vavYsTGAwWZJBP47NFx2kOz2wI13";
properties.photo = "1234567.jpg";
properties.type = "hazard";
properties.timeStamp =
  "Tue Dec 11 2018 11:23:20 GMT+0000 (Greenwich Mean Time)";
properties.comment = "my comment..";

const geometry = {};
geometry.coordinates = [-0.4523214453133929, 51.441147766557826];
geometry.type = "Point";

const returnedSnapshot = {
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

const refGeosonArr = [
  {
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
  },
  {
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
  {
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
];

const refGeosonOb = {
  type: "Feature",
  geometry: geometry,
  properties: properties
};

describe("Create GeoJson Feature string", () => {
  //const featureOb = { lat: "hellox!" };

  const options = {
    type: "hazard", // point/ Marker type
    lng: -0.4523214453133929,
    lat: 51.441147766557826,
    user: "vavYsTGAwWZJBP47NFx2kOz2wI13",
    timeStamp: "Tue Dec 11 2018 11:23:20 GMT+0000 (Greenwich Mean Time)",
    photo: "1234567.jpg",
    comment: "my comment.."
  };

  it("should output ob", () => {
    expect(generateNewPointGeoJson(options)).toEqual(refGeosonOb);
  });

  //console.log("jsonStr:", jsonStr);
});

describe("Read Markers json from FB into featuresJSon array", () => {
  //const featureOb = { lat: "hellox!" };

  it("should output ob", () => {
    expect(markersFromSnapshot(returnedSnapshot)).toEqual(refGeosonArr);
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
