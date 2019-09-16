const jhipsterConstants = require('generator-jhipster/generators/generator-constants');

module.exports = {
    files: {
        user_management_module: [
            {
                path: jhipsterConstants.ANGULAR_DIR,
                templates: ['admin/user-management/user-management.module.ts']
            },
            {
                path: jhipsterConstants.ANGULAR_DIR,
                templates: ['admin/user-management/user-management.route.ts']
            },
            {
                path: jhipsterConstants.ANGULAR_DIR,
                templates: ['admin/admin.module.ts']
            },
            {
                path: jhipsterConstants.ANGULAR_DIR,
                templates: ['admin/admin.route.ts']
            }
        ],
        user_add_tenant: [
            {
                path: jhipsterConstants.ANGULAR_DIR,
                templates: ['admin/user-management/user-management-update.component.ts']
            }
        ],
        tenant_admin_menu: [
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
        tenant_base: [
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
