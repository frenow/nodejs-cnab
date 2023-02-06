"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BANK = exports.CNAB_YAML_DIR = void 0;
exports.CNAB_YAML_DIR = './node_modules/@banco-br/cnab_yaml';
exports.BANK = {
    bb: {
        code: '001',
        remessa: {
            400: ['header_arquivo', 'detalhe']
        },
        retorno: {
            400: ['header_arquivo', 'detalhe', 'trailer_arquivo']
        }
    },
    santander: {
        code: '033',
        remessa: {
            400: ['header_arquivo', 'detalhe', 'trailer_arquivo'],
            240: [
                'header_arquivo',
                'header_lote',
                'detalhe_segmento_p',
                'detalhe_segmento_q',
                'detalhe_segmento_r',
                'trailer_lote',
                'trailer_arquivo'
            ]
        },
        retorno: {
            400: ['header_arquivo', 'detalhe'],
            // 240: ['header_arquivo', 'header_lote', 'detalhe_segmento_t', 'detalhe_segmento_u']
            240: [
                {
                    headers: ['header_arquivo', 'header_lote'],
                    details: ['detalhe_segmento_t', 'detalhe_segmento_u'],
                    trailers: ['trailer_lote', 'trailer_arquivo']
                }
            ]
        }
    },
    banrisul: {
        code: '041',
        retorno: {
            400: ['header_arquivo', 'detalhe', 'trailer_arquivo']
        }
    },
    caixa: {
        code: '104',
        remessa: {
            400: ['header_arquivo', 'detalhe', 'trailer_arquivo']
        },
        retorno: {
            400: ['header_arquivo', 'detalhe', 'trailer_arquivo']
        }
    },
    bradesco: {
        code: '237',
        remessa: {
            400: ['header_arquivo', 'detalhe', 'trailer_arquivo']
        },
        retorno: {
            400: ['header_arquivo', 'detalhe', 'trailer_arquivo']
        }
    },
    itau: {
        code: '341',
        retorno: {
            400: ['header_arquivo', 'detalhe', 'trailer_arquivo']
        }
    },
    bancoob: {
        code: '756',
        remessa: {
            400: ['header_arquivo', 'detalhe', 'trailer_arquivo']
        },
        retorno: {
            400: ['header_arquivo', 'detalhe', 'trailer_arquivo']
        }
    }
};
//# sourceMappingURL=const.js.map