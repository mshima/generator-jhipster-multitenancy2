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
                condition: context => context.tenantAware,
                path: this.SERVER_MAIN_SRC_DIR,
                templates: [
                    {
                        file: 'package/_EntityAspect.java',
                        renameTo: context => `${context.packageFolder}/aop/${context.tenantNameLowerFirst}/${context.entityClass}Aspect.java`
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
                condition: context => context.isTenant,
                path: this.SERVER_MAIN_SRC_DIR,
                templates: [
                    {
                        file: 'package/domain/_TenantParameter.java',
                        renameTo: context => `${context.packageFolder}/domain/${context.tenantNameUpperFirst}Parameter.java`
                    },
                    {
                        file: 'package/aop/_tenant/_TenantAspect.java',
                        renameTo: context =>
                            `${context.packageFolder}/aop/${context.tenantNameLowerFirst}/${context.tenantNameUpperFirst}Aspect.java`
                    }
                ]
            }
        ],
        liquibase: [
            // User database changes
            {
                condition: context => context.isTenant,
                path: jhipsterConstants.SERVER_MAIN_RES_DIR,
                templates: [
                    {
                        file: 'config/liquibase/changelog/_user_tenant_constraints.xml',
                        renameTo: context =>
                            `config/liquibase/changelog/${context.changelogDate}-1__user_${context.tenantNameUpperFirst}_constraints.xml`
                    }
                ]
            },
            {
                condition: context => context.isTenant,
                path: jhipsterConstants.SERVER_MAIN_RES_DIR,
                templates: [
                    {
                        file: 'config/liquibase/changelog/_tenant_user_data.xml',
                        renameTo: context =>
                            `config/liquibase/changelog/${context.changelogDate}-2__${context.tenantNameLowerCase}_user_data.xml`
                    }
                ]
            },
            {
                condition: context => context.isTenant,
                path: jhipsterConstants.SERVER_MAIN_RES_DIR,
                templates: [
                    {
                        file: 'config/liquibase/data/_tenant.csv',
                        renameTo: context => `config/liquibase/data/${context.tenantNameLowerCase}.csv`
                    }
                ]
            },
            {
                condition: context => context.isTenant,
                path: jhipsterConstants.SERVER_MAIN_RES_DIR,
                templates: [
                    {
                        file: 'config/liquibase/data/_tenant_user.csv',
                        renameTo: context => `config/liquibase/data/${context.tenantNameLowerCase}_user.csv`
                    }
                ]
            },
            {
                condition: context => context.isTenant,
                path: jhipsterConstants.SERVER_MAIN_RES_DIR,
                templates: [
                    {
                        file: 'config/liquibase/data/_tenant_authority.csv',
                        renameTo: context => `config/liquibase/data/${context.tenantNameLowerCase}_authority.csv`
                    }
                ]
            },
            {
                condition: context => context.isTenant,
                path: jhipsterConstants.SERVER_MAIN_RES_DIR,
                templates: [
                    {
                        file: 'config/liquibase/data/_tenant_user_authority.csv',
                        renameTo: context => `config/liquibase/data/${context.tenantNameLowerCase}_user_authority.csv`
                    }
                ]
            }
        ]
    };

    this.writeFilesToDisk(tenantFiles, this, false);
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
