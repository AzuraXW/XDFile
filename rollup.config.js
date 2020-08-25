import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from "rollup-plugin-babel";
import { terser } from 'rollup-plugin-terser';
import { eslint } from 'rollup-plugin-eslint';

// 当前环境
const isDev = process.env.NODE_ENV !== 'production';

const formats = ['iife', 'es']
export default formats.map(format => ({
  input: './src/index.js',
  output: {
    name: 'XDFile',
    file: `dist/XDFile.${format}.js`,
    format
  },
  plugins: [
    resolve(),  // 这样 Rollup 能找到 `ms`
    commonjs(), // 这样 Rollup 能转换 `ms` 为一个ES模块
    eslint(),
    babel({
      exclude: 'node_modules/**', // 防止打包node_modules下的文件
      runtimeHelpers: true,       // 使plugin-transform-runtime生效
    }),
    !isDev && terser()
  ]
}));
