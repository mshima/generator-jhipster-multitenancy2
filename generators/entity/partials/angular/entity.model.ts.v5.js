const file = (context) => {
    return `${context.webappDir}app/shared/model/${context.options.entityNameLowerFirst}.model.ts`;
};

/*
                this.rewriteFile(
                    `${webappDir}app/shared/model/${entityName}.model.ts`,
                    `export interface I${entityNameUpperFirst} {`,
                    `import { ${tenantNameUpperFirst} } from '../../admin/${tenantNameLowerFirst}-management/${tenantNameLowerFirst}.model';`
                );

                this.rewriteFile(
                    `${webappDir}app/shared/model/${entityName}.model.ts`,
                    'id?: number;',
                    `${tenantNameLowerFirst}?: ${tenantNameUpperFirst};`
                );

 */
const tmpls = [
    {
        type: 'rewriteFile',
        target: (context) => {
            return `export interface I${context.options.entityNameUpperFirst} {`;
        },
        tmpl: (context) => {
            return `import { ${context.tenantNameUpperFirst} } from '../../admin/${context.tenantNameLowerFirst}-management/${context.tenantNameLowerFirst}.model';`;
        }
    },
    {
        type: 'rewriteFile',
        target: 'id?: number;',
        tmpl: (context) => {
            return `${context.tenantNameLowerFirst}?: ${context.tenantNameUpperFirst};`;
        }
    },
]

module.exports = {
    file,
    tmpls
};
