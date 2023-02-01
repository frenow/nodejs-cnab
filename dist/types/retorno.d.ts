/**
 * ARQUIVO RETORNO
 * @param {*} files
 * @param {*} cnabtype
 * @param {*} bankcode
 */
export declare const parseRemessaCnab: (files: any, cnabtype: number | undefined, bankcode: string | undefined, retorno: {
    split: (arg0: string) => void;
}) => any;
export declare const parseEventMessage: (linesData?: any, cnabtype?: number, bankcode?: string) => any;
