"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseEventMessage = exports.parseRemessaCnab = void 0;
var utils_1 = require("./utils");
var const_1 = require("./const");
/**
 * ARQUIVO RETORNO
 * @param {*} files
 * @param {*} cnabtype
 * @param {*} bankcode
 */
exports.parseRemessaCnab = function (files, cnabtype, bankcode, retorno) {
    if (cnabtype === void 0) { cnabtype = 400; }
    if (bankcode === void 0) { bankcode = '237'; }
    try {
        var yamls_1 = [];
        var retornoLines_1 = retorno.split('\n');
        for (var index = 0; index <= retornoLines_1.length; index++) {
            var _loop_1 = function (key) {
                var value = files[key];
                if (value.indexOf('codigo') === 0) {
                    return "continue";
                }
                if (value.forEach) {
                    value.forEach(function (v) {
                        var layout = utils_1.readYaml(const_1.CNAB_YAML_DIR + ("/cnab" + cnabtype + "/" + bankcode + "/retorno/" + value + ".yml"));
                        yamls_1.push({
                            layout: layout,
                            data: retornoLines_1[index]
                        });
                    });
                }
                else {
                    var layout = utils_1.readYaml(const_1.CNAB_YAML_DIR + ("/cnab" + cnabtype + "/" + bankcode + "/retorno/" + value + ".yml"));
                    yamls_1.push({
                        layout: layout,
                        data: retornoLines_1[index]
                    });
                }
            };
            //let index = 0
            for (var key in files) {
                _loop_1(key);
            }
        }
        var infos = yamls_1.map(function (i, index) {
            var line = utils_1.makeLine(i.layout, i.data);
            return line;
        });
        return infos;
    }
    catch (e) {
        console.error("parseRemessaCnab: ", e);
    }
};
exports.parseEventMessage = function (linesData, cnabtype, bankcode) {
    if (linesData === void 0) { linesData = []; }
    if (cnabtype === void 0) { cnabtype = 240; }
    if (bankcode === void 0) { bankcode = '237'; }
    try {
        /*
          40a => 03 => Entrada Rejeitada | 26 => Instrução Rejeitada | 30 => Alteração de Dados Rejeitada
          40c => 06 => Liquidação        | 09 => Baixa               | 17 => Liquidação após Baixa ou Liquidação de Boleto não Registrado |
                 93 => Baixa Operacional | 94 => Cancelamento de Baixa Operacional
        */
        var type40a_1 = ['03', '26', '30'];
        var type40c_1 = ['06', '09', '17', '93', '94'];
        if (!linesData || linesData.length === 0)
            return [];
        var eventCodes_1 = utils_1.readYaml(const_1.CNAB_YAML_DIR + ("/cnab" + cnabtype + "/" + bankcode + "/retorno/ocorrencias.yml"));
        return linesData.map(function (line) {
            var message = {};
            var messageDetails = [];
            var detailCodes, eventCodesTable = '';
            var code = line.codigo_ocorrencia;
            if (code) {
                // define mensagem principal
                message.descricao = eventCodes_1.movimento[code];
                // códigos que descrevem melhor a ocorrência (40a e 40c - Nota 40)
                detailCodes = line.identificacao_rejeicao;
                if (type40a_1.includes(code)) {
                    // rejeições
                    eventCodesTable = eventCodes_1.rejeicao;
                }
                else if (type40c_1.includes(code)) {
                    // liquidações/baixas
                    if (code === '06')
                        // Liquidação
                        eventCodesTable = eventCodes_1.liquidacao;
                    else
                        eventCodesTable = eventCodes_1.baixa;
                }
                // retorna as mensagens de rejeição/informação/alerta, baseado na ocorrência
                messageDetails = utils_1.getDetailsMessage(detailCodes, eventCodesTable);
                if (messageDetails.length > 0) {
                    message.details = messageDetails;
                }
                return __assign(__assign({}, line), { mensagens_ocorrencia: __assign({}, message) });
            }
        });
    }
    catch (e) {
        console.error("parseEventMessage: ", e);
    }
};
//# sourceMappingURL=retorno.js.map