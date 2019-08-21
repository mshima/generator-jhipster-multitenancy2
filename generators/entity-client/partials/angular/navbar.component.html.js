const file = context => `${context.CLIENT_MAIN_SRC_DIR}app/layouts/navbar/navbar.component.html`;

const tmpls = [
    {
        // Remove tenant from entities menu
        type: 'replaceContent',
        versions: ['6.1.2', '6.2.0'],
        regex: true,
        target: context => `\n(.*)<li>\n(.*)routerLink="${context.tenantNameLowerFirst}-management"((.*)\n){4}(.*)</li>`,
        tmpl: context => ''
    }
];

module.exports = {
    file,
    tmpls
};
