const file = context => `${context.CLIENT_MAIN_SRC_DIR}i18n/${context.language}/global.json`;

const tmpls = [
    //    {
    //        // Remove tenant from entities menu
    //        type: 'replaceContent',
    //        regexp: true,
    //        target: context => `admin`,
    //        tmpl: context => ''
    //    },
    {
        // Remove tenant from entities menu
        type: 'replaceContent',
        versions: ['6.1.2', '6.2.0'],
        regex: true,
        target: context => `\n(.*)"admin${context.tenantNameUpperFirst}": "${context.tenantNameUpperFirst}",`,
        tmpl: context => ''
    }
];

module.exports = {
    file,
    tmpls
};
