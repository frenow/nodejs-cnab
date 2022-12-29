(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.nodejsCnab = {}));
}(this, (function (exports) { 'use strict';

  var CNAB_YAML_DIR = './node_modules/@banco-br/cnab_yaml';
  var BANK = {
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
              240: ['header_arquivo', 'detalhe', 'trailer_arquivo']
          },
          retorno: {
              400: ['header_arquivo', 'detalhe'],
              240: ['header_arquivo', 'detalhe']
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

  var pad = require('pad');
  var fs = require('fs');
  var yaml = require('js-yaml');
  function makeLine(layout, data) {
      var object = {};
      if (layout) {
          Object.keys(layout).forEach(function (key) {
              var item = layout[key];
              if (item.pos) {
                  var start = item.pos[0] - 1; // yml começa no 1 e array em 0
                  var length_1 = item.pos[1] - item.pos[0] + 1;
                  if (data) {
                      object[key] = data.substr(start, length_1) || item.default;
                  }
                  else {
                      console.warn('Nao tem data', data);
                  }
              }
              else {
                  console.warn('Nao tem posicao pra key', key);
              }
          });
      }
      return object;
  }
  function readLine(layout, data) {
      var line = '';
      var object = {};
      if (layout) {
          Object.keys(layout).forEach(function (key) {
              var item = layout[key];
              var value;
              if (key in data && data[key]) {
                  value = data[key];
              }
              else {
                  value = item.default;
              }
              var baseValue = value ? value + '' : '';
              var pictures = usePicture(item, baseValue);
              object[key] = pictures;
              line += pictures;
          });
      }
      return { line: line, object: object };
  }
  /**
   *
   *
   */
  var usePicture = function (item, value) {
      if (value === void 0) { value = ''; }
      var picture = item.picture;
      if (picture.indexOf('V9') > 0) {
          var out = regexPicture(/9\((\w+?)\)/g, picture);
          return formatCurrency(Number(value), Number(out[0]), Number(out[1]));
      }
      else if (picture.startsWith('9')) {
          var out = regexPicture(/9\((\w+?)\)/g, picture);
          if (item.date_format) {
              return formatDate(value, out[0], item.date_format); // , item.date_format
          }
          else {
              return formatNumber(value, out[0]);
          }
      }
      else if (picture.startsWith('X')) {
          var out = regexPicture(/X\((\w+?)\)/g, picture);
          return formatText(value, out[0]);
      }
      else {
          throw new Error("Cant recognize picture for " + picture);
      }
  };
  var regexPicture = function (exp, picture) {
      var regex = new RegExp(exp);
      var text = picture; // "9(10)V9(10)",
      var result;
      var out = [];
      // tslint:disable-next-line:no-conditional-assignment
      while ((result = regex.exec(text))) {
          out.push(result[1]);
      }
      return out;
  };
  /*
   * Alfanumérico (picture X): alinhados à esquerda com brancos à direita. Preferencialmente,
   * todos os caracteres devem ser maiúsculos. Aconselhase a não utilização de
   * caracteres especiais (ex.: “Ç”, “?”,, etc) e
   * acentuação gráfica (ex.: “Á”, “É”, “Ê”, etc) e os campos não utiliza dos deverão ser preenchidos com brancos.
   * */
  var formatText = function (value, size) {
      return pad(value.slice(0, size), size, ' ');
  };
  /*  Numérico (picture 9): alinhado à direita com zeros à esquerda e os campos não utilizados deverão ser preenchidos
   * com zeros. - Vírgula assumida (picture V): indica a posição da vírgula dentro de um campo numérico.
   * Exemplo: num campo com picture “9(5)V9(2)”, o número “876,54” será representado por “0087654”
   * @param {*} picture
   * @param {*} value
   */
  var formatNumber = function (value, size) {
      while (value.length < size) {
          value = '0' + value;
      }
      return value;
  };
  var formatDate = function (value, size, dateFormat) {
      switch (dateFormat) {
          case '%d%m%Y':
              value = value.slice(0, 8);
              break;
          case '%d%m%y':
              value = value.slice(0, 4) + value.slice(6, 8);
              break;
          case '%H%M%S':
              value = value.slice(0, 8);
              break;
          default:
              throw new Error('dateFormat inválido: ' + dateFormat);
      }
      while (value.length < size) {
          value = '0' + value;
      }
      return value;
  };
  function formatCurrency(value, integer, decimal) {
      if (value === void 0) { value = 0; }
      if (integer === void 0) { integer = 0; }
      if (decimal === void 0) { decimal = 0; }
      value = Number(value);
      if (typeof value !== 'number') {
          throw new Error('formatCurrency: ' + value + integer + decimal);
      }
      //  Efetua o arredondamento
      var vals = value.toFixed(decimal).split('.');
      vals[1] = vals[1] || '';
      //  Limita os caracteres
      vals[0] = pad(Number(integer), vals[0].toString().slice(0, integer), '0');
      vals[1] = pad(vals[1].toString().slice(0, decimal), Number(decimal), '0');
      return vals.join('');
  }
  function readYaml(filename) {
      return yaml.safeLoad(fs.readFileSync(filename, 'utf8'));
  }

  /**
   * ARQUIVO REMESSA
   * @param {*} files
   * @param {*} cnabtype
   * @param {*} bankcode
   */
  var generateRemessaCnab = function (files, cnabtype, bankcode) {
      if (cnabtype === void 0) { cnabtype = 400; }
      if (bankcode === void 0) { bankcode = '237'; }
      try {
          var yamls_1 = [];
          var _loop_1 = function (key) {
              var value = files[key];
              if (value.forEach) {
                  value.forEach(function (v) {
                      var layout = readYaml(CNAB_YAML_DIR + ("/cnab" + cnabtype + "/" + bankcode + "/remessa/" + key + ".yml"));
                      yamls_1.push({
                          layout: layout,
                          data: v
                      });
                  });
              }
              else {
                  var layout = readYaml(CNAB_YAML_DIR + ("/cnab" + cnabtype + "/" + bankcode + "/remessa/" + key + ".yml"));
                  yamls_1.push({
                      layout: layout,
                      data: value
                  });
              }
          };
          for (var key in files) {
              _loop_1(key);
          }
          var infos = yamls_1.map(function (i, index) {
              return readLine(i.layout, i.data);
          });
          var infosLine = infos.map(function (i) {
              return i.line;
          });
          var CNAB_EOL = '\r\n';
          var data = infosLine.join(CNAB_EOL);
          return data;
      }
      catch (e) {
          console.error("generateRemessaCnab", e);
      }
  };

  /**
   * ARQUIVO RETORNO
   * @param {*} files
   * @param {*} cnabtype
   * @param {*} bankcode
   */
  var parseRemessaCnab = function (files, cnabtype, bankcode, retorno) {
      if (cnabtype === void 0) { cnabtype = 400; }
      if (bankcode === void 0) { bankcode = '237'; }
      try {
          var yamls_1 = [];
          var retornoLines_1 = retorno.split('\n');
          var index_1 = 0;
          var _loop_1 = function (key) {
              var value = files[key];
              console.log(value);
              if (value.indexOf('codigo') === 0) {
                  return "continue";
              }
              if (value.forEach) {
                  value.forEach(function (v) {
                      var layout = readYaml(CNAB_YAML_DIR + ("/cnab" + cnabtype + "/" + bankcode + "/retorno/" + value + ".yml"));
                      yamls_1.push({
                          layout: layout,
                          data: retornoLines_1[index_1]
                      });
                  });
              }
              else {
                  var layout = readYaml(CNAB_YAML_DIR + ("/cnab" + cnabtype + "/" + bankcode + "/retorno/" + value + ".yml"));
                  yamls_1.push({
                      layout: layout,
                      data: retornoLines_1[index_1]
                  });
              }
              index_1++;
          };
          for (var key in files) {
              _loop_1(key);
          }
          var infos = yamls_1.map(function (i, index) {
              var line = makeLine(i.layout, i.data);
              return line;
          });
          return infos;
      }
      catch (e) {
          console.error("parseRemessaCnab: ", e);
      }
  };

  // tslint:disable:variable-name
  var _a = require('brazilian-values'), isCNPJ = _a.isCNPJ, isCPF = _a.isCPF;
  var dayjs = require('dayjs');
  function helperGenerateRemessaCNAB240(dadosGeracao, bankCode) {
      var Return = [];
      /**
       * Header - Arquivo
       */
      var header_arquivo = {
          codigo_inscricao: dadosGeracao.codigo_inscricao,
          numero_inscricao: dadosGeracao.numero_inscricao,
          codigo_convenio: dadosGeracao.codigo_convenio,
          agencia: dadosGeracao.agencia,
          conta_corrente: dadosGeracao.conta_corrente,
          conta_corrente_dv: dadosGeracao.conta_corrente_dv,
          nome_empresa: dadosGeracao.nome_empresa,
          data_geracao: dayjs(dadosGeracao.data_geracao).format('DDMMYYYY'),
          hora_geracao: dayjs(dadosGeracao.data_geracao).format('HHmmss'),
          numero_sequencial_arquivo: dadosGeracao.numero_sequencial_arquivo
      };
      Return.push({ header_arquivo: header_arquivo });
      /**
       * Header - Lote
       */
      var header_lote = {
          codigo_inscricao: dadosGeracao.codigo_inscricao,
          numero_inscricao: dadosGeracao.numero_inscricao,
          codigo_convenio: dadosGeracao.codigo_convenio,
          agencia: dadosGeracao.agencia,
          conta_corrente: dadosGeracao.conta_corrente,
          conta_corrente_dv: dadosGeracao.conta_corrente_dv,
          nome_empresa: dadosGeracao.nome_empresa,
          data_geracao: header_arquivo.data_geracao,
          numero_sequencial_arquivo: dadosGeracao.numero_sequencial_arquivo
      };
      Return.push({ header_lote: header_lote });
      /**
       * Detalhe Segmento
       */
      var numero_sequencial_lote = 0;
      dadosGeracao.detalhe_segmento.forEach(function (detalhe_segmento) {
          /**
           * Detalhe Segmento P
           */
          numero_sequencial_lote++;
          var detalhe_segmento_p = {
              numero_sequencial_lote: numero_sequencial_lote,
              agencia: dadosGeracao.agencia,
              conta_corrente: dadosGeracao.conta_corrente,
              conta_corrente_dv: dadosGeracao.conta_corrente_dv,
              nosso_numero: detalhe_segmento.nosso_numero,
              numero_documento: detalhe_segmento.numero_documento,
              vencimento: dayjs(detalhe_segmento.vencimento).format('DDMMYYYY'),
              valor_titulo: detalhe_segmento.valor_titulo,
              data_emissao: dayjs(detalhe_segmento.data_emissao).format('DDMMYYYY'),
              uso_empresa: detalhe_segmento.uso_empresa
          };
          Return.push({ detalhe_segmento_p: detalhe_segmento_p });
          /**
           * Detalhe Segmento Q
           */
          numero_sequencial_lote++;
          var sacado_codigo_inscricao = 3;
          if (isCPF(detalhe_segmento.sacado_numero_inscricao))
              sacado_codigo_inscricao = 1;
          if (isCNPJ(detalhe_segmento.sacado_numero_inscricao))
              sacado_codigo_inscricao = 2;
          var detalhe_segmento_q = {
              numero_sequencial_lote: numero_sequencial_lote,
              sacado_codigo_inscricao: sacado_codigo_inscricao,
              sacado_numero_inscricao: detalhe_segmento.sacado_numero_inscricao,
              nome: detalhe_segmento.nome,
              logradouro: detalhe_segmento.logradouro,
              bairro: detalhe_segmento.bairro,
              cep: detalhe_segmento.cep,
              cidade: detalhe_segmento.cidade,
              estado: detalhe_segmento.estado
          };
          Return.push({ detalhe_segmento_q: detalhe_segmento_q });
      });
      /**
       * Trailler - Lote
       */
      var valor_total_titulo_simples = dadosGeracao.detalhe_segmento
          .map(function (El) { return El.valor_titulo; })
          .reduce(function (curr, total) { return total + curr; }, 0);
      var trailer_lote = {
          qtde_registro_lote: dadosGeracao.detalhe_segmento.length * 2 + 2,
          qtde_titulo_cobranca_simples: dadosGeracao.detalhe_segmento.length,
          valor_total_titulo_simples: valor_total_titulo_simples
      };
      Return.push({ trailer_lote: trailer_lote });
      /**
       * Trailler Arquivo
       */
      var trailer_arquivo = {
          qtde_lotes: 1,
          qtde_registros: Return.length + 1
      };
      Return.push({ trailer_arquivo: trailer_arquivo });
      return Return.map(function (Row) { return generateRemessaCnab(Row, 240, bankCode); }).join('\n');
  }

  // tslint:disable:variable-name
  var _a$1 = require('brazilian-values'), isCNPJ$1 = _a$1.isCNPJ, isCPF$1 = _a$1.isCPF;
  var dayjs$1 = require('dayjs');
  var sumBy = require('lodash').sumBy;
  function helperGenerateRemessaCNAB400(dadosGeracao, bankCode) {
      var Return = [];
      var numero_sequencial = 0;
      /**
       * Header - Arquivo
       */
      numero_sequencial++;
      var header_arquivo = {
          codigo_convenio: dadosGeracao.codigo_convenio,
          nome_empresa: dadosGeracao.nome_empresa,
          data_geracao: dayjs$1(dadosGeracao.data_geracao).format('DDMMYYYY'),
          numero_sequencial: Number(numero_sequencial)
      };
      Return.push({ header_arquivo: header_arquivo });
      /**
       * Detalhe Segmento
       */
      dadosGeracao.detalhe_segmento.forEach(function (detalhe_segmento) {
          numero_sequencial++;
          var sacado_codigo_inscricao = 99;
          if (isCPF$1(detalhe_segmento.sacado_numero_inscricao))
              sacado_codigo_inscricao = 1;
          if (isCNPJ$1(detalhe_segmento.sacado_numero_inscricao))
              sacado_codigo_inscricao = 2;
          var detalhe = {
              codigo_inscricao: isCNPJ$1(dadosGeracao.numero_inscricao) ? 2 : 1,
              numero_inscricao: dadosGeracao.numero_inscricao,
              codigo_convenio: dadosGeracao.codigo_convenio,
              uso_empresa: detalhe_segmento.uso_empresa,
              mensagem: detalhe_segmento.mensagem,
              numero_documento: detalhe_segmento.numero_documento,
              vencimento: dayjs$1(detalhe_segmento.vencimento).format('DDMMYYYY'),
              valor_titulo: detalhe_segmento.valor_titulo,
              data_emissao: dayjs$1(detalhe_segmento.data_emissao).format('DDMMYYYY'),
              sacado_codigo_inscricao: sacado_codigo_inscricao,
              sacado_numero_inscricao: detalhe_segmento.sacado_numero_inscricao,
              nome: detalhe_segmento.nome,
              logradouro: detalhe_segmento.logradouro,
              bairro: detalhe_segmento.bairro,
              cep: detalhe_segmento.cep,
              cidade: detalhe_segmento.cidade,
              estado: detalhe_segmento.estado,
              numero_sequencial: Number(numero_sequencial)
          };
          Return.push({ detalhe: detalhe });
      });
      /**
       * Trailler Arquivo
       */
      numero_sequencial++;
      var trailer_arquivo = {
          valor_total: sumBy(dadosGeracao.detalhe_segmento, function (Row) { return Number(Row.valor_titulo); }),
          numero_sequencial: Number(numero_sequencial)
      };
      Return.push({ trailer_arquivo: trailer_arquivo });
      return Return.map(function (Row) { return generateRemessaCnab(Row, 400, bankCode); }).join('\n');
  }

  exports.BANK = BANK;
  exports.generateRemessaCnab = generateRemessaCnab;
  exports.helperGenerateRemessaCNAB240 = helperGenerateRemessaCNAB240;
  exports.helperGenerateRemessaCNAB400 = helperGenerateRemessaCNAB400;
  exports.parseRemessaCnab = parseRemessaCnab;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=nodejs-cnab.umd.js.map
