const Patcher = require('../patcher');

const angularTemplates = ['tenant_admin_menu/global.json'];

module.exports = class LanguagesPatcher extends Patcher {
    constructor(generator) {
        super(generator, 'languages', angularTemplates);
    }
};
