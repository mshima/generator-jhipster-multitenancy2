/* eslint-disable consistent-return */
const _ = require('lodash');
const CommonGenerator = require('generator-jhipster/generators/common');
const debug = require('debug')('jhipster:multitenancy2:common');

const mtUtils = require('../multitenancy-utils');

module.exports = class extends CommonGenerator {
    constructor(args, opts) {
        super(args, { ...opts, fromBlueprint: true }); // fromBlueprint variable is important

        this.option('tenant-name', {
            desc: 'Set tenant name',
            type: String,
            required: false
        });

        this.option('tenant-changelog-date', {
            desc: 'Use liquibase changelog date to reproducible builds',
            type: String,
            required: false
        });

        this.option('default-tenant-aware', {
            desc: 'Default for whether you make an entity tenant aware or not',
            type: Boolean,
            required: false
        });

        this.option('relation-tenant-aware', {
            desc: 'Use existing relationship with tenant',
            type: Boolean,
            defaults: false
        });

        this.option('tenant-file-suffix', {
            desc: 'Use suffix for tenant files',
            type: String,
            required: false
        });

        this.tenantName = this.options.tenantName || this.config.get('tenantName');
        this.tenantFileSuffix = this.options.tenantFileSuffix || this.config.get('tenantFileSuffix');
        this.tenantChangelogDate = this.options['tenant-changelog-date'] || this.config.get('tenantChangelogDate');
    }

    get initializing() {
        const myCustomPhaseSteps = {
            loadConf() {
                this.configOptions.baseName = this.baseName;

                if (this.options['tenant-changelog-date'] !== undefined) {
                    this.config.set('nextChangelogDate', this.tenantChangelogDate);
                } else if (this.tenantChangelogDate === undefined) {
                    this.tenantChangelogDate = this.dateFormatForLiquibase();
                }
                this.config.set('tenantChangelogDate', this.tenantChangelogDate);
                this.config.set('tenantFileSuffix', this.tenantFileSuffix);
                debug(`Using tenantFileSuffix: ${this.tenantFileSuffix}`);

                // This will be used by entity-server to crate "@Before" annotation in TenantAspect
                this.configOptions.tenantAwareEntities = [];

                /* tenant variables */
                mtUtils.tenantVariables.call(this, this.config.get('tenantName'), this);
            }
        };
        return { ...super._initializing(), ...myCustomPhaseSteps };
    }

    get prompting() {
        const myCustomPhaseSteps = {
            askTenantAware() {
                const prompts = [
                    {
                        when: this.tenantName === undefined,
                        name: 'tenantName',
                        message: 'What is the alias given tenants in your application?',
                        default: 'Company',
                        validate: input => {
                            if (_.toLower(input) === 'account') {
                                return `${input} is a reserved word.`;
                            }
                            return true;
                        }
                    }
                ];
                const done = this.async();
                this.prompt(prompts).then(props => {
                    if (props.tenantName) {
                        mtUtils.tenantVariables.call(this, props.tenantName, this);
                    }
                    done();
                });
            }
        };
        return { ...super._prompting(), ...myCustomPhaseSteps };
    }

    get configuring() {
        // Here we are not overriding this phase and hence its being handled by JHipster
        const configuringCustomPhaseSteps = {
            saveConf() {
                this.tenantNameExists = this.config.get('tenantName') !== undefined;

                this.configOptions.tenantName = this.tenantName;

                this.config.set('tenantName', this.tenantName);
                this.config.set('tenantChangelogDate', this.tenantChangelogDate);
                this.config.set('tenantFileSuffix', this.tenantFileSuffix);
            }
        };
        // configuringCustomPhaseSteps should be run after configuring, otherwise tenantName will be overridden
        return { ...super._configuring(), ...configuringCustomPhaseSteps };
    }

    get default() {
        // Here we are not overriding this phase and hence its being handled by JHipster
        return super._default();
    }

    get writing() {
        const writingPreCustomPhaseSteps = {
            generateTenant() {
                if (this.tenantNameExists) {
                    debug('Ignoring entity-tenant since tenantName already is saved to .yo-rc.json');
                    return;
                }

                const options = this.options;
                const configOptions = this.configOptions;

                this.composeWith(require.resolve('../entity-tenant'), {
                    ...options,
                    configOptions,
                    regenerate: false,
                    'skip-install': false,
                    debug: this.isDebugEnabled,
                    arguments: [this.tenantName]
                });
            }
        };
        return { ...writingPreCustomPhaseSteps, ...super._writing() };
    }

    get install() {
        return super._install();
    }

    get end() {
        return super._end();
    }
};
