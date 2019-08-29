module.exports = {
    fixGetAllJhipsterConfig
};

function fixGetAllJhipsterConfig(generator) {
    const options = generator.options;
    const configOptions = generator.configOptions;
    generator._getAllJhipsterConfig = generator.getAllJhipsterConfig;
    generator.getAllJhipsterConfig = function(generator = this, force) {
        const configuration = this._getAllJhipsterConfig(generator, force);
        configuration._get = configuration.get;
        configuration.get = function(key) {
            const ret = options[key] || configOptions[key] || configuration._get(key);
            // generator.log(`${key} = ${ret}`);
            return ret;
        };
        return configuration;
    };
}
