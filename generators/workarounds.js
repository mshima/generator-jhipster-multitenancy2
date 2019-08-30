const chalk = require('chalk');
const jhipsterConstants = require('generator-jhipster/generators/generator-constants');

module.exports = {
    fixGetAllJhipsterConfig,
    fixAddEntityToModule
};

/*
 * Workaround https://github.com/jhipster/generator-jhipster/issues/10205
 */
function fixGetAllJhipsterConfig(generator) {
    const options = generator.options;
    const configOptions = generator.configOptions;
    generator._getAllJhipsterConfig = generator.getAllJhipsterConfig;
    generator.getAllJhipsterConfig = function(generator = this, force) {
        const configuration = this._getAllJhipsterConfig(generator, force);
        configuration._get = configuration.get;
        configuration.get = function(key) {
            const ret = options[key] || configOptions[key] || configuration._get(key);
            // generator.log(`${key} = ${ret}`);
            return ret;
        };
        return configuration;
    };
}

/*
 * Workaround entity always been add to entity module
 */
function fixAddEntityToModule(generator) {
    generator._addEntityToModule = generator.addEntityToModule;
    generator.addEntityToModule = function(
        entityInstance,
        entityClass,
        entityName,
        entityFolderName,
        entityFileName,
        entityUrl,
        clientFramework,
        microServiceName
    ) {
        /**
         * Add a new admin in the TS modules file.
         *
         * @param {string} appName - Angular2 application name.
         * @param {string} adminAngularName - The name of the new admin item.
         * @param {string} adminFolderName - The name of the folder.
         * @param {string} adminFileName - The name of the file.
         * @param {boolean} enableTranslation - If translations are enabled or not.
         * @param {string} clientFramework - The name of the client framework.
         */

        // addAdminToModule(appName, adminAngularName, adminFolderName, adminFileName, enableTranslation, clientFramework)
        // this.addAdminToModule(this.angularXAppName, this.tenantNameUpperFirst, `${this.tenantNameLowerFirst}-management`, `${this.tenantNameLowerFirst}-management`, this.enableTranslation, this.clientFramework);

        const moduleNeedle = 'jhipster-needle-add-admin-module';
        const appName = generator.getAngularXAppName();
        const entityAngularName = entityName;

        const adminModulePath = `${jhipsterConstants.CLIENT_MAIN_SRC_DIR}app/admin/admin.module.ts`;
        const modulePath = `./${entityFolderName}/${entityFileName}.module`;

        const moduleName = microServiceName
            ? `${this.generator.upperFirstCamelCase(microServiceName)}${entityAngularName}Module`
            : `${appName}${entityAngularName}Module`;
        const splicable = `|RouterModule.forChild([
                |            {
                |                path: '${entityFileName}',
                |                loadChildren: '${modulePath}#${moduleName}'
                |            }]),`;

        const errorMessage = `${chalk.yellow('Reference to ') + entityFileName + clientFramework} ${chalk.yellow(
            `not added to ${modulePath}.\n`
        )}`;

        const moduleRewriteFileModel = generator.needleApi.clientAngular.generateFileModel(
            adminModulePath,
            moduleNeedle,
            generator.stripMargin(splicable)
        );
        generator.needleApi.clientAngular.addBlockContentToFile(moduleRewriteFileModel, errorMessage);
    };
}
