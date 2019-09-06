const file = context => `${context.CLIENT_MAIN_SRC_DIR}app/admin/user-management/user-management.route.ts`;

const tmpls = [
    {
        type: 'replaceContent',
        target: context => "['ROLE_ADMIN']",
        tmpl: context => `['ROLE_ADMIN', 'ROLE_${context.tenantNameUpperCase}_ADMIN']`
    }
];

module.exports = {
    file,
    tmpls
};
