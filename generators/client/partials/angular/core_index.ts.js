const file = context => `${context.CLIENT_MAIN_SRC_DIR}app/core/index.ts`;

const tmpls = [
    {
        // Add tenant route access to secure the tenant management
        type: 'rewriteFile',
        target: context => "export * from './auth/user-route-access-service';",
        tmpl: context => `export * from './auth/${context.tenantNameLowerFirst}-route-access-service';`
    }
];

module.exports = {
    file,
    tmpls
};
