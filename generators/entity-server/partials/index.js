const mtUtils = require('../../multitenancy-utils');

const entityTenantAwareTemplates = [
    'Entity.java',
] 

const tenantTemplates = [
    '_TenantResource',
    '_TenantService',
    '_Tenant.java',
] 


module.exports = {
    server: {
        entityTenantAwareTemplates: function (context) {
            return mtUtils.requireTemplates('./entity-server/partials/server/', entityTenantAwareTemplates, context);
        },
        tenantTemplates: function (context) {
            return mtUtils.requireTemplates('./entity-server/partials/server/', tenantTemplates, context);
        },
    }
};
