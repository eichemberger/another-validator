import typescript from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

export default {
    input: 'src/index.ts',
    output: {
        file: 'dist/index.min.js',
        format: 'cjs',
    },
    plugins: [
        typescript(),
        resolve(),
        commonjs(),
        terser(),
    ],
};