const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
// const fse = require('fs-extra');

// const constants = require('generator-jhipster/generators/generator-constants');
const angularFiles = require('generator-jhipster/generators/client/files-angular').files;
// const reactFiles = require('generator-jhipster/generators/client/files-react').files;

const getFilesForOptions = require('./jhipster_utils/utils').getFilesForOptions;
const expectedFiles = require('./jhipster_utils/expected-files');
const mtExpectedFiles = require('./multitenancy_utils/expected-files');
// const shouldBeV3DockerfileCompatible = require('./jhipster_utils/utils').shouldBeV3DockerfileCompatible;

// const CLIENT_MAIN_SRC_DIR = constants.CLIENT_MAIN_SRC_DIR;
// const SERVER_MAIN_SRC_DIR = constants.SERVER_MAIN_SRC_DIR;
// const SERVER_MAIN_RES_DIR = constants.SERVER_MAIN_RES_DIR;
// const TEST_DIR = constants.TEST_DIR;

describe('JHipster generator with multitenancy2 blueprint', () => {
    context('Default configuration with', () => {
        describe('AngularX', () => {
            before(done => {
                helpers
                    .run('generator-jhipster/generators/app')
                    .withOptions({
                        'from-cli': true,
                        skipInstall: true,
                        blueprint: 'multitenancy2',
                        'tenant-changelog-date': 20190907201713,
                        defaultTenantAware: true,
                        tenantFileSuffix: 'management',
                        'abort-on-patch-error': true,
                        skipChecks: true
                    })
                    .withGenerators([
                        [
                            require('../generators/common/index.js'), // eslint-disable-line global-require
                            'jhipster-multitenancy2:common',
                            path.join(__dirname, '../generators/common/index.js')
                        ],
                        [
                            require('../generators/server/index.js'), // eslint-disable-line global-require
                            'jhipster-multitenancy2:server',
                            path.join(__dirname, '../generators/server/index.js')
                        ],
                        [
                            require('../generators/client/index.js'), // eslint-disable-line global-require
                            'jhipster-multitenancy2:client',
                            path.join(__dirname, '../generators/client/index.js')
                        ],
                        [
                            require('../generators/entity/index.js'), // eslint-disable-line global-require
                            'jhipster-multitenancy2:entity',
                            path.join(__dirname, '../generators/entity/index.js')
                        ],
                        [
                            require('../generators/entity-client/index.js'), // eslint-disable-line global-require
                            'jhipster-multitenancy2:entity-client',
                            path.join(__dirname, '../generators/entity-client/index.js')
                        ],
                        [
                            require('../generators/entity-server/index.js'), // eslint-disable-line global-require
                            'jhipster-multitenancy2:entity-server',
                            path.join(__dirname, '../generators/entity-server/index.js')
                        ]
                    ])
                    .withPrompts({
                        tenantName: 'Company',
                        baseName: 'jhipster',
                        clientFramework: 'angularX',
                        packageName: 'com.mycompany.myapp',
                        packageFolder: 'com/mycompany/myapp',
                        serviceDiscoveryType: false,
                        authenticationType: 'jwt',
                        cacheProvider: 'ehcache',
                        enableHibernateCache: true,
                        databaseType: 'sql',
                        devDatabaseType: 'h2Memory',
                        prodDatabaseType: 'mysql',
                        enableTranslation: true,
                        nativeLanguage: 'en',
                        languages: ['fr'],
                        buildTool: 'maven',
                        rememberMeKey: '5c37379956bd1242f5636c8cb322c2966ad81277',
                        skipClient: false,
                        skipUserManagement: false,
                        serverSideOptions: []
                    })
                    .on('end', done);
            });

            /*
            it('Force print file', () => {
                assert.fileContent('.yo-rc.json', /fail to debug/);
            });
            */

            it('tenantName is saved in .yo-rc.json', () => {
                assert.JSONFileContent('.yo-rc.json', {
                    'generator-jhipster-multitenancy2': { tenantName: 'company' }
                });
            });

            it('creates expected default files with tenant files for angularX', () => {
                assert.file(expectedFiles.common);
                assert.file(expectedFiles.server);
                assert.file(expectedFiles.userManagementServer);
                assert.file(expectedFiles.jwtServer);
                assert.file(expectedFiles.maven);
                assert.file(expectedFiles.dockerServices);
                assert.file(expectedFiles.mysql);
                assert.file(expectedFiles.hibernateTimeZoneConfig);
                assert.file(
                    getFilesForOptions(angularFiles, {
                        enableTranslation: true,
                        serviceDiscoveryType: false,
                        authenticationType: 'jwt',
                        testFrameworks: []
                    })
                );
                assert.file(mtExpectedFiles.entity.clientNg2);
                assert.file(mtExpectedFiles.entity.server);
                assert.file(mtExpectedFiles.server);
                assert.file(mtExpectedFiles.tenantManagementServer);
                assert.file(mtExpectedFiles.i18nJson);
            });
        });
    });
});
