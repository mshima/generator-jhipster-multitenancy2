const file = (context) => {
    return `${context.CLIENT_MAIN_SRC_DIR}app/core/user/account.model.ts`;
};

const tmpls = [
    {
        type: 'rewriteFile',
        target: (context) => {
            return `public imageUrl: string`;
        },
        tmpl: (context) => {
            return `public company: string,`;
        }
    },
]

module.exports = {
    file,
    tmpls
};