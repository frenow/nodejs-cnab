"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var const_1 = require("./const");
/**
 * ARQUIVO REMESSA
 * @param {*} files
 * @param {*} cnabtype
 * @param {*} bankcode
 */
exports.generateRemessaCnab = function (files, cnabtype, bankcode) {
    if (cnabtype === void 0) { cnabtype = 400; }
    if (bankcode === void 0) { bankcode = '237'; }
    try {
        var yamls_1 = [];
        var _loop_1 = function (key) {
            var value = files[key];
            if (value.forEach) {
                value.forEach(function (v) {
                    var layout = utils_1.readYaml(const_1.CNAB_YAML_DIR + ("/cnab" + cnabtype + "/" + bankcode + "/remessa/" + key + ".yml"));
                    yamls_1.push({
                        layout: layout,
                        data: v
                    });
                });
            }
            else {
                var layout = utils_1.readYaml(const_1.CNAB_YAML_DIR + ("/cnab" + cnabtype + "/" + bankcode + "/remessa/" + key + ".yml"));
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
            return utils_1.readLine(i.layout, i.data);
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
//# sourceMappingURL=remessa.js.map