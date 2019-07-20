const file = (context) => {
    return `${context.CLIENT_TEST_SRC_DIR}e2e/entities/${context.entityNameLowerFirst}/${context.entityNameLowerFirst}.spec.ts`;
};

/*
                    this.rewriteFile(
                        `${context.CLIENT_TEST_SRC_DIR}e2e/entities/${entityName}/${entityName}.spec.ts`,
                        `describe('${entityNameUpperFirst} e2e test', () => {`,
                        `import { ${tenantNameUpperFirst}MgmtComponentsPage } from '../../admin/${tenantNameLowerFirst}-management.spec';
`
                    );

                    this.rewriteFile(
                        `${context.CLIENT_TEST_SRC_DIR}e2e/entities/${entityName}/${entityName}.spec.ts`,
                        `let ${entityName}ComponentsPage: ${entityNameUpperFirst}ComponentsPage;`,
                        `let ${tenantNameLowerFirst}MgmtComponentsPage: ${tenantNameUpperFirst}MgmtComponentsPage;`
                    );

                    this.replaceContent(
                        `${context.CLIENT_TEST_SRC_DIR}e2e/entities/${entityName}/${entityName}.spec.ts`,
                        `it('should create and save ${entityNamePluralUpperFirst}', () => {`,
                        partialFiles.angular.entitySpecTs1(this)
                    );

                    this.rewriteFile(
                        `${context.CLIENT_TEST_SRC_DIR}e2e/entities/${entityName}/${entityName}.spec.ts`,
                        `${entityName}UpdatePage.save();`,
                        `${entityName}UpdatePage.set${tenantNameUpperFirst}();`
                    );
 */
const tmpls = [
    {
        type: 'rewriteFile',
        target: (context) => {
            return `describe('${context.entityNameUpperFirst} e2e test', () => {`;
        },
        tmpl: (context) => {
            return `import { ${context.tenantNameUpperFirst}MgmtComponentsPage } from '../../admin/${context.tenantNameLowerFirst}-management.spec';
`;
        }
    },
    {
        type: 'rewriteFile',
        target: (context) => {
            return `let ${context.entityName}ComponentsPage: ${context.entityNameUpperFirst}ComponentsPage;`;
        },
        tmpl: (context) => {
            return `let ${context.tenantNameLowerFirst}MgmtComponentsPage: ${context.tenantNameUpperFirst}MgmtComponentsPage;`;
        }
    },
    {
        type: 'rewriteFile',
        target: (context) => {
            return `it('should create and save ${context.entityNamePluralUpperFirst}', () => {`;
        },
        tmpl: (context) => {
            let template = `it('should create and save ${context.name}', () => {
        ${context.tenantNameLowerFirst}MgmtComponentsPage = new ${context.tenantNameUpperFirst}MgmtComponentsPage();
        ${context.tenantNameLowerFirst}MgmtComponentsPage.create${context.tenantNameUpperFirst}();

        navBarPage.goToEntity('${context.entityNameLowerFirst}');`;
            return template;
        }
    },
    {
        type: 'rewriteFile',
        target: (context) => {
            return `${context.entityName}UpdatePage.save();`;
        },
        tmpl: (context) => {
            return `${context.entityName}UpdatePage.set${context.tenantNameUpperFirst}();`;
        }
    },
]

module.exports = {
    file,
    tmpls
};
