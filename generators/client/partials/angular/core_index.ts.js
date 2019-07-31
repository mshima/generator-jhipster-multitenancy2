const file = (context) => {
    return `${context.CLIENT_MAIN_SRC_DIR}app/core/index.ts`;
};

const tmpls = [
    {
        type: 'rewriteFile',
        target: (context) => {
            return `export * from './auth/user-route-access-service';`;
        },
        tmpl: (context) => {
            return `export * from './auth/${context.tenantNameLowerFirst}-route-access-service';`;
        }
    },
]

module.exports = {
    file,
    tmpls
};