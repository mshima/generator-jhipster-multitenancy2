const mtUtils = require('../multitenancy-utils');

const i18nTemplates = ['global.json'];

module.exports = {
    i18n: {
        i18nTemplates(context) {
            return mtUtils.requireTemplates('./entity-i18n/partials/', i18nTemplates, context);
        }
    }
};
