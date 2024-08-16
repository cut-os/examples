/**
 * Copyright (C) 2023-2030 - SipTimes Technologies Corporation - All rights reserved.
 */

const {src, dest, series} = require('gulp');
const del = require('del');
const zip = require('gulp-zip');
const {name, version} = require("./src/config.json");

function clean() {
    return del('target');
};

function copy() {
    return src('src/**/*')
        .pipe(dest('target/'));
}

function drv() {
    return src("target/**/*")
        .pipe(zip(`${name}-v${version}` + '.drv'))
        .pipe(dest("dist"));
}

exports.clean = clean;
exports.copy = copy;
exports.drv = drv;
exports.build = series(clean, copy, drv);