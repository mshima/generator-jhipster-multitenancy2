const mtUtils = require('../multitenancy-utils');

const angularTemplates = ['tenant_admin_menu/global.json'];

module.exports = {
    angular: {
        templates(context) {
            return mtUtils.requireTemplates.call(this, './languages/partials/', angularTemplates, context);
        }
    }
};
