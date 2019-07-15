const mtUtils = require('../../multitenancy-utils');

const serverTemplates = [
    'Entity.java',
] 

const angularTemplates = [
    'entity.model.ts',
    'entity.component.html',
    'entity-detail.component.html',
    'entity-update.component.html',
    'entity-update.component.ts'
] 

const angularTestTemplates = [
    'tenant-management.spec.ts',
    'entity.spec.ts',
] 

module.exports = {
    server: {
        templates: function (context) {
            return mtUtils.requireTemplates('./entity/partials/angular/', serverTemplates, context);
        },
    },
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
