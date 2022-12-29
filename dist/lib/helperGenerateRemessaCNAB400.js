"use strict";
// tslint:disable:variable-name
Object.defineProperty(exports, "__esModule", { value: true });
var remessa_1 = require("./remessa");
var _a = require('brazilian-values'), isCNPJ = _a.isCNPJ, isCPF = _a.isCPF;
var dayjs = require('dayjs');
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
        data_geracao: dayjs(dadosGeracao.data_geracao).format('DDMMYYYY'),
        numero_sequencial: Number(numero_sequencial)
    };
    Return.push({ header_arquivo: header_arquivo });
    /**
     * Detalhe Segmento
     */
    dadosGeracao.detalhe_segmento.forEach(function (detalhe_segmento) {
        numero_sequencial++;
        var sacado_codigo_inscricao = 99;
        if (isCPF(detalhe_segmento.sacado_numero_inscricao))
            sacado_codigo_inscricao = 1;
        if (isCNPJ(detalhe_segmento.sacado_numero_inscricao))
            sacado_codigo_inscricao = 2;
        var detalhe = {
            codigo_inscricao: isCNPJ(dadosGeracao.numero_inscricao) ? 2 : 1,
            numero_inscricao: dadosGeracao.numero_inscricao,
            codigo_convenio: dadosGeracao.codigo_convenio,
            uso_empresa: detalhe_segmento.uso_empresa,
            mensagem: detalhe_segmento.mensagem,
            numero_documento: detalhe_segmento.numero_documento,
            vencimento: dayjs(detalhe_segmento.vencimento).format('DDMMYYYY'),
            valor_titulo: detalhe_segmento.valor_titulo,
            data_emissao: dayjs(detalhe_segmento.data_emissao).format('DDMMYYYY'),
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
    return Return.map(function (Row) { return remessa_1.generateRemessaCnab(Row, 400, bankCode); }).join('\n');
}
exports.helperGenerateRemessaCNAB400 = helperGenerateRemessaCNAB400;
//# sourceMappingURL=helperGenerateRemessaCNAB400.js.map