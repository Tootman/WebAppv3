##  Description
WebApp intended for GIS Geo-spatial data collection (eg asset condition survey), using mobile device in the field.

version: 0.1 - not yet ready - not working reliably
# Features
 - Offline capability using ServiceWorker file Caching
 - Separate control for manual Caching of Basemap tiles
 - Caching Feature relatedData using localStorage, attempts to upload until successful upload to Firebase database (only works if logged in)

 # To-do
  - print map control (WebApp, MapAdmin console or both ??)
  - help control - reveals help related content , maybe with search  
  - Show map name on map  
  - PWA home-screen manifest
  - handling transfer of photos to cloud
 -  visual feedback indicateting selected feature, before opening the flyout panel so suggest onClick opens the popup with asset name and desription and edit button. Clicking the edit button Opens the Flyout window
  - Each map to have a 'map_reset_date' date (in Map Meta data object), the value of which can be edited by a user (a manager using MapAdmin console). If the most recent submitted relatedRecord for an Asset, has a timestamp dated after  map_reset_date, and has a condition other than 'not yet surveyed', then the Asset is marked as COMPLETED. Otherwise it is marked NOT_COMPLETED. (Not completed assets are coloured Red etc). So in other words,  the start date for the new survey is entered for map_reset_date, thereby resetting all Assets back to NOT_COMPLETED.  
  - Animated icon popup/label/control for indicating  'Working/processing/loading' to user (or progress bar)
  - ensure poly layer is drawn underneath points and lines  
   - short 
 
 
# Bugs / issues
 - Lines difficult to select by touching - make line/outline thicker - resolved 24/9/2018
    - Offline Caching of tiles sometimes crashes Browser in Android Chrome - how to debug in Android or simulate
  - Ensure all locally stored RelatedData is uploaded before new map is loaded
  - Find nearest feature stopped working (and throwing wrong error)
   - Flyout panel does not auto close after opening large dataset
    - LocalStorage.set exceeds quote for Houndlow condition survey (ie v large) dataset

# dev notes
- How to debug in Android Chrome - use of resources / memory / cache storage limit
- If possible, implement exponential Back-off for uploading to firebase in event of poor network connection.
- Move 'Task completed' Boolean from Geodata object to separate object somewhere in State)



# User Notes
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
 

