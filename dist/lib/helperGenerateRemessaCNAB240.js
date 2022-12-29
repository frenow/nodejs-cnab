"use strict";
// tslint:disable:variable-name
Object.defineProperty(exports, "__esModule", { value: true });
var remessa_1 = require("./remessa");
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
    return Return.map(function (Row) { return remessa_1.generateRemessaCnab(Row, 240, bankCode); }).join('\n');
}
exports.helperGenerateRemessaCNAB240 = helperGenerateRemessaCNAB240;
//# sourceMappingURL=helperGenerateRemessaCNAB240.js.map