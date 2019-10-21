/*
 * =======================
 * Init patches
 * getAllJhipsterConfig isn't getting all jhipster config
 * Workaround https://github.com/jhipster/generator-jhipster/issues/10205
 */
function extend(Superclass) {
    return class GeneratorExtender extends Superclass {
        constructor(args, opts) {
            super(args, { ...opts, fromBlueprint: true }); // fromBlueprint variable is important

            if (!this.fromBlueprint) {
                this.blueprintConfig = this.config;
            }
        }
    };
}

module.exports = {
    extend
};
