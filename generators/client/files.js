const jhipsterConstants = require('generator-jhipster/generators/generator-constants');

const Patcher = require('../patcher');

function writeFiles() {
    // configs for the template files
    const files = {
        userManagement: [
            {
                path: jhipsterConstants.ANGULAR_DIR,
                templates: ['admin/user-management/user-management-update.component.ts', 'admin/user-management/user-management.module.ts']
            }
        ],
        tenantAdmin: [
            {
                path: jhipsterConstants.ANGULAR_DIR,
                templates: [
                    {
                        file: 'tenant-admin/_tenant-admin.route.ts',
                        renameTo: generator => `${this.tenantNameLowerFirst}-admin/${this.tenantNameLowerFirst}-admin.route.ts`
                    },
                    {
                        file: 'tenant-admin/_tenant-admin.module.ts',
                        renameTo: generator => `${this.tenantNameLowerFirst}-admin/${this.tenantNameLowerFirst}-admin.module.ts`
                    }
                ]
            }
        ],
        shared: [
            {
                path: jhipsterConstants.ANGULAR_DIR,
                templates: [
                    {
                        file: 'core/auth/_tenant-route-access-service.ts',
                        renameTo: generator => `core/auth/${this.tenantNameLowerFirst}-route-access-service.ts`
                    }
                ]
            }
        ]
    };

    // parse the templates and write files to the appropriate locations
    this.writeFilesToDisk(files, this, false);
}

module.exports = class ClientPatcher extends Patcher {
    constructor(generator) {
        super(generator, 'client', undefined, writeFiles);
    }
};
