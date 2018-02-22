/* ZAP Request Interfaces */

export interface ZapRequestOptionsBase {
    formMethod: string;
}

export interface ZapScanOptionsBase extends ZapRequestOptionsBase {
    zapapiformat: string;
}

export interface ZapActiveScanOptions extends ZapScanOptionsBase {    
    url: string;
    recurse?: string;
    inScopeOnly?: string;
    scanPolicyName?: string;
    method?: string;
    postData?: string;
    contextId?: string;
}

export interface ZapSpiderScanOptions extends ZapScanOptionsBase {
    url: string;
    maxChildren?: string;
    recurse?: string;
    contextName?: string;
    subtreeOnly?: string;
}

export interface ZapScanStatus {
    status: number;
}

export interface ZapScanResult {
    scan: number;
}

export interface ViewUrlsResult {
    urls: Array<string>;
}

export interface OpenApiImportResult {
    importUrl: Array<string>;
}
