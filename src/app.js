"use strict";

alert ("hello from script!");

// ----- offline service worker -----------

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
         navigator.serviceWorker.register('sw.js').then(registration => {  //  for dev
        
            console.log('SW registered: ', registration);
        }).catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
        });
    });
}

// ---------------------------

