const semver = require('semver');
const packagejs = require('generator-jhipster/package.json');
const debug = require('debug')('jhipster:multitenancy2:generator-overrides');

const jhipsterVersion = packagejs.version;

module.exports = function(Superclass) {
    const modules = require('require-dir-all')('generator-overrides');
    Object.keys(modules).forEach(key => {
        const override = modules[key];
        debug(`Adding ${key} override`);
        const ignoreGreaterThan = override.ignoreGreaterThan;
        if (ignoreGreaterThan && semver.gt(jhipsterVersion, ignoreGreaterThan)) {
            debug(`GeneratorOverride ${key} ignored ${ignoreGreaterThan}`);
            return;
        }
        Superclass = override(Superclass);
    });
    return class GeneratorOverrides extends Superclass {
        /*
         * This method should not be added to yo queues otherwise will abort.
         */
        receive() {
            this.error('GeneratorOverrides');
        }
    };
};
