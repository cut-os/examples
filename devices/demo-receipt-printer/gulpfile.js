/**
 * Copyright (C) 2010-2024 - SipTimes Technologies Corporation - All rights reserved.
 */

const {src, dest} = require('gulp');
const zip = require('gulp-zip');
const {name, version} = require("./public/config.json");

function lwa() {
    return src("target/**/*")
      .pipe(zip(`${name}-v${version}.lwa`))
      .pipe(dest("dist"));
}

exports.build = lwa;
