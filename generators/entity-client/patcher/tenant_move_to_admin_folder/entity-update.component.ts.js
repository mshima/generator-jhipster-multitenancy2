const file = context =>
    `${context.CLIENT_MAIN_SRC_DIR}app/entities/${context.entityFolderName}/${context.entityFileName}-update.component.ts`;

const condition = context => context.tenantAware;

const tmpls = [
    {
        type: 'replaceContent',
        regex: true,
        target: context => `app/shared/model/${context.tenantNameLowerFirst}.model`,
        tmpl: context => `app/shared/model/${context.tenantClientRootFolder}/${context.tenantNameLowerFirst}.model`
    }
];

module.exports = {
    file,
    condition,
    tmpls
};
