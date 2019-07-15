const file = (context) => {
    return `${context.clientTestDir}e2e/entities/${context.options.entityNameLowerFirst}/${context.options.entityNameLowerFirst}.spec.ts`;
};

/*
                    this.rewriteFile(
                        `${clientTestDir}e2e/entities/${entityName}/${entityName}.spec.ts`,
                        `describe('${entityNameUpperFirst} e2e test', () => {`,
                        `import { ${tenantNameUpperFirst}MgmtComponentsPage } from '../../admin/${tenantNameLowerFirst}-management.spec';
`
                    );

                    this.rewriteFile(
                        `${clientTestDir}e2e/entities/${entityName}/${entityName}.spec.ts`,
                        `let ${entityName}ComponentsPage: ${entityNameUpperFirst}ComponentsPage;`,
                        `let ${tenantNameLowerFirst}MgmtComponentsPage: ${tenantNameUpperFirst}MgmtComponentsPage;`
                    );

                    this.replaceContent(
                        `${clientTestDir}e2e/entities/${entityName}/${entityName}.spec.ts`,
                        `it('should create and save ${entityNamePluralUpperFirst}', () => {`,
                        partialFiles.angular.entitySpecTs1(this)
                    );

                    this.rewriteFile(
                        `${clientTestDir}e2e/entities/${entityName}/${entityName}.spec.ts`,
                        `${entityName}UpdatePage.save();`,
                        `${entityName}UpdatePage.set${tenantNameUpperFirst}();`
                    );
 */
const tmpls = [
    {
        type: 'rewriteFile',
        target: (context) => {
            return `describe('${context.options.entityNameUpperFirst} e2e test', () => {`;
        },
        tmpl: (context) => {
            return `import { ${context.tenantNameUpperFirst}MgmtComponentsPage } from '../../admin/${context.tenantNameLowerFirst}-management.spec';
`;
        }
    },
    {
        type: 'rewriteFile',
        target: (context) => {
            return `let ${context.options.entityName}ComponentsPage: ${context.options.entityNameUpperFirst}ComponentsPage;`;
        },
        tmpl: (context) => {
            return `let ${context.tenantNameLowerFirst}MgmtComponentsPage: ${context.tenantNameUpperFirst}MgmtComponentsPage;`;
        }
    },
    {
        type: 'rewriteFile',
        target: (context) => {
            return `it('should create and save ${context.options.entityNamePluralUpperFirst}', () => {`;
        },
        tmpl: (context) => {
            let template = `it('should create and save ${context.options.name}', () => {
        ${context.tenantNameLowerFirst}MgmtComponentsPage = new ${context.tenantNameUpperFirst}MgmtComponentsPage();
        ${context.tenantNameLowerFirst}MgmtComponentsPage.create${context.tenantNameUpperFirst}();

        navBarPage.goToEntity('${context.options.entityNameLowerFirst}');`;
            return template;
        }
    },
    {
        type: 'rewriteFile',
        target: (context) => {
            return `${context.options.entityName}UpdatePage.save();`;
        },
        tmpl: (context) => {
            return `${context.options.entityName}UpdatePage.set${context.tenantNameUpperFirst}();`;
        }
    },
]

module.exports = {
    file,
    tmpls
};
