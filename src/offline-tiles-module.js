import localforage from 'localforage';

// related to leaflet-offline-tiles
export const tilesDb = {
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
