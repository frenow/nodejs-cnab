"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        console.log(retornoLines_1);
        var index_1 = 0;
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
                        data: retornoLines_1[index_1]
                    });
                });
            }
            else {
                var layout = utils_1.readYaml(const_1.CNAB_YAML_DIR + ("/cnab" + cnabtype + "/" + bankcode + "/retorno/" + value + ".yml"));
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
            var line = utils_1.makeLine(i.layout, i.data);
            return line;
        });
        return infos;
    }
    catch (e) {
        console.error("parseRemessaCnab: ", e);
    }
};
//# sourceMappingURL=retorno.js.map