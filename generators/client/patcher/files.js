const jhipsterConstants = require('generator-jhipster/generators/generator-constants');

module.exports = {
    files: {
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
                        renameTo: generator => `${generator.tenantNameLowerFirst}-admin/${generator.tenantNameLowerFirst}-admin.route.ts`
                    },
                    {
                        file: 'tenant-admin/_tenant-admin.module.ts',
                        renameTo: generator => `${generator.tenantNameLowerFirst}-admin/${generator.tenantNameLowerFirst}-admin.module.ts`
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
                        renameTo: generator => `core/auth/${generator.tenantNameLowerFirst}-route-access-service.ts`
                    }
                ]
            }
        ]
    }
};
