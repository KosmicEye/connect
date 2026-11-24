// KosmicEye "Connect your Azure" relay.
//
// Microsoft sign-in can only return to a redirect URI registered on the
// KosmicEye Onboarding app, and every install's portal has its own host name.
// This page is that one fixed redirect URI: it reads the portal's origin from
// the OAuth state and forwards the response (in the URL fragment, never sent to
// any server) to that portal's /setup/connect page.
//
// It does nothing else. The authorization code is useless without the PKCE
// verifier, which only the install's own backend holds. No data is stored,
// logged or sent anywhere by this page.
(function () {
  "use strict";

  // Install portals: https://kosmiceye-<13 chars>.<region>.cloudapp.azure.com
  var ALLOWED_ORIGIN = /^https:\/\/kosmiceye-[a-z0-9]{13}\.[a-z0-9]+\.cloudapp\.azure\.com$/;

  function fail(text) {
    var el = document.getElementById("msg");
    el.textContent = text;
    el.className = "err";
  }

  function b64urlDecode(s) {
    s = s.replace(/-/g, "+").replace(/_/g, "/");
    while (s.length % 4) s += "=";
    return atob(s);
  }

  var fragment = window.location.hash.replace(/^#/, "");
  // Drop the response from this page's URL and history straight away.
  try { history.replaceState(null, "", window.location.pathname); } catch (e) {}

  if (!fragment) {
    fail("Nothing to do here. Start from the Connect your Azure button in your KosmicEye portal.");
    return;
  }

  var state = new URLSearchParams(fragment).get("state") || "";
  var origin;
  try {
    origin = JSON.parse(b64urlDecode(state.split("~")[0])).o;
  } catch (e) {
    origin = null;
  }

  if (typeof origin !== "string" || !ALLOWED_ORIGIN.test(origin)) {
    fail("This sign-in did not come from a KosmicEye portal, so it was stopped. Start again from your KosmicEye portal.");
    return;
  }

  window.location.replace(origin + "/setup/connect#" + fragment);
})();
