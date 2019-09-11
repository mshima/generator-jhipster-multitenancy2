const file = context => `${context.CLIENT_MAIN_SRC_DIR}app/app-routing.module.ts`;

const tmpls = [
    {
        type: 'rewriteFile',
        target: context => '...LAYOUT_ROUTES',
        tmpl: context => `        {
          path: '${context.tenantNameLowerFirst}-admin',
          loadChildren: () => import('./${context.tenantNameLowerFirst}-admin/${context.tenantNameLowerFirst}-admin.module').then(m => m.${
            context.angularXAppName
        }${context.tenantNameUpperFirst}AdminModule)
        },`
    }
];

module.exports = {
    file,
    tmpls
};
