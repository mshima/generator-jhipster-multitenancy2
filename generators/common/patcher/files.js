module.exports = {
    files: {
        common: [
            {
                condition: generator => false,
                templates: ['npm-shrinkwrap.json']
            }
        ]
    }
};
