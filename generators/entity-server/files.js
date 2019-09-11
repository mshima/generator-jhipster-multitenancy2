const jhipsterConstants = require('generator-jhipster/generators/generator-constants');

const Patcher = require('../patcher');

const entityTenantAwareTemplates = ['tenant_aware_add_filter/Entity.java'];

const tenantTemplates = [
    // Add PreAuthorize role to Tenant
    // TODO change it to allow a Tenant admin to change tenant's data
    'change_tenant_management_role/_TenantResource',
    // Add a verification if a tenant has users before removing it.
    // TODO Remove, use db relationship and non cascade.
    'server/_TenantResource',
    // Fetch users eager. TODO Remove?
    'server/_Tenant.java'
];

function writeTenantAwareFiles() {
    const tenantAwarefiles = {
        templates: [
            {
                condition: generator => generator.tenantAware,
                path: this.SERVER_MAIN_SRC_DIR,
                templates: [
                    {
                        file: 'package/_EntityAspect.java',
                        renameTo: generator => `${this.packageFolder}/aop/${this.tenantNameLowerFirst}/${this.entityClass}Aspect.java`
                    }
                ]
            }
        ]
    };

    this.writeFilesToDisk(tenantAwarefiles, this, false);
}

function writeTenantFiles() {
    const tenantFiles = {
        aop: [
            // copy over aspect
            {
                path: this.SERVER_MAIN_SRC_DIR,
                templates: [
                    {
                        file: 'package/domain/_TenantParameter.java',
                        renameTo: generator => `${this.packageFolder}/domain/${this.tenantNameUpperFirst}Parameter.java`
                    },
                    {
                        file: 'package/aop/_tenant/_TenantAspect.java',
                        renameTo: generator =>
                            `${this.packageFolder}/aop/${this.tenantNameLowerFirst}/${this.tenantNameUpperFirst}Aspect.java`
                    }
                ]
            }
        ],
        liquibase: [
            // User database changes
            {
                path: jhipsterConstants.SERVER_MAIN_RES_DIR,
                templates: [
                    {
                        file: 'config/liquibase/changelog/_user_tenant_constraints.xml',
                        renameTo: generator =>
                            `config/liquibase/changelog/${this.changelogDate}-1__user_${this.tenantNameUpperFirst}_constraints.xml`
                    }
                ]
            },
            {
                path: jhipsterConstants.SERVER_MAIN_RES_DIR,
                templates: [
                    {
                        file: 'config/liquibase/changelog/_tenant_user_data.xml',
                        renameTo: generator =>
                            `config/liquibase/changelog/${this.changelogDate}-2__${this.tenantNameLowerCase}_user_data.xml`
                    }
                ]
            },
            {
                path: jhipsterConstants.SERVER_MAIN_RES_DIR,
                templates: [
                    {
                        file: 'config/liquibase/data/_tenant.csv',
                        renameTo: generator => `config/liquibase/data/${this.tenantNameLowerCase}.csv`
                    }
                ]
            },
            {
                path: jhipsterConstants.SERVER_MAIN_RES_DIR,
                templates: [
                    {
                        file: 'config/liquibase/data/_tenant_user.csv',
                        renameTo: generator => `config/liquibase/data/${this.tenantNameLowerCase}_user.csv`
                    }
                ]
            },
            {
                path: jhipsterConstants.SERVER_MAIN_RES_DIR,
                templates: [
                    {
                        file: 'config/liquibase/data/_tenant_authority.csv',
                        renameTo: generator => `config/liquibase/data/${this.tenantNameLowerCase}_authority.csv`
                    }
                ]
            },
            {
                path: jhipsterConstants.SERVER_MAIN_RES_DIR,
                templates: [
                    {
                        file: 'config/liquibase/data/_tenant_user_authority.csv',
                        renameTo: generator => `config/liquibase/data/${this.tenantNameLowerCase}_user_authority.csv`
                    }
                ]
            }
        ]
    };

    this.writeFilesToDisk(tenantFiles, this, false);

    this.addConstraintsChangelogToLiquibase(`${this.changelogDate}-1__user_${this.tenantNameUpperFirst}_constraints`);
    this.addConstraintsChangelogToLiquibase(`${this.changelogDate}-2__${this.tenantNameLowerCase}_user_data`);
}

module.exports = class EntityServerPatcher extends Patcher {
    constructor(generator) {
        super(generator, 'entity-server');
    }

    entityTenantAwareTemplates(generator) {
        this._patch(generator, entityTenantAwareTemplates, writeTenantAwareFiles);
    }

    tenantTemplates(generator) {
        this._patch(generator, tenantTemplates, writeTenantFiles);
    }
};
