/**
 * Copyright (C) 2010-2023 - SipTimes Technologies Corporation - All rights reserved.
 */

import fs from 'fs';
import del from 'del';
import gulp from 'gulp';

const {series, src, dest} = gulp;
import zip from 'gulp-zip';

const config = loadPackageJson();
const {name, version} = config;

function clean() {
    return del('target');
}

function copy() {
    return src('src/**/*')
        .pipe(dest('target/'));
}

function sdk() {
    return src("target/**/*")
        .pipe(zip(`${name}-sdk-v${version}` + '.zip'))
        .pipe(dest("dist"));
}

function loadPackageJson() {
    try {
        const jsonData = fs.readFileSync('./package.json', 'utf8');
        return JSON.parse(jsonData);
    } catch (err) {
        console.error('Error reading file:', err);
    }
}

const build = series(clean, copy, sdk);

export {clean, copy, sdk, build};
