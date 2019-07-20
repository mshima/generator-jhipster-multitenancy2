const jhipsterConstants = require('generator-jhipster/generators/generator-constants');
const mtUtils = require('../multitenancy-utils');

module.exports = {
    writeFiles
};

function writeFiles() {
    // function to use directly template
    this.template = function (source, destination) {
        this.fs.copyTpl(
                this.templatePath(source),
                this.destinationPath(destination),
                this
        );
    };

    this.packageFolder = this.config.get('packageFolder');
    // references to the various directories we'll be copying files to
    this.javaDir = `${jhipsterConstants.SERVER_MAIN_SRC_DIR + this.packageFolder}/`;

    // TODO Add entities:
    // ` || execution(* ${this.packageName}.service.${_.upperFirst(entity)}Service.*(..))`
    this.tenantisedEntityServices = `@Before("execution(* ${this.packageName}.service.UserService.*(..))")`;
    
    // template variables
    mtUtils.tenantVariables(this.config.get('tenantName'), this);
    this.changelogDate = this.config.get("tenantChangelogDate");

    // update user object
    this.template('src/main/java/package/domain/_User.java', `${this.javaDir}domain/User.java`);
    this.template('src/main/java/package/service/dto/_UserDTO.java', `${this.javaDir}service/dto/UserDTO.java`);

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

}
