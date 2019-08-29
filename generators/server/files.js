const jhipsterConstants = require('generator-jhipster/generators/generator-constants');
const mtUtils = require('../multitenancy-utils');

const serverTemplates = [
    // Tenant relationship
    'User.java',
    'UserDTO.java',
    // ROLE
    'AuthoritiesConstants.java',
    'UserResource.java'
];

module.exports = {
    writeFiles,
    server: {
        templates(context) {
            return mtUtils.requireTemplates('./server/partials/server/', serverTemplates, context);
        }
    }
};

function writeFiles() {
    this.packageFolder = this.config.get('packageFolder');
    // references to the various directories we'll be copying files to

    this.tenantisedEntityServices = `@Before("execution(* ${this.packageName}.service.UserService.*(..))`;
    if (this.configOptions.tenantAwareEntities) {
        this.configOptions.tenantAwareEntities.forEach(tenantAwareEntity => {
            this.tenantisedEntityServices = `${this.tenantisedEntityServices} || execution(* ${
                this.packageName
            }.service.${tenantAwareEntity}Service.*(..))`;
        });
    }
    this.tenantisedEntityServices = `${this.tenantisedEntityServices}")`;

    // template variables
    mtUtils.tenantVariables.call(this, this.options.tenantName || this.config.get('tenantName'), this);
    this.changelogDate = this.config.get('tenantChangelogDate');

    // configs for the template files
    const files = {
        liquibase: [
            // User database changes
            {
                path: jhipsterConstants.SERVER_MAIN_RES_DIR,
                templates: [
                    {
                        file: 'config/liquibase/changelog/_user_tenant_constraints.xml',
                        renameTo: generator =>
                            `config/liquibase/changelog/${this.changelogDate}__user_${this.tenantNameUpperFirst}_constraints.xml`
                    }
                ]
            },
            {
                path: jhipsterConstants.SERVER_MAIN_RES_DIR,
                templates: [
                    {
                        file: 'config/liquibase/changelog/_tenant_user_data.xml',
                        renameTo: generator => `config/liquibase/changelog/${this.changelogDate}__${this.tenantNameLowerCase}_user_data.xml`
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
        ],
        aop: [
            // copy over aspect
            {
                path: jhipsterConstants.SERVER_MAIN_SRC_DIR,
                templates: [
                    {
                        file: 'package/domain/_TenantParameter.java',
                        renameTo: generator => `${this.packageFolder}/domain/${this.tenantNameUpperFirst}Parameter.java`
                    },
                    {
                        file: 'package/aop/_tenant/_TenantAspect.java',
                        renameTo: generator =>
                            `${this.packageFolder}/aop/${this.tenantNameLowerFirst}/${this.tenantNameUpperFirst}Aspect.java`
                    },
                    {
                        file: 'package/aop/_tenant/_UserAspect.java',
                        renameTo: generator => `${this.packageFolder}/aop/${this.tenantNameLowerFirst}/UserAspect.java`
                    }
                ]
            }
        ]
    };

    // parse the templates and write files to the appropriate locations
    this.writeFilesToDisk(files, this, false);

    this.addChangelogToLiquibase(`${this.changelogDate}__user_${this.tenantNameUpperFirst}_constraints`);
    this.addChangelogToLiquibase(`${this.changelogDate}__${this.tenantNameLowerCase}_user_data`);
}
