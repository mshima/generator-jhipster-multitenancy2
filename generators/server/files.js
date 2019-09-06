const jhipsterConstants = require('generator-jhipster/generators/generator-constants');

const Patcher = require('../patcher');

const serverTemplates = [
    // Tenant relationship
    'user_add_tenant/User.java',
    'user_add_tenant/UserDTO.java',
    'user_add_tenant/UserMapper.java',
    // ROLE
    'change_tenant_management_role/AuthoritiesConstants.java',
    'change_tenant_management_role/UserResource.java'
];

function writeFiles() {
    // configs for the template files
    const files = {
        aop: [
            // copy over aspect
            {
                path: jhipsterConstants.SERVER_MAIN_SRC_DIR,
                templates: [
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
}

module.exports = class ServerPatcher extends Patcher {
    constructor() {
        super('server', serverTemplates, writeFiles);
    }
};
