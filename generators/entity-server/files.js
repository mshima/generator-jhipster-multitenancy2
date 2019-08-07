const mtUtils = require('../multitenancy-utils');

const entityTenantAwareTemplates = ['Entity.java'];

const tenantTemplates = ['_TenantResource', '_TenantService', '_Tenant.java'];

module.exports = {
    writeTenantFiles,
    writeTenantAwareFiles,
    partials: {
        entityTenantAwareTemplates(context) {
            return mtUtils.requireTemplates('./entity-server/partials/server/', entityTenantAwareTemplates, context);
        },
        tenantTemplates(context) {
            return mtUtils.requireTemplates('./entity-server/partials/server/', tenantTemplates, context);
        }
    }
};

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
        templates: [
            {
                condition: generator => generator.isTenant,
                path: this.SERVER_MAIN_SRC_DIR,
                templates: [
                    {
                        file: 'package/repository/_TenantRepository.java',
                        renameTo: generator => `${this.packageFolder}/repository/${this.tenantNameUpperFirst}Repository.java`
                    }
                ]
            }
        ]
    };

    this.writeFilesToDisk(tenantFiles, this, false);
}
