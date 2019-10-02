const semver = require('semver');
const _ = require('lodash');
const debug = require('debug')('auto-extender');

module.exports = function(Superclass, requiredPath = 'auto-extender') {
    if (_.isString(Superclass)) {
        Superclass = require(Superclass);
    }
    const modules = require('require-dir-all')(requiredPath);
    Object.keys(modules).forEach(moduleName => {
        const module = modules[moduleName];
        debug(`Adding ${moduleName} override`);
        if (_.isFunction(module)) {
            Superclass = module.extend(Superclass);
        } else {
            if (module.version) {
                const moduleVersion = require('pkginfo')(module, 'version').version;
                if (!semver.satisfies(moduleVersion, module.version)) {
                    debug(`Override module ${moduleName} ignored, version ${moduleVersion} not compatible with ${module.version}`);
                    return;
                }
            }
            Superclass = module.extend(Superclass);
        }
    });
    return Superclass;
};
