const jhipsterConstants = require('generator-jhipster/generators/generator-constants');

module.exports = {
    files: {
        tests: [
            {
                condition: context => context.isTenant && context.protractorTests,
                path: jhipsterConstants.CLIENT_TEST_SRC_DIR,
                templates: [
                    {
                        file: 'e2e/admin/_tenant-management.spec.ts',
                        renameTo: context => `e2e/admin/${context.tenantFolderName}/${context.tenantFileName}-tenant.spec.ts`
                    }
                ]
            }
        ]
    }
};
