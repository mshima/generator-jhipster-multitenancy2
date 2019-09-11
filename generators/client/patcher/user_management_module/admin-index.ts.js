const file = context => `${context.CLIENT_MAIN_SRC_DIR}app/admin/index.ts`;

const tmpls = [
    {
        // Export tenant on admin module
        type: 'rewriteFile',
        target: context => "export * from './user-management/user-management.route';",
        tmpl: context => "export * from './user-management/user-management.module';"
    }
];

module.exports = {
    file,
    tmpls
};
