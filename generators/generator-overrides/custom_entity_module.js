const chalk = require('chalk');
const debug = require('debug')('jhipster:multitenancy2:generator-overrides:custom-entity-module');

const jhipsterConstants = require('generator-jhipster/generators/generator-constants');

/*
 * =======================
 * Init patches
 * getAllJhipsterConfig isn't getting all jhipster config
 * Workaround https://github.com/jhipster/generator-jhipster/issues/10205
 */
function extend(Superclass) {
    return class GeneratorExtender extends Superclass {
        // Ignore version > 6.2.0, not yet released
        static get ignoreGreaterThan() {
            return '6.2.0';
        }

        /*
         * Override addEntityToMenu changing the menu tenant is added to.
         */
        addEntityToMenu(...args) {
            debug(`Executing addEntityToMenu ${args}`);
            if (args.length === 0) return;
            if (this.isTenant) {
                this.addElementToAdminMenu(
                    `admin/${this.tenantFileName}`,
                    'asterisk',
                    this.enableTranslation,
                    this.clientFramework,
                    `global.menu.admin.${this.tenantMenuTranslationKey}`
                );
                debug('Ignoring addEntityToMenu');
                return;
            }
            Superclass.prototype.addEntityToMenu.apply(this, args);
        }

        /*
         * Override addEntityTranslationKey changing the menu tenant is added to.
         */
        addEntityTranslationKey(...args) {
            debug(`Executing addEntityTranslationKey ${args}`);
            if (args.length === 0) return;
            if (this.isTenant) {
                debug('Using addAdminElementTranslationKey');
                this.addAdminElementTranslationKey(...args);
                return;
            }
            Superclass.prototype.addEntityTranslationKey.apply(this, args);
        }

        /*
         * Workaround entity always been add to entity module
         */
        addEntityToModule(
            entityInstance,
            entityClass,
            entityName,
            entityFolderName,
            entityFileName,
            entityUrl,
            clientFramework,
            microServiceName
        ) {
            debug(`fixAddEntityToModule ${entityInstance}`);
            if (entityInstance === undefined) return;
            if (!this.isTenant) {
                Superclass.prototype.addEntityToModule.apply(this, [
                    entityInstance,
                    entityClass,
                    entityName,
                    entityFolderName,
                    entityFileName,
                    entityUrl,
                    clientFramework,
                    microServiceName
                ]);
                return;
            }
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
            const moduleNeedle = 'jhipster-needle-add-admin-module';
            const appName = this.getAngularXAppName();
            const entityAngularName = entityName;

            const adminModulePath = `${jhipsterConstants.CLIENT_MAIN_SRC_DIR}app/admin/admin.module.ts`;
            const modulePath = `./${entityFolderName}/${entityFileName}.module`;

            const moduleName = microServiceName
                ? `${this.upperFirstCamelCase(microServiceName)}${entityAngularName}Module`
                : `${appName}${entityAngularName}Module`;
            const splicable = `|RouterModule.forChild([
                |            {
                |                path: '${entityFileName}',
                |                loadChildren: '${modulePath}#${moduleName}'
                |            }]),`;

            const errorMessage = `${chalk.yellow('Reference to ') + entityFileName + clientFramework} ${chalk.yellow(
                `not added to ${modulePath}.\n`
            )}`;

            const moduleRewriteFileModel = this.needleApi.clientAngular.generateFileModel(
                adminModulePath,
                moduleNeedle,
                this.stripMargin(splicable)
            );
            this.needleApi.clientAngular.addBlockContentToFile(moduleRewriteFileModel, errorMessage);
        }
    };
};

module.exports = {
    extend: extend
}
