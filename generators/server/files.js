const jhipsterConstants = require('generator-jhipster/generators/generator-constants');
const mtUtils = require('../multitenancy-utils');

const partialFiles = require('./partials/index');

module.exports = {
    writeFiles
};

function writeFiles() {
    this.packageFolder = this.config.get('packageFolder');
    // references to the various directories we'll be copying files to
    this.javaDir = `${jhipsterConstants.SERVER_MAIN_SRC_DIR + this.packageFolder}/`;

    this.tenantisedEntityServices = `@Before("execution(* ${this.packageName}.service.UserService.*(..))`;
    this.getExistingEntities().forEach(entity => {
        if(entity.definition.tenantAware){
            this.tenantisedEntityServices = this.tenantisedEntityServices + ` || execution(* ${this.packageName}.service.${this._.upperFirst(entity.name)}Service.*(..))`
        }
    });
    this.tenantisedEntityServices = this.tenantisedEntityServices + '")';

    // template variables
    mtUtils.tenantVariables(this.config.get('tenantName'), this);
    this.changelogDate = this.config.get("tenantChangelogDate");

    // configs for the template files
    const files = {
        liquibase: [ // User database changes
            {
                path: jhipsterConstants.SERVER_MAIN_RES_DIR,
                templates: [
                    {
                        file: 'config/liquibase/changelog/_user_tenant_constraints.xml',
                        renameTo: generator => `config/liquibase/changelog/${this.changelogDate}__user_${this.tenantNameUpperFirst}_constraints.xml`
                    }
                ]
            }
        ],
        aop: [ // copy over aspect
            {
                path: jhipsterConstants.SERVER_MAIN_SRC_DIR,
                templates: [
                    {
                        file: 'package/domain/_EntityParameter.java',
                        renameTo: generator => `${this.packageFolder}/domain/${this.tenantNameUpperFirst}Parameter.java`
                    },
                    {
                        file: 'package/aop/_tenant/_TenantAspect.java',
                        renameTo: generator => `${this.packageFolder}/aop/${this.tenantNameLowerFirst}/${this.tenantNameUpperFirst}Aspect.java`
                    },
                    {
                        file: 'package/aop/_tenant/_UserAspect.java',
                        renameTo: generator => `${this.packageFolder}/aop/${this.tenantNameLowerFirst}/UserAspect.java`
                    }
                ]
            },
        ]
    };

    // parse the templates and write files to the appropriate locations
    this.writeFilesToDisk(files, this, false);

    this.addChangelogToLiquibase(`${this.changelogDate}__user_${this.tenantNameUpperFirst}_constraints`);

    mtUtils.processPartialTemplates(partialFiles.server.templates(this), this);
}
