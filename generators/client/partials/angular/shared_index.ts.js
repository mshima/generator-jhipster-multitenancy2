const file = (context) => {
    return `${context.webappDir}app/shared/index.ts`;
};

const tmpls = [
    {
        condition: generator => !generator.configOptions.experimentalTenantManagement,
        type: 'rewriteFile',
        target: (context) => {
            return `export * from './util/datepicker-adapter';`;
        },
        tmpl: (context) => {
            return `export * from './${context.tenantNameLowerFirst}/${context.tenantNameLowerFirst}.service';`;
        }
    },
    {
        condition: generator => generator.configOptions.experimentalTenantManagement,
        type: 'rewriteFile',
        target: (context) => {
            return `export * from './util/datepicker-adapter';`;
        },
        tmpl: (context) => {
            return `export * from '../admin/${context.tenantNameLowerFirst}-management/${context.tenantNameLowerFirst}-management.service';`;
        }
    },
]

module.exports = {
    file,
    tmpls
};