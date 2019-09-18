const jhipsterConstants = require('generator-jhipster/generators/generator-constants');

module.exports = {
    files: {
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
        ],
        tenant_admin_menu: [
            {
                path: jhipsterConstants.ANGULAR_DIR,
                templates: [
                    {
                        file: 'layouts/navbar/navbar.component.html.v6.3.0',
                        renameTo: () => 'layouts/navbar/navbar.component.html'
                    }
                ]
            }
        ]
    }
};
