# build/

electron-builder's `buildResources`: icons and signing configuration used at packaging time.

```
icon.icns / icon.ico / icon.png   App icons (carried over from wandesk-client's client/tauri/icons/, source.png lives there)
tray.png                          Tray icon (64×64, used if/when the shell adds a tray)
entitlements.mac.plist            Hardened Runtime exceptions: JIT / unsigned executable memory / disabled library validation
entitlements.mac.inherit.plist    Same as above, inherited by helper processes
```

## Packaging

```bash
npm run dist:mac            # For personal use: produces release/mac-arm64/Wandesk.app, signs opportunistically if this machine has a Developer ID, no notarization
npm run dist:mac:release    # For release: sign + notarize + produce a dmg, needs the two environment variables below
```

Release mode follows wandesk-client's convention:

```bash
export APPLE_SIGN_IDENTITY="Developer ID Application: <Team> (<TEAMID>)"   # security find-identity -v -p codesigning
export APPLE_NOTARY_PROFILE="<notarytool keychain profile>"                # the name stored via xcrun notarytool store-credentials
```

The signing certificate and notarization credentials live only in the keychain, never in the repo.
