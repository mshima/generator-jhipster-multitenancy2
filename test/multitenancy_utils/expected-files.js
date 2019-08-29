const constants = require('generator-jhipster/generators/generator-constants');

// const TEST_DIR = constants.TEST_DIR;
const CLIENT_MAIN_SRC_DIR = constants.CLIENT_MAIN_SRC_DIR;
const CLIENT_TEST_SRC_DIR = constants.CLIENT_TEST_SRC_DIR;
const SERVER_MAIN_SRC_DIR = constants.SERVER_MAIN_SRC_DIR;
const SERVER_MAIN_RES_DIR = constants.SERVER_MAIN_RES_DIR;
const SERVER_TEST_SRC_DIR = constants.SERVER_TEST_SRC_DIR;
// const SERVER_TEST_RES_DIR = constants.SERVER_TEST_RES_DIR;
// const DOCKER_DIR = constants.DOCKER_DIR;

const expectedFiles = {
    entity: {
        clientNg2: [
            `${CLIENT_MAIN_SRC_DIR}app/admin/company-management/company-management.component.html`,
            `${CLIENT_MAIN_SRC_DIR}app/admin/company-management/company-management-detail.component.html`,
            `${CLIENT_MAIN_SRC_DIR}app/admin/company-management/company-management-update.component.html`,
            `${CLIENT_MAIN_SRC_DIR}app/admin/company-management/company-management-delete-dialog.component.html`,
            `${CLIENT_MAIN_SRC_DIR}app/admin/company-management/company-management.route.ts`,
            `${CLIENT_MAIN_SRC_DIR}app/admin/company-management/company-management.component.ts`,
            `${CLIENT_MAIN_SRC_DIR}app/admin/company-management/company-management-update.component.ts`,
            `${CLIENT_MAIN_SRC_DIR}app/admin/company-management/company-management-delete-dialog.component.ts`,
            `${CLIENT_MAIN_SRC_DIR}app/admin/company-management/company-management-detail.component.ts`,
            `${CLIENT_MAIN_SRC_DIR}app/admin/company-management/company-management.service.ts`,
            `${CLIENT_MAIN_SRC_DIR}app/shared/admin/company.model.ts`,
            `${CLIENT_TEST_SRC_DIR}spec/app/admin/company-management/company-management-delete-dialog.component.spec.ts`,
            `${CLIENT_TEST_SRC_DIR}spec/app/admin/company-management/company-management-detail.component.spec.ts`,
            `${CLIENT_TEST_SRC_DIR}spec/app/admin/company-management/company-management-update.component.spec.ts`,
            `${CLIENT_TEST_SRC_DIR}spec/app/admin/company-management/company-management.component.spec.ts`,
            `${CLIENT_TEST_SRC_DIR}spec/app/admin/company-management/company-management.service.spec.ts`
        ],
        server: [
            '.jhipster/Company.json',
            `${SERVER_MAIN_SRC_DIR}com/mycompany/myapp/domain/Company.java`,
            `${SERVER_MAIN_SRC_DIR}com/mycompany/myapp/domain/Company.java`,
            `${SERVER_MAIN_SRC_DIR}com/mycompany/myapp/repository/CompanyRepository.java`,
            `${SERVER_MAIN_SRC_DIR}com/mycompany/myapp/web/rest/CompanyResource.java`,
            `${SERVER_MAIN_SRC_DIR}com/mycompany/myapp/aop/company/CompanyAspect.java`,
            // SERVER_MAIN_RES_DIR + 'config/liquibase/changelog/20160120213555_added_entity_Foo.xml',
            `${SERVER_TEST_SRC_DIR}com/mycompany/myapp/web/rest/CompanyResourceIT.java`
        ]
    },

    server: [`${SERVER_MAIN_SRC_DIR}com/mycompany/myapp/aop/company/UserAspect.java`],

    tenantManagementServer: [
        `${SERVER_MAIN_RES_DIR}config/liquibase/data/company_authority.csv`,
        `${SERVER_MAIN_RES_DIR}config/liquibase/data/company_authority.csv`,
        `${SERVER_MAIN_RES_DIR}config/liquibase/data/company_user_authority.csv`,
        `${SERVER_MAIN_RES_DIR}config/liquibase/data/company_user.csv`
    ],

    i18nJson: [`${CLIENT_MAIN_SRC_DIR}i18n/fr/adminCompany.json`]
};

module.exports = expectedFiles;
