const file = (context) => {
    return `${context.javaDir}domain/${context.tenantNameUpperFirst}.java`;
};
//this.replaceContent(`${this.javaDir}domain/${this.tenantNameUpperFirst}.java`,
//`    @OneToMany(mappedBy = "'${this.tenantNameLowerFirst}'")`,
//`\t@OneToMany(mappedBy = "'${this.tenantNameLowerFirst}'", fetch = FetchType.EAGER)`);


const tmpls = [
    {
        type: 'replaceContent',
        regex: false,
        target: (context) => {
            return `@OneToMany(mappedBy = "${context.tenantNameLowerFirst}")`;
        },
        tmpl: (context) => {
            return `@OneToMany(mappedBy = "${context.tenantNameLowerFirst}", fetch = FetchType.EAGER)`;
        }
    },
]

module.exports = {
    file,
    tmpls
};
