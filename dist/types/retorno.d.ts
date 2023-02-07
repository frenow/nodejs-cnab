/**
 * ARQUIVO RETORNO
 * @param {*} fileStructure
 * @param {*} cnabtype
 * @param {*} bankcode
 */
export declare const parseRemessaCnab: (fileStructure: any, cnabtype: number | undefined, bankcode: string | undefined, returnFile: {
    split: (arg0: string) => void;
}) => any[] | undefined;
export declare const parseEventMessage: (linesData?: any, cnabtype?: number, bankcode?: string) => any;
