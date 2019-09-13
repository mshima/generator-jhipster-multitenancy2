module.exports = {
    files: {
        common: [
            {
                condition: generator => !generator.shrinkwrapExists,
                templates: ['npm-shrinkwrap.json']
            }
        ]
    }
};
