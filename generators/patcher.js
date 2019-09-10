const chalk = require('chalk');
const debug = require('debug')('jhipster:multitenancy2:patcher');

const packagejs = require('generator-jhipster/package.json');

const jhipsterVersion = packagejs.version;

module.exports = class Patcher {
    constructor(module, templates, writeFiles) {
        this.module = module;
        this.templates = templates;
        this.writeFiles = writeFiles;
    }

    patch(generator) {
        this._patch(generator, this.templates, this.writeFiles);
    }

    _patch(generator, templates, writeFiles) {
        if (generator.ignorePatcher) return;
        if (templates) {
            const fileTemplates = this.requireTemplates(templates, generator);
            this.processPartialTemplates(generator, fileTemplates);
        }

        if (writeFiles) {
            writeFiles.call(generator);
        }
    }

    processPartialTemplates(generator, partialTemplates) {
        if (!generator || !generator.options) {
            debug('generator parameter is not a generator');
            generator.error('Error');
        }

        const abortOnPatchError = generator.options.abortOnPatchError || generator.options['abort-on-patch-error'] || false;
        partialTemplates.forEach(templates => {
            const file = typeof templates.file === 'function' ? templates.file(generator) : templates.file;
            templates.tmpls.forEach((item, index) => {
                debug(`======== Applying template ${templates.origin}[${index}] on ${file}`);
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
                    if (!item.condition(generator)) {
                        debug(`Template condition ${item.condition}`);
                        return;
                    }
                }
                // debug(`type: ${item.type}`);
                // debug(`regex: ${item.regex}`);
                const target = typeof item.target === 'function' ? item.target(generator) : item.target;
                // debug(`target: ${target}`);

                const tmpl = typeof item.tmpl === 'function' ? item.tmpl(generator) : item.tmpl;
                // debug(`tmpl: ${tmpl}`);
                let success;
                if (item.type === 'replaceContent') {
                    // replaceContent return undefined on 6.2.0
                    // https://github.com/jhipster/generator-jhipster/pull/10366
                    success = generator.replaceContent(file, target, tmpl, item.regex);
                } else if (item.type === 'rewriteFile') {
                    // replaceContent return undefined on 6.2.0
                    // https://github.com/jhipster/generator-jhipster/pull/10366
                    success = generator.rewriteFile(file, target, tmpl);
                }
                let successLog = `${success}`;
                if (!success) successLog = chalk.red(`${success}`);
                if (abortOnPatchError && success === false) generator.error(`Error applying template ${templates.origin} on ${file}`);
                debug(`======== Template finished type: ${item.type}, success: ${successLog}`);
            });
        });
    }

    requireTemplates(templates, generator) {
        const disableTenantFeatures = (generator.options['disable-tenant-features'] || '').split(',');
        const ret = [];
        templates.forEach(file => {
            const feature = file.split('/', 1);
            debug(`======== Loading Template ${file}`);
            if (disableTenantFeatures.includes(feature[0])) {
                debug(`======== Template ${file} disabled`);
                return;
            }
            // Look for specific version
            const template = `./${this.module}/partials/${file}`;
            let version = jhipsterVersion;
            let loadedFile;
            let loadedTemplate;
            while (loadedTemplate === undefined) {
                try {
                    loadedFile = `${template}.v${version}.js`;
                    debug(`======== Trying ${loadedFile}`);
                    loadedTemplate = require(loadedFile);
                } catch (e) {
                    const lastIndex = version.lastIndexOf('.');
                    if (lastIndex === -1) break;
                    version = version.substring(0, lastIndex);
                }
            }
            if (loadedTemplate === undefined) {
                try {
                    loadedFile = `${template}.js`;
                    loadedTemplate = require(loadedFile);
                } catch (e) {
                    if (generator && generator.log) generator.log(`Error loading ${template}`);
                    debug(`Error loading ${template}`);
                    return;
                }
            }
            loadedTemplate.origin = loadedFile;
            ret.push(loadedTemplate);
            debug(`Success loaded ${loadedFile}`);
        });
        return ret;
    }
};
