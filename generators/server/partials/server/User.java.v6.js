// Add jpa filter to the entity to remove entries from another tenant
const file = (context) => {
    return `${context.SERVER_MAIN_SRC_DIR}${context.packageFolder}/domain/User.java`;
};

const tmpls = [
    {
        type: 'replaceContent',
        regex: true,
        target: (context) => {
            return `(import org\\.hibernate\\.annotations\\.CacheConcurrencyStrategy;)`;
        },
        tmpl: (context) => {
            return `$1
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;`;
        }
    },
    {
        type: 'replaceContent',
        regex: true,
        target: (context) => {
            return `(public class User)`;
        },
        tmpl: (context) => {
            return `@FilterDef(name = "${context.tenantNameUpperCase}_FILTER", parameters = {@ParamDef(name = "${context.tenantNameSpinalCased}Id", type = "long")})
@Filter(name = "${context.tenantNameUpperCase}_FILTER", condition = "${context.tenantNameSpinalCased}_id = :${context.tenantNameSpinalCased}Id")
$1`;
        }
    },
    {
        type: 'replaceContent',
        regex: true,
        target: (context) => {
            return `((.*)public Long getId)`;
        },
        tmpl: (context) => {
            return `$2@ManyToOne
$2@JsonIgnoreProperties("users")
$2private ${context.tenantNameUpperFirst} ${context.tenantNameLowerFirst};

$1`;
        }
    },
    {
        type: 'replaceContent',
        regex: true,
        target: (context) => {
            return `(\n(.*)this\\.persistentTokens = persistentTokens;
(.*)\\})`;
        },
        tmpl: (context) => {
            return `$1

$3public ${context.tenantNameUpperFirst} get${context.tenantNameUpperFirst}() {
$2return ${context.tenantNameLowerFirst};
$3}

$3public void set${context.tenantNameUpperFirst}(${context.tenantNameUpperFirst} ${context.tenantNameLowerFirst}) {
$2this.${context.tenantNameLowerFirst} = ${context.tenantNameLowerFirst};
$3}`;
        }
    },
    {
        type: 'replaceContent',
        regex: true,
        target: (context) => {
            return `((.*)", activationKey='" \\+ activationKey \\+ '\\\\'' \\+)`;
        },
        tmpl: (context) => {
            return `$1
$2", ${context.tenantNameLowerFirst}='" + ${context.tenantNameLowerFirst} + '\\'' +`;
        }
    },
]

module.exports = {
    file,
    tmpls
};
