const jhipsterConstants = require('generator-jhipster/generators/generator-constants');

module.exports = {
    files: {
        user_add_tenant: [
            {
                path: jhipsterConstants.ANGULAR_DIR,
                templates: [
                    {
                        file: 'admin/user-management/user-management-update.component.ts.v6.3',
                        renameTo: () => 'admin/user-management/user-management-update.component.ts'
                    }
                ]
            }
        ],
        user_management_module: [
            {
                path: jhipsterConstants.ANGULAR_DIR,
                templates: ['admin/admin.module.ts']
            },
            {
                path: jhipsterConstants.ANGULAR_DIR,
                templates: ['admin/admin.route.ts']
            },
            {
                path: jhipsterConstants.ANGULAR_DIR,
                templates: ['admin/user-management/user-management.module.ts']
            },
            {
                path: jhipsterConstants.ANGULAR_DIR,
                templates: ['admin/user-management/user-management.route.ts']
            }
        ]
    }
};
