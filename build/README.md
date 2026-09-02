# build/

electron-builder 的 `buildResources`:打包时的图标与签名配置。

```
icon.icns / icon.ico / icon.png   应用图标(自 wandesk-client 的 client/tauri/icons/ 搬来,源图 source.png 在那边)
tray.png                          托盘图标(64×64,壳加托盘时用)
entitlements.mac.plist            Hardened Runtime 例外:JIT / 未签名可执行内存 / 关库校验
entitlements.mac.inherit.plist    同上,给 Helper 进程继承
```

## 打包

```bash
npm run dist:mac            # 自用:出 release/mac-arm64/Wandesk.app,本机有 Developer ID 就顺手签,不公证
npm run dist:mac:release    # 发行:签名 + 公证 + 出 dmg,需要下面两个环境变量
```

发行模式沿用 wandesk-client 的约定:

```bash
export APPLE_SIGN_IDENTITY="Developer ID Application: <Team> (<TEAMID>)"   # security find-identity -v -p codesigning
export APPLE_NOTARY_PROFILE="<notarytool keychain profile>"                # xcrun notarytool store-credentials 存的名字
```

签名证书与公证凭据只在钥匙串里,不进仓库。
