## WebApp Mapping App
WebApp intended for GIS Geo-spatial data collection (eg asset condition survey), using mobile device in the field.

version: 0.1 - not yet ready - not working reliably
# Features
 - Offline capability using ServiceWorker file Caching
 - Separate control for manual Caching of Basemap tiles
 - Caching Feature relatedData using localStorage, attempts to upload until successful upload to Firebase database (only works if logged in)
 
# Bugs / fixes to do
 - Lines difficult to select by touching - make thicker
 - Refactor into es6 patterns
 - Major Refactor - Seperate objects and namespaces into separate modules
 - Move 'Task completed' Boolean from Geodata object to separate object somewhere in State)
 - Show map name on map
 - help control - reveals help related content
 - How to debug in Android Chrome - use of resources / memory / cache storage limit
 - If possible, implement exponential Back-off for uploading to firebase in event of poor network connection.
 - Offline Caching of tiles sometimes crashes Browser in Android Chrome - how to debug in Android or simulate
  - logic for handling transfer of photos to cloud
   - PWA home-screen manifest
    - Ensure all locally stored RelatedData is uploaded before new map is loaded


# Notes
Demo : <https://tootman.github.io/WebAppv3/>
NOte that many features will only be available if logged in
runs from /build/ only
Behaviour:
 - Can only open a new map from the Cloud
 - Automatically Stores a copy of the current map locally 
 - Opening the App loads in the locally stored map (if it exists)
 - The map data is immutable.
  - Related Data can be added (it cannot be removed or edited)

 # How it it built - what does it use
 - Leaflet Mapping API
 - WebPack producing minified es5 js bundle with some of the CSS embedded,
 - Firebase database for Cloud storage
 - LocalStorage backup when offline ServiceWorker (using BoxWorker) for PWA capability, 
 - LocalForage for Offline Background map Tiles
 

