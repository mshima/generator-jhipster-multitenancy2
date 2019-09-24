const jhipsterConstants = require('generator-jhipster/generators/generator-constants');

module.exports = {
    files: {
        tenant_admin_menu: [
            {
                path: jhipsterConstants.ANGULAR_DIR,
                templates: [
                    {
                        file: 'tenant-admin/_tenant-admin-routing.module.ts',
                        renameTo: generator =>
                            `${generator.tenantNameLowerFirst}-admin/${generator.tenantNameLowerFirst}-admin-routing.module.ts`
                    },
                    {
                        file: 'layouts/navbar/navbar.component.html',
                        renameTo: () => 'layouts/navbar/navbar.component.html'
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
