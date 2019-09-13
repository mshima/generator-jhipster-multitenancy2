// const debug = require('debug')('jhipster:multitenancy2:generator-overrides:add-return-rewrite-replace');

/*
 * =======================
 * Init patches
 * getAllJhipsterConfig isn't getting all jhipster config
 * Workaround https://github.com/jhipster/generator-jhipster/issues/10205
 */
module.exports = function(Superclass, jhipsterVersion) {
    return class GeneratorOverrides extends Superclass {
        // Ignore version > 6.2.0, not yet released
        static get ignoreGreaterThan() {
            return '6.2.0';
        }

        getAllJhipsterConfig(generator = this, force) {
            const configuration = Superclass.prototype.getAllJhipsterConfig.call(this, generator, force);
            const options = generator.options || {};
            const configOptions = generator.configOptions || {};
            configuration._get = configuration.get;
            configuration.get = function(key) {
                const ret = options[key] || configOptions[key] || configuration._get(key);
                // debug(`${key} = ${ret}`);
                return ret;
            };
            return configuration;
        }
    };
};
