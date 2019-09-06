const file = context => `${context.CLIENT_MAIN_SRC_DIR}app/admin/user-management/user-management.component.ts`;

const tmpls = [
    {
        type: 'replaceContent',
        target: context => "['/admin/user-management']",
        tmpl: context => "['user-management']"
    }
];

module.exports = {
    file,
    tmpls
};
