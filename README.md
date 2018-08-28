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

# Notes
Demo : <https://tootman.github.io/WebAppv3/>
NOte that many features will only be available if logged in

# Caching tile for offline use when using Localhost
local/Offline cached version of WebApp works from LocalHost:8080 (ie npm's LocalServer). however this version does not currently serve the ServiceWorker supplied cached files. (Issue with Webpack's Workbox config presumably)
As a workaround, use Xampp (or equivalent and navigate to , however this version CSS files and other assets are missing (not included in the bundle).
 
 # How it it built - what does it use
 - Leaflet Mapping API
 - WebPack producing minified es5 js bundle with some of the CSS embedded,
 - Firebase database for Cloud storage
 - LocalStorage backup when offline ServiceWorker (using BoxWorker) for PWA capability, LocalForage for Offline Background map Tiles
 

