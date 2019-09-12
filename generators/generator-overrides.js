const semver = require('semver');
const packagejs = require('generator-jhipster/package.json');
const debug = require('debug')('jhipster:multitenancy2:generator-overrides');

const jhipsterVersion = packagejs.version;

const jhipsterUtils = require('./utils-overrides');

const overrides = [];

overrides.push(require('./generator-overrides/add_return_rewrite_replace'));

module.exports = function(Superclass) {
    overrides.forEach(override => {
        const ignoreGreaterThan = override.ignoreGreaterThan;
        if (ignoreGreaterThan && semver.gt(jhipsterVersion, ignoreGreaterThan)) {
            debug(`GeneratorOverride ignored ${ignoreGreaterThan}`);
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
