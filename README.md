# WebApp
---
version: 0.9.06 - beta

###  Description
'WebApp' is a browser-based Mapping Web App designed for GIS Geo-spatial data collection - (in partituclar, asset condition surveys), using smartphone, in the field. 

### Features
 - Offline capability using ServiceWorker (ie PWA)
 - Slippy Basemap tile caching
 - Highling  of not-yet surveyed features on map
 - cloud storage of data, falling back to localStorage / cached data when Off-line

## User guidance / notes
 - Live Demo : <https://tootman.github.io/WebAppv3/>
 - only logged in users can submit Related data
 - Recommend only using GPS feature when needed (continuous GPS usage drains battery at a much faster rate)
 - Large datasets may cause the App to crash or freeze or slow-down on lower-spec phones

### device requirements
 - GPS enabled smartphone running modern (supported) browser
 - Rugged / waterproof casing recomended
 - capacitive stylus recommeded (eg when cold weather and wearing gloves) 
 - (Also suitable for small laptop or a tablet if tethered to 4G device, or has 4G dongle etc)
 - Recommend using 'mid-range' or 'high-end' smartphone since the App is CPU intensive

### feature wish-list
   - 'help' - in-app guidance / help on App usage and troubleshooting   
  - Show map name on map  
  - impliment PWA home-screen manifest
  - impliment  transfer of photos to cloud
 -  Each map to have a 'map_reset_date' date (in Map Meta data object), the value of which can be edited by a user (a manager using MapAdmin console). If the most recent submitted relatedRecord for an Asset, has a timestamp dated after  map_reset_date, and has a condition other than 'not yet surveyed', then the Asset is marked as COMPLETED. Otherwise it is marked NOT_COMPLETED. (Not completed assets are coloured Red etc). So in other words,  the start date for the new survey is entered for map_reset_date, thereby resetting all Assets back to NOT_COMPLETED.  
  - Animated icon popup/label/control for indicating  'Working/processing/loading' to user (or progress bar)
   - drop-down list of bookmarks (or named map extents or bounds, expecially needed for large maps maps with multiple sites )
   - Replace LocalStorage objects with localDatabase (eg Indexeddb) - to improve performace of data storage/retrieval operations
  
### Bugs / issues
 - Offline Caching of tiles sometimes crashes Browser  in Android Chrome - how to debug in Android or simulate
  - Ensure all locally stored RelatedData is uploaded before new map is loaded
   - Flyout panel does not aloways auto close (especially after opening large dataset)
   - Auto close flyout window after related-data form is submitted
   - need to indicate to user when related data form has been sucessfully submitted 
    - LocalStorage.set exceeds quote for Houndlow condition survey (ie v large) dataset
   - how to get browser to reload new version of files ie how to propertly implement version control

### dev notes
- How to debug in Android Chrome - use of resources / memory / cache storage limit
- If possible, implement 'exponential Back-off' for uploading to firebase in event of poor network connection.
- Move 'Task completed' Boolean from Geodata object to separate object somewhere in State)
 - Issue of how to handle multiple point features at exact same location - suggested solution - re-process map to force co-incentent features to be seperated geographically - eg signs on post, position above each other to be spaced out say 10cm appart (maybe surrounding the mapped point, or linearly, say due north)
 - js bundle only seems to run from /build/ folder

### user stories
* A a GIS surveyor working in-the-field I want to:
    *  inspect features (assets) and submit a form recording it's condition, along with a timestamp, my userID, a Photo of the feature (optional), and any notes /comments (optional)
    *  Using just my smartphone 
    *  Show my location relative to the map (using GPS)
    
### User requirement
 * Must be easy to access the App
 * Must be simple to use
 * Must ensure no submitted data is 'lost'

### Functional specification (pseudocode)
    onSubmitRelatedData:
        copy_relatedDataRecord_to_localStorage
        if user is logged in then attempt to send RelatedDataRecord to cloud
            then set corresponding feature symbology to completed
        
    onLoadApp:
        display_mapData_held_in_local_storage_ifExists
        try to send RelatedDataRecords in local storage to cloud
    
    onRelatedDataRecord_Sucessfully_Sent_to_cloud:
        delete_local_RelatedDataRecord

    on_click_a_different_feature:
        set previous_feature_style back to original_style
        set current feature style to highlightStyle
        display_popup

    on_setup_features_layer:
        clear layer
        populaterelatedData
        forEachFeature:
            set style completed or not completed depending on corresponding relatedDataRecord

      on_populate_relatedData:
            forEach relatedDataRecord
                set relatedDataItem with keyname OJBECTID to most recent record
    
      on_feature_popup_click:
            Make a reference to the current feature available to the whole app
            open the Flyout window reading in data for the current feature


### Behaviour:
 - Can only open a new map from the Cloud
 - Automatically Stores a copy of the current map locally 
 - Opening the App loads in the locally stored map (if it exists)
 - The map data is immutable.
  - Related Data can be added (it cannot be removed or edited)

### Technology stack
 - Leaflet  - Mapping library API
 - fontello - small set of svg icons)
 - leafletKnn - measureing spatial distances between features or coordinates  
 - WebPack -  producing minified es5 js bundle with some of the CSS embedded,
 - Firebase database for Cloud storage of all data
 - LocalStorage backup when offline ServiceWorker (using BoxWorker) for PWA capability, 
 - LocalForage + tilesdb for Offline Background slippy map Tiles
 

