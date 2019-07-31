const file = (context) => {
    return `${context.CLIENT_MAIN_SRC_DIR}app/admin/index.ts`;
};

const tmpls = [
    { // Export tenant on admin module
        type: 'rewriteFile',
        target: (context) => {
            return `export * from './admin.route';`;
        },
        tmpl: (context) => {
            return `export * from './${context.tenantNameLowerFirst}-management/${context.tenantNameLowerFirst}-management.component';
export * from './${context.tenantNameLowerFirst}-management/${context.tenantNameLowerFirst}-management-detail.component';
export * from './${context.tenantNameLowerFirst}-management/${context.tenantNameLowerFirst}-management-update.component';
export * from './${context.tenantNameLowerFirst}-management/${context.tenantNameLowerFirst}-management-delete-dialog.component';
export * from './${context.tenantNameLowerFirst}-management/${context.tenantNameLowerFirst}-management.route';
export * from '../${context.tenantModelPath}/${context.tenantNameLowerFirst}.model';`;
        }
    },
]

module.exports = {
    file,
    tmpls
};
