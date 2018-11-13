# lnpx
npx for local npm package binaries (also search parent folders)

# Why?

- `npx` only searches for latest `node_modules` folder. But my case is that the binary exists on another upper `node_modules` folder, structure as:
  - `root`
    - `node_modules`
      - `.bin/foo`
    - `sub-folder`
      - `node_modules`
      - `sub2` (The folder where bin `"foo"` wants to be executed.)

The `lnpx` will search both `sub-folder/node_modules` and `root/node_modules` and any other parent folders, and also the global npm bin folder.
