#!/bin/bash
version=3.0.3
rm ./*.js *.css

# Perspective 3
wget https://cdn.jsdelivr.net/npm/@finos/perspective@$version/dist/cdn/perspective.js
# wget https://cdn.jsdelivr.net/npm/@finos/perspective@$version/dist/cdn/perspective.worker.js
wget https://cdn.jsdelivr.net/npm/@finos/perspective@$version/dist/pkg/perspective-js.wasm
wget https://cdn.jsdelivr.net/npm/@finos/perspective@$version/dist/pkg/web/perspective-server.js
wget https://cdn.jsdelivr.net/npm/@finos/perspective@$version/dist/pkg/web/perspective-server.wasm
# wget https://cdn.jsdelivr.net/npm/@finos/perspective@$version/dist/pkg/web/perspective.cpp.wasm
wget https://cdn.jsdelivr.net/npm/@finos/perspective-viewer@$version/dist/cdn/perspective-viewer.js
wget https://cdn.jsdelivr.net/npm/@finos/perspective-viewer@$version/dist/pkg/perspective-viewer.wasm
# wget https://cdn.jsdelivr.net/npm/@finos/perspective-viewer@$version/dist/pkg/perspective_bg.wasm
wget https://cdn.jsdelivr.net/npm/@finos/perspective-viewer-datagrid@$version/dist/cdn/perspective-viewer-datagrid.js
wget https://cdn.jsdelivr.net/npm/@finos/perspective-viewer-d3fc@$version/dist/cdn/perspective-viewer-d3fc.js
wget https://cdn.jsdelivr.net/npm/@finos/perspective-workspace@$version/dist/cdn/perspective-workspace.js
wget https://cdn.jsdelivr.net/npm/@finos/perspective-viewer@$version/dist/css/pro.css
wget https://cdn.jsdelivr.net/npm/@finos/perspective-workspace@$version/dist/css/pro.css
mv pro.css.1 workspace.pro.css


# Perspective 2
# wget https://cdn.jsdelivr.net/npm/@finos/perspective@$version/dist/cdn/perspective.js
# wget https://cdn.jsdelivr.net/npm/@finos/perspective@$version/dist/cdn/perspective.worker.js
# wget https://cdn.jsdelivr.net/npm/@finos/perspective@$version/dist/pkg/web/perspective.cpp.wasm
# wget https://cdn.jsdelivr.net/npm/@finos/perspective-viewer@$version/dist/cdn/perspective-viewer.js
# wget https://cdn.jsdelivr.net/npm/@finos/perspective-viewer@$version/dist/pkg/perspective_bg.wasm
# wget https://cdn.jsdelivr.net/npm/@finos/perspective-viewer-datagrid@$version/dist/cdn/perspective-viewer-datagrid.js
# wget https://cdn.jsdelivr.net/npm/@finos/perspective-viewer-d3fc@$version/dist/cdn/perspective-viewer-d3fc.js
# wget https://cdn.jsdelivr.net/npm/@finos/perspective-workspace@$version/dist/cdn/perspective-workspace.js
# wget https://cdn.jsdelivr.net/npm/@finos/perspective-viewer@$version/dist/css/pro.css
# wget https://cdn.jsdelivr.net/npm/@finos/perspective-workspace@$version/dist/css/pro.css
# mv pro.css.1 workspace.pro.css
