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
        if (templates) {
            const fileTemplates = this.requireTemplates(templates, generator);
            this.processPartialTemplates(generator, fileTemplates);
        }

        if (writeFiles) {
            writeFiles.call(generator);
        }
    }

    processPartialTemplates(generator, partialTemplates) {
        partialTemplates.forEach(templates => {
            const file = typeof templates.file === 'function' ? templates.file(generator) : templates.file;
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
                if (item.type === 'replaceContent') {
                    // replaceContent return undefined on 6.2.0
                    // https://github.com/jhipster/generator-jhipster/pull/10366
                    if (generator.replaceContent(file, target, tmpl, item.regex) === false)
                        generator.error(`Error applying template ${file}`);
                } else if (item.type === 'rewriteFile') {
                    // replaceContent return undefined on 6.2.0
                    // https://github.com/jhipster/generator-jhipster/pull/10366
                    if (generator.rewriteFile(file, target, tmpl) === false) generator.error(`Error applying template ${file}`);
                }
                debug(`======== Template ${file} Finished`);
            });
        });
    }

    requireTemplates(templates, generator) {
        const disableTenantFeatures = (generator.options['disable-tenant-features'] || '').split(',');
        const ret = [];
        templates.forEach(file => {
            const feature = file.split('/', 1);
            if (disableTenantFeatures.includes(feature[0])) {
                debug(`======== Template ${file} disabled`);
                return;
            }
            // Look for specific version
            const template = `./${this.module}/partials/${file}`;
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
                if (generator && generator.log) generator.log(`Error loading ${template}`);
                debug(`Error loading ${template}`);
            }
        });
        return ret;
    }
};
