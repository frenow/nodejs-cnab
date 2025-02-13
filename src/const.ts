export const CNAB_YAML_DIR = './node_modules/@banco-br/cnab_yaml'
export const BANK = {
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
      240: {
        headers: { name: ['header_arquivo', 'header_lote'], quantity: 2 },
        details: { name: ['detalhe_segmento_t', 'detalhe_segmento_u'] },
        trailers: { name: ['trailer_lote', 'trailer_arquivo'], quantity: 2 }
      }
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
}
