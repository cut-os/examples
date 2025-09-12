/**
 * Copyright (C) 2010-2023 - SipTimes Technologies Corporation - All rights reserved.
 */

const { src, dest, series } = require('gulp');
const del = require('del');
const zip = require('gulp-zip');
const {name, version} = require("./package.json");

function clean(){
    return del('target');
}

function copy(){
    return src('dist/**/*')
        .pipe(dest('target/'));
}

function lwa(){
    return src("target/**/*")
        .pipe(zip(`${name}-v${version}` + '.lwa'))
        .pipe(dest("target"));
}

exports.clean = clean;
exports.copy = copy;
exports.lwa = lwa;
exports.build = series(clean, copy, lwa);
