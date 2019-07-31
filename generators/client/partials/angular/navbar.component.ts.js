const file = (context) => {
    return `${context.CLIENT_MAIN_SRC_DIR}app/layouts/navbar/navbar.component.ts`;
};

const tmpls = [
    {
        type: 'rewriteFile',
        target: (context) => {
            return `getImageUrl() {`;
        },
        tmpl: (context) => {
            return `has${context.tenantNameUpperFirst}() {
    return this.accountService.get${context.tenantNameUpperFirst}() ? true : false;
  }
`;
        }
    },
]

module.exports = {
    file,
    tmpls
};