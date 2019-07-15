const file = (context) => {
    return `${context.webappDir}app/shared/model/${context.options.entityNameLowerFirst}.model.ts`;
};

const tmpls = [
    {
        type: 'replaceContent',
        target: (context) => {
            return `'app/shared/model/${context.tenantNameLowerFirst}.model'`;
        },
        tmpl: (context) => {
            return `'../../admin/${context.tenantNameLowerFirst}-management/${context.tenantNameLowerFirst}.model'`;
        }
    },
]

module.exports = {
    file,
    tmpls
};
