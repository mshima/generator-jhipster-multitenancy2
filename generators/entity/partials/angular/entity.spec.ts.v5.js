const file = (context) => {
    return `${context.CLIENT_TEST_SRC_DIR}e2e/entities/${context.entityInstance}/${context.entityInstance}.spec.ts`;
};

/*
                    this.rewriteFile(
                        `${context.CLIENT_TEST_SRC_DIR}e2e/entities/${context.entityFolderName}/${context.entityFileName}.spec.ts`,
                        `describe('${context.entityClass} e2e test', () => {`,
                        `import { ${tenantNameUpperFirst}MgmtComponentsPage } from '../../admin/${tenantNameLowerFirst}-management.spec';
`
                    );

                    this.rewriteFile(
                        `${context.CLIENT_TEST_SRC_DIR}e2e/entities/${context.entityFolderName}/${context.entityFileName}.spec.ts`,
                        `let ${entityInstance}ComponentsPage: ${context.entityClass}ComponentsPage;`,
                        `let ${tenantNameLowerFirst}MgmtComponentsPage: ${tenantNameUpperFirst}MgmtComponentsPage;`
                    );

                    this.replaceContent(
                        `${context.CLIENT_TEST_SRC_DIR}e2e/entities/${context.entityFolderName}/${context.entityFileName}.spec.ts`,
                        `it('should create and save ${entityClassPlural}', () => {`,
                        partialFiles.angular.entitySpecTs1(this)
                    );

                    this.rewriteFile(
                        `${context.CLIENT_TEST_SRC_DIR}e2e/entities/${context.entityFolderName}/${context.entityFileName}.spec.ts`,
                        `${entityInstance}UpdatePage.save();`,
                        `${entityInstance}UpdatePage.set${tenantNameUpperFirst}();`
                    );
 */
const tmpls = [
    {
        type: 'rewriteFile',
        target: (context) => {
            return `describe('${context.entityClass} e2e test', () => {`;
        },
        tmpl: (context) => {
            return `import { ${context.tenantNameUpperFirst}MgmtComponentsPage } from '../../admin/${context.tenantNameLowerFirst}-management.spec';
`;
        }
    },
    {
        type: 'rewriteFile',
        target: (context) => {
            return `let ${context.entityInstance}ComponentsPage: ${context.entityClass}ComponentsPage;`;
        },
        tmpl: (context) => {
            return `let ${context.tenantNameLowerFirst}MgmtComponentsPage: ${context.tenantNameUpperFirst}MgmtComponentsPage;`;
        }
    },
    {
        type: 'rewriteFile',
        target: (context) => {
            return `it('should create and save ${context.entityClassPlural}', () => {`;
        },
        tmpl: (context) => {
            let template = `it('should create and save ${context.name}', () => {
        ${context.tenantNameLowerFirst}MgmtComponentsPage = new ${context.tenantNameUpperFirst}MgmtComponentsPage();
        ${context.tenantNameLowerFirst}MgmtComponentsPage.create${context.tenantNameUpperFirst}();

        navBarPage.goToEntity('${context.entityInstance}');`;
            return template;
        }
    },
    {
        type: 'rewriteFile',
        target: (context) => {
            return `${context.entityInstance}UpdatePage.save();`;
        },
        tmpl: (context) => {
            return `${context.entityInstance}UpdatePage.set${context.tenantNameUpperFirst}();`;
        }
    },
]

module.exports = {
    file,
    tmpls
};
