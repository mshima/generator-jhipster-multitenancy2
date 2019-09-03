const _ = require('lodash');
const pluralize = require('pluralize');
const debug = require('debug')('jhipster:multitenancy2:utils');

const packagejs = require('generator-jhipster/package.json');

const jhipsterVersion = packagejs.version;

/**
 * Utils file to hold methods common to both generator and sub generator
 */
module.exports = {
    containsRelationship,
    getRelationship,
    getArrayItemWithFieldValue,
    tenantVariables,
    processPartialTemplates,
    requireTemplates
};

function containsRelationship(generator, relationships, value) {
    return getRelationship(generator, relationships, value) !== undefined;
}

function getRelationship(generator, relationships, value) {
    return getArrayItemWithFieldValue(generator, relationships, 'relationshipName', value);
}

function getArrayItemWithFieldValue(generator, array, fieldName, value) {
    value = generator._.toLower(value);
    let found;
    array.forEach(item => {
        if (item[fieldName] !== undefined && generator._.toLower(item[fieldName]) === value) {
            found = item;
        }
    });
    return found;
}

// Variations in tenant name
function tenantVariables(tenantName, context, generator = this) {
    if (tenantName === undefined) {
        debug('tenantName is undefined');
        return;
    }
    /* tenant variables */
    const tenantNamePluralizedAndSpinalCased = _.kebabCase(pluralize(tenantName));

    context.tenantClientRootFolder = '../admin';

    context.tenantName = _.camelCase(tenantName);

    context.tenantNameCapitalized = _.upperFirst(tenantName);
    context.tenantClass = context.tenantNameCapitalized;
    context.tenantClassHumanized = _.startCase(context.tenantNameCapitalized);
    context.tenantClassPlural = pluralize(context.tenantClass);
    context.tenantClassPluralHumanized = _.startCase(context.tenantClassPlural);
    context.tenantInstance = _.lowerFirst(tenantName);
    context.tenantInstancePlural = pluralize(context.tenantInstance);
    context.tenantApiUrl = tenantNamePluralizedAndSpinalCased;
    context.tenantFileName = _.kebabCase(context.tenantNameCapitalized + _.upperFirst(context.entityAngularJSSuffix));
    context.tenantFolderName = generator.getEntityFolderName(context.tenantClientRootFolder, context.tenantFileName);
    context.tenantModelFileName = context.tenantFolderName;
    // context.tenantParentPathAddition = context.getEntityParentPathAddition(context.clientRootFolder);
    context.tenantPluralFileName = tenantNamePluralizedAndSpinalCased + context.entityAngularJSSuffix;
    context.tenantServiceFileName = context.tenantFileName;
    context.tenantAngularName = context.tenantClass + generator.upperFirstCamelCase(context.entityAngularJSSuffix);
    context.tenantReactName = context.tenantClass + generator.upperFirstCamelCase(context.entityAngularJSSuffix);

    context.tenantStateName = `admin/${context.tenantFileName}`;

    context.tenantTranslationKey = context.tenantInstance;

    context.tenantMenuTranslationKey = `${context.tenantName}`;

    context.tenantName = _.camelCase(tenantName);
    context.tenantNameUpperCase = _.toUpper(tenantName);
    context.tenantNameLowerCase = _.toLower(tenantName);
    context.tenantNameLowerFirst = _.lowerFirst(tenantName);
    context.tenantNameUpperFirst = _.upperFirst(tenantName);
    context.tenantNameSpinalCased = _.kebabCase(context.tenantNameLowerFirst);
    context.tenantNamePlural = pluralize(context.tenantNameLowerFirst);
    context.tenantNamePluralLowerFirst = pluralize(context.tenantNameLowerFirst);
    context.tenantNamePluralUpperFirst = pluralize(context.tenantNameUpperFirst);

    context.angularTenantComponentSuffix = '';
    context.angularTenantSelectorSuffix = '';

    // relative to app root
    context.tenantModelPath = 'shared/admin';
    context.tenantServicePath = `admin/${context.tenantFileName}`;
}

function processPartialTemplates(partialTemplates, context) {
    partialTemplates.forEach(templates => {
        const file = typeof templates.file === 'function' ? templates.file(context) : templates.file;
        templates.tmpls.forEach(item => {
            debug(`======== Template ${file}`);
            // ignore if version is not compatible
            if (item.versions && !item.versions.includes(jhipsterVersion)) {
                debug(`Version not compatible ${jhipsterVersion}`);
                return;
            }
            if (item.disabled) {
                debug('Template disabled');
                return;
            }
            if (typeof item.condition === 'function') {
                if (!item.condition(context)) {
                    debug(`Template condition ${item.condition}`);
                    return;
                }
            }
            debug(`type: ${item.type}`);
            debug(`regex: ${item.regex}`);
            const target = typeof item.target === 'function' ? item.target(context) : item.target;
            debug(`target: ${target}`);

            const tmpl = typeof item.tmpl === 'function' ? item.tmpl(context) : item.tmpl;
            debug(`tmpl: ${tmpl}`);
            if (item.type === 'replaceContent') {
                context.replaceContent(file, target, tmpl, item.regex);
            } else if (item.type === 'rewriteFile') {
                context.rewriteFile(file, target, tmpl);
            }
        });
    });
}

function requireTemplates(prefix, templates, context) {
    const ret = [];
    debug(`============ Loading templates from ${prefix}`);
    templates.forEach(file => {
        // Look for specific version
        const template = prefix + file;
        let version = jhipsterVersion;
        while (version !== '') {
            try {
                ret.push(require(`${template}.v${version}.js`));
                debug(`Success loading ${template}.v${version}`);
                return;
            } catch (e) {
                version = version.substring(0, version.lastIndexOf('.'));
            }
        }
        try {
            ret.push(require(`${template}.js`));
        } catch (e) {
            debug(`Error loading ${template}`);
        }
    });
    return ret;
}
