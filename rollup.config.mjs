import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import path from "node:path";
import url from "node:url";

const isWatching = !!process.env.ROLLUP_WATCH;
const sdPlugin = "com.dtrt.clicker.sdPlugin";

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: "src/plugin.ts",
  output: {
    file: `${sdPlugin}/bin/plugin.js`,
    sourcemap: isWatching,
    sourcemapPathTransform: (relativeSourcePath, sourcemapPath) => {
      return url.pathToFileURL(path.resolve(path.dirname(sourcemapPath), relativeSourcePath)).href;
    }
  },
  plugins: [
    {
      name: "watch-externals",
      buildStart: function () {
        this.addWatchFile(`${sdPlugin}/manifest.json`);
        this.addWatchFile(`${sdPlugin}/property-inspector/inspector.css`);
        this.addWatchFile(`${sdPlugin}/property-inspector/inspector.html`);
        this.addWatchFile(`${sdPlugin}/property-inspector/inspector.js`);
      },
    },
    typescript({
      mapRoot: isWatching ? "./" : undefined
    }),
    nodeResolve({
      browser: false,
      exportConditions: [ "node" ],
      modulePaths: [ "./src/modules" ],
      preferBuiltins: true
    }),
    commonjs(),
    !isWatching && terser(),
    {
      name: "emit-module-package-file",
      generateBundle() {
        this.emitFile({ fileName: "package.json", source: `{ "type": "module" }`, type: "asset" });
      }
    }
  ]
};

export default config;
