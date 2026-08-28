# runtime/bin

打包时把各平台的 workerd 二进制放这里:

```
runtime/bin/workerd        macOS / Linux
runtime/bin/workerd.exe    Windows
```

开发态不需要 —— `supervisor.ts` 会回落到 `node_modules/@cloudflare/workerd-<platform>/bin/workerd`。

单平台约 150MB,每个发行包只带自己那一份。
