const DriverClass = require('./driver-template');

// The following logic section is used for driver loading, please do not modify it arbitrarily.
let driver = null;
module.exports = {
    init: function (args) {
        if (driver === null) {
            driver = new DriverClass(args);
        }
        return driver;
    }
};
