const file = (context) => {
    return `${context.webappDir}app/shared/index.ts`;
};

const tmpls = [
    {
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