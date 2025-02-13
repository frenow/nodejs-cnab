"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSegmentData = exports.getLimitSizeDetails = exports.getDetailsMessage = exports.readYaml = exports.formatCurrency = exports.readLine = exports.makeLine = void 0;
var pad = require('pad');
var fs = require('fs');
var yaml = require('js-yaml');
function makeLine(layout, data) {
    var object = {};
    if (layout) {
        var index = 0;
        Object.keys(layout).forEach(function (key) {
            var item = layout[key];
            if (item.pos) {
                var start = item.pos[0] - 1; // yml começa no 1 e array em 0
                var length_1 = item.pos[1] - item.pos[0] + 1;
                if (data) {
                    object[key] = data.substr(start, length_1) || item.default;
                }
            }
            else {
                console.warn('Nao tem posicao pra key', key);
            }
        });
    }
    return object;
}
exports.makeLine = makeLine;
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
exports.readLine = readLine;
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
exports.formatCurrency = formatCurrency;
function readYaml(filename) {
    return yaml.safeLoad(fs.readFileSync(filename, 'utf8'));
}
exports.readYaml = readYaml;
function getDetailsMessage(detailsCodes, eventCodes) {
    /*
      função que retorna as mensagens de rejeição/informação/alerta, referentes a uma cobrança
    */
    var start = 0;
    var messages = [];
    var singleDetailCode, detailMessage = '';
    if (detailsCodes && Number(detailsCodes) !== 0) {
        do {
            singleDetailCode = detailsCodes.substring(start, 2);
            detailMessage = eventCodes[singleDetailCode];
            // casos em que não existem dados
            if (singleDetailCode === '00' || !detailMessage)
                continue;
            messages.push(detailMessage);
            start += 2;
        } while (singleDetailCode === '');
    }
    return messages;
}
exports.getDetailsMessage = getDetailsMessage;
exports.getLimitSizeDetails = function (currentIndex, structure, segmentName) {
    if (currentIndex === void 0) { currentIndex = 0; }
    if (segmentName === void 0) { segmentName = ''; }
    var segmentsSize = segmentName !== '' && structure[segmentName] ? structure[segmentName].length : 0;
    return currentIndex + segmentsSize;
};
exports.getSegmentData = function (params) {
    var segmentData = [];
    var data = params.data, _a = params.segmentValues, segmentValues = _a === void 0 ? [] : _a, _b = params.nodeStartIndex, nodeStartIndex = _b === void 0 ? 0 : _b, _c = params.limitSizeDetails, limitSizeDetails = _c === void 0 ? 0 : _c, _d = params.pathBaseYaml, pathBaseYaml = _d === void 0 ? '' : _d;
    var segmentIndex = 0; // controla os segmentos (header_arquivo, header_lote e etc)
    var dataLimit = data.slice(nodeStartIndex, limitSizeDetails); // pega somente os dados de cada partição (header, details ou trailer)
    dataLimit.forEach(function (segmentLine) {
        segmentIndex = segmentValues[segmentIndex] ? segmentIndex : 0; // itera sobre os segmentos
        var segmentName = segmentValues[segmentIndex]; // pega o nome de um dos segmentos (header_arquivo, header_lote e etc)
        var layout = readYaml(pathBaseYaml + "/" + segmentName + ".yml"); // busca os campos (posição, tamanho, valor padrão (default) e etc)
        segmentData.push({ layout: layout, data: segmentLine }); // adiciona dados convertidos (arquivo => propriedades)
        segmentIndex++; // próximo segmento
    });
    return {
        data: segmentData,
        nextLine: nodeStartIndex + dataLimit.length
    };
};
//# sourceMappingURL=utils.js.map