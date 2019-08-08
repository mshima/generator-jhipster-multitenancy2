const file = context => `${context.CLIENT_MAIN_SRC_DIR}app/shared/index.ts`;

const tmpls = [
    {
        type: 'rewriteFile',
        target: context => "export * from './util/datepicker-adapter';",
        tmpl: context =>
            `export * from '../admin/${context.tenantNameLowerFirst}-management/${context.tenantNameLowerFirst}-management.service';`
    }
];

module.exports = {
    file,
    tmpls
};
