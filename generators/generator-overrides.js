const semver = require('semver');
const packagejs = require('generator-jhipster/package.json');
const debug = require('debug')('jhipster:multitenancy2:generator-overrides');

const jhipsterVersion = packagejs.version;

module.exports = function(Superclass) {
    const modules = require('require-dir-all')('generator-overrides');
    Object.keys(modules).forEach(key => {
        const module = modules[key];
        debug(`Adding ${key} override`);
        if (module.extendVersion) {
            if (module.extendVersion.equals && jhipsterVersion !== module.extendVersion.equals) {
                debug(`GeneratorOverride ${key} ignored equals ${module.extendVersion.equals}`);
                return;
            }
            if (module.extendVersion.notGreaterThan && semver.gt(jhipsterVersion, module.extendVersion.notGreaterThan)) {
                debug(`GeneratorOverride ${key} ignored greate then ${module.extendVersion.notGreaterThan}`);
                return;
            }
        }
        Superclass = module.extend(Superclass);
    });
    return class GeneratorExtender extends Superclass {
        /*
         * This method should not be added to yo queues otherwise will abort.
         */
        receive() {
            this.error('GeneratorOverrides');
        }
    };
};
