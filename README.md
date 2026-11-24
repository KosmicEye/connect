# KosmicEye Connect relay

Static page served by GitHub Pages at `https://kosmiceye.github.io/connect/azure/relay/`.

It is the one fixed redirect URI of the multi-tenant **KosmicEye Onboarding** app (TekYantra tenant).
Microsoft sign-in can only return to a registered address, and every Marketplace install has its
own portal host (`https://kosmiceye-<13 chars>.<region>.cloudapp.azure.com`), so Microsoft returns
here and this page forwards the response to that portal's `/setup/connect` page.

- The OAuth response stays in the URL fragment, which browsers never send to a server.
- The authorization code is useless without the PKCE verifier, which only the install's backend holds.
- The page checks the portal origin against an allowlist, then calls `location.replace`. It stores,
  logs and sends nothing.

Change the allowlist in `azure/relay/relay.js` if portals ever use other host names.
