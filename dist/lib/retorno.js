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
 * @param {*} fileStructure
 * @param {*} cnabtype
 * @param {*} bankcode
 */
exports.parseRemessaCnab = function (fileStructure, cnabtype, bankcode, returnFile) {
    if (cnabtype === void 0) { cnabtype = 400; }
    if (bankcode === void 0) { bankcode = '237'; }
    try {
        var yamls = [];
        var pathBaseYaml = const_1.CNAB_YAML_DIR + "/cnab" + cnabtype + "/" + bankcode + "/retorno";
        var nodeStartIndex = 0; // guarda início do próximo segmento
        var nextNode = '';
        var limitSizeDetails = 0;
        var returnLines = returnFile.split('\n');
        for (var key in fileStructure) {
            var segmentInfo = fileStructure[key];
            /* CASO NÃO HAJA MAIS LINHAS (DADOS) */
            if (!returnLines[nodeStartIndex]) {
                break;
            }
            /*
              VERIFICA O LIMITE DE LINHAS ATÉ O PRÓXIMO SEGMENTO
              (HEADER, DETAILS OU TRAILERS)
            */
            switch (key) {
                case 'headers':
                    limitSizeDetails = segmentInfo.quantity || 0;
                    break;
                case 'details':
                    nextNode = 'trailers';
                    limitSizeDetails = returnLines.length - 1 - fileStructure[nextNode].quantity;
                    break;
                default:
                    /* TRAILERS */
                    limitSizeDetails = returnLines.length - 1;
                    break;
            }
            var segmentValues = fileStructure[key].name; // segmentos (headers, details ou trailers)
            if (!segmentValues) {
                nodeStartIndex += limitSizeDetails;
            }
            else {
                var segmentData = utils_1.getSegmentData({
                    data: returnLines,
                    segmentValues: segmentValues,
                    nodeStartIndex: nodeStartIndex,
                    limitSizeDetails: limitSizeDetails,
                    pathBaseYaml: pathBaseYaml
                });
                yamls.push.apply(yamls, segmentData.data); // adiciona novo conjunto de dados
                nodeStartIndex = segmentData.nextLine; // próxima linha
            }
        }
        var fileData = yamls.map(function (currentLine) {
            var line = utils_1.makeLine(currentLine.layout, currentLine.data);
            return line;
        });
        return fileData;
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
        var eventCodes_1 = utils_1.readYaml(const_1.CNAB_YAML_DIR + ("/ocorrencias/cnab" + cnabtype + "/" + bankcode + ".ocorrencias.yml"));
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