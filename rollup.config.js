import resolve from "rollup-plugin-node-resolve";
import filesize from "rollup-plugin-filesize";
import { uglify } from "rollup-plugin-uglify";
import pkg from "./package.json";
import commonjs from "rollup-plugin-commonjs";
import cleanup from "rollup-plugin-cleanup";
import json from "rollup-plugin-json";

const commonjsOptions = {
  ignoreGlobal: true,
  include: /node_modules/
};

const input = pkg.main;

const plugins = [
  resolve(),
  commonjs(commonjsOptions),
  json(),
  cleanup(),
  uglify(),
  filesize()
];

const globals = {
  react: "React",
  "react-doc": "ReactDOM"
};

const capitalize = s => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export default [
  {
    input,
    output: {
      file: "umd/pan-responder-hook.js",
      format: "umd",
      name: capitalize("pan-responder-hook"),
      globals
    },
    external: Object.keys(globals),
    plugins
  }
];
