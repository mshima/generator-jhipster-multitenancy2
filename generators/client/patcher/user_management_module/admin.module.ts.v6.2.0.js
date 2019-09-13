const file = context => `${context.CLIENT_MAIN_SRC_DIR}app/admin/admin.module.ts`;

const tmpls = [
    {
        type: 'replaceContent',
        target: `UserMgmtComponent,
    UserMgmtDetailComponent,
    UserMgmtUpdateComponent,
    UserMgmtDeleteDialogComponent,`,
        tmpl: '  UserMgmtSharedModule,'
    },
    {
        type: 'replaceContent',
        target: '    imports: [',
        tmpl: `    imports: [
    UserMgmtSharedModule,`
    },
    {
        type: 'replaceContent',
        regex: true,
        target: '(declarations.*\n.*\n)(.*\n){4}',
        tmpl: '$1'
    },
    {
        type: 'replaceContent',
        regex: true,
        target: '(UserMgmtDeleteDialogComponent,)',
        tmpl: ''
    }
];

module.exports = {
    file,
    tmpls
};
