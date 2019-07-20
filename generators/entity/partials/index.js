const mtUtils = require('../../multitenancy-utils');

const angularTemplates = [
    'entity.model.ts',
    'entity.component.html',
    'entity-detail.component.html',
    'entity-update.component.html',
    'entity-update.component.ts'
] 

const angularTestTemplates = [
    'tenant-management.spec.ts',
] 

module.exports = {
    angular: {
        templates: function (context) {
            return mtUtils.requireTemplates('./entity/partials/angular/', angularTemplates, context);
        },
        testTemplates: function (context) {
            return mtUtils.requireTemplates('./entity/partials/angular/', angularTestTemplates, context);
        },
        languageTemplates: [
        ],
    }
};
