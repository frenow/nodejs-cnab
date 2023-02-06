export declare const CNAB_YAML_DIR = "./node_modules/@banco-br/cnab_yaml";
export declare const BANK: {
    bb: {
        code: string;
        remessa: {
            400: string[];
        };
        retorno: {
            400: string[];
        };
    };
    santander: {
        code: string;
        remessa: {
            400: string[];
            240: string[];
        };
        retorno: {
            400: string[];
            240: {
                headers: string[];
                details: string[];
                trailers: string[];
            }[];
        };
    };
    banrisul: {
        code: string;
        retorno: {
            400: string[];
        };
    };
    caixa: {
        code: string;
        remessa: {
            400: string[];
        };
        retorno: {
            400: string[];
        };
    };
    bradesco: {
        code: string;
        remessa: {
            400: string[];
        };
        retorno: {
            400: string[];
        };
    };
    itau: {
        code: string;
        retorno: {
            400: string[];
        };
    };
    bancoob: {
        code: string;
        remessa: {
            400: string[];
        };
        retorno: {
            400: string[];
        };
    };
};
