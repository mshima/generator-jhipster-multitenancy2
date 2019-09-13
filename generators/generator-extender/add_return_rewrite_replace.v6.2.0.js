const chalk = require('chalk');
const debug = require('debug')('jhipster:multitenancy2:generator-extender:add-return-rewrite-replace');

const jhipsterUtils = require('../utils-overrides');

/*
 * Implement return for patches verification
 * https://github.com/jhipster/generator-jhipster/pull/10366
 */
function addBlockContentToFile(rewriteFileModel, errorMessage) {
    debug('Running addBlockContentToFile');
    try {
        return jhipsterUtils.rewriteFile(rewriteFileModel, this.generator);
    } catch (e) {
        this.logNeedleNotFound(e, errorMessage, rewriteFileModel.file);
        return false;
    }
}

/*
 * =======================
 * Init patches
 * Implement return for patches verification
 * https://github.com/jhipster/generator-jhipster/pull/10366
 */
function extend(Superclass, jhipsterVersion) {
    return class GeneratorExtender extends Superclass {
        replaceContent(filePath, pattern, content, regex) {
            try {
                return jhipsterUtils.replaceContent(
                    {
                        file: filePath,
                        pattern,
                        content,
                        regex
                    },
                    this
                );
            } catch (e) {
                this.log(
                    chalk.yellow('\nUnable to find ') + filePath + chalk.yellow(' or missing required pattern. File rewrite failed.\n') + e
                );
                this.debug('Error:', e);
                return false;
            }
        }

        rewriteFile(filePath, needle, content) {
            const rewriteFileModel = this.needleApi.base.generateFileModel(filePath, needle, content);
            return addBlockContentToFile.call(this.needleApi.base, rewriteFileModel);
        }
    };
}

module.exports = {
    extendVersion: {
        notGreaterThan: '6.2.0'
    },
    extend: extend,
}
