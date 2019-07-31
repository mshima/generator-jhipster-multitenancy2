const file = (context) => {
    return `${context.CLIENT_MAIN_SRC_DIR}app/core/auth/account.service.ts`;
};

const tmpls = [
    {
        type: 'rewriteFile',
        regex: true,
        target: (context) => {
            return `getImageUrl(): string {`;
        },
        tmpl: (context) => {
            return `get${context.tenantNameUpperFirst}(): String {
    return this.isIdentityResolved() ? this.userIdentity.${context.tenantNameLowerFirst} : null;
  }\n`;
        }
    },
]

module.exports = {
    file,
    tmpls
};
