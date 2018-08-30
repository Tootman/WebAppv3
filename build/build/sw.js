/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js");

importScripts(
  "precache-manifest.13df6e756d387ac49a2a98b3c085510b.js"
);

workbox.skipWaiting();
workbox.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "app.bundle.js",
    "revision": "38a1a259dc4dc4ef449bca8ec61463bd"
  },
  {
    "url": "build/sw.js",
    "revision": "68c4aca75254b5432040db4ea620b315"
  },
  {
    "url": "css/font-awesome.min.css",
    "revision": "a0e784c4ca94c271b0338dfb02055be6"
  },
  {
    "url": "css/images/layers-2x.png",
    "revision": "4f0283c6ce28e888000e978e537a6a56"
  },
  {
    "url": "css/images/layers.png",
    "revision": "a6137456ed160d7606981aa57c559898"
  },
  {
    "url": "css/images/marker-icon-2x.png",
    "revision": "401d815dc206b8dc1b17cd0e37695975"
  },
  {
    "url": "css/images/marker-icon.png",
    "revision": "2273e3d8ad9264b7daa5bdbf8e6b47f8"
  },
  {
    "url": "css/images/marker-shadow.png",
    "revision": "44a526eed258222515aa21eaffd14a96"
  },
  {
    "url": "css/leaflet.css",
    "revision": "58da535d4980b4c71b74a41bbee8a510"
  },
  {
    "url": "index.html",
    "revision": "20718b2d34d8454f0b01ee19a54260be"
  },
  {
    "url": "precache-manifest.ac0741e8c7dcfb0e265bc779a8ce3a23.js",
    "revision": "ac0741e8c7dcfb0e265bc779a8ce3a23"
  },
  {
    "url": "sw.js",
    "revision": "0b9e92c91a441c64eb1ef48d959758f9"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
