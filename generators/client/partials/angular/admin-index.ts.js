const file = context => `${context.CLIENT_MAIN_SRC_DIR}app/admin/index.ts`;

const tmpls = [
    {
        // Export tenant on admin module
        type: 'rewriteFile',
        target: context => "export * from './admin.route';",
        tmpl: context => `export * from './${context.tenantFolderName}/${context.tenantFileName}.component';
export * from './${context.tenantFolderName}/${context.tenantFileName}-detail.component';
export * from './${context.tenantFolderName}/${context.tenantFileName}-update.component';
export * from './${context.tenantFolderName}/${context.tenantFileName}-delete-dialog.component';
export * from './${context.tenantFolderName}/${context.tenantFileName}.route';
export * from '../${context.tenantModelPath}/${context.tenantNameLowerFirst}.model';`
    }
];

module.exports = {
    file,
    tmpls
};
