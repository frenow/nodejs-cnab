export declare function makeLine(layout: any, data: any): any;
export declare function readLine(layout: any, data: any): {
    line: string;
    object: any;
};
export declare function formatCurrency(value?: number, integer?: number, decimal?: number): string;
export declare function readYaml(filename: string): any;
export declare function getDetailsMessage(detailsCodes: string, eventCodes: any): any[];
export declare const getLimitSizeDetails: (data: any, structure: any, segmentName?: string) => number;
export declare const getSegmentData: (params: any) => {
    data: any[];
    currentPosition: any;
};
