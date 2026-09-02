# runtime/bin

Put the per-platform workerd binaries here when packaging:

```
runtime/bin/workerd        macOS / Linux
runtime/bin/workerd.exe    Windows
```

Not needed in development —— `supervisor.ts` falls back to `node_modules/@cloudflare/workerd-<platform>/bin/workerd`.

About 150MB per platform; each release build only ships its own copy.
