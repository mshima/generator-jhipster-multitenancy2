const jhipsterConstants = require('generator-jhipster/generators/generator-constants');
const mtUtils = require('../multitenancy-utils');

const angularTemplates = [
    'tenant_add_to_account/account.model.ts',
    'tenant_add_to_account/account.service.ts',
    'tenant_add_to_account/navbar.component.ts',
    'tenant_move_to_admin_folder/admin-index.ts',
    'tenant_move_to_admin_folder/shared_index.ts',
    'tenant_add_test/administration.spec.ts',
    'user_add_tenant/user-management.component.html',
    'user_add_tenant/user-management-detail.component.html',
    'user_add_tenant/user-management-update.component.html',
    // 'user_add_tenant/user-management-update.component.ts',
    'user_add_tenant/user.model.ts',
    'tenant_load_route_access/core_index.ts',
    // Migrate user management to it's on module
    'user_management_module/admin-index.ts',
    'user_management_module/admin.module.ts',
    // Tenant admin menu
    'tenant_admin_menu/app-routing.module.ts',
    'tenant_admin_menu/navbar.component.html',
    'tenant_admin_menu/user-management.component.ts',
    'tenant_admin_menu/user-management.route.ts'
];

module.exports = {
    writeFiles,
    angular: {
        templates(context) {
            return mtUtils.requireTemplates('./client/partials/', angularTemplates, context);
        }
    }
};

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
