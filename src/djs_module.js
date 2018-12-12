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
export const pushNewPointToFirebase = ({ mapID, Json }) => {
  const fbDatabase = firebase.database();
  const refPath = `App/Maps/${mapID}/Markers/`;
  // need to test if /Markers exists though
  //fbDatabase.ref(refPath).push(Json)) //
};

export const markersFromSnapshot = ({ snapshot }) => {
  const geojsonMarkers = Object.keys(snapshot).map(featureKey => {
    return {
      coordinates: snapshot[featureKey].coordinates,
      type: snapshot[featureKey].type,
      propertires: snapshot[featureKey].properties
    };
  });

  return geojsonMarkers;
};

export const generateNewPointGeoJson = ({
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
};
