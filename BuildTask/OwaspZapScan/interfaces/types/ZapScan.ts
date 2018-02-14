/* ZAP Request Interfaces */

export interface ZapRequestOptionsBase {
    formMethod: string;
    apikey: string;
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

export interface ZapScanStatusOptions extends ZapScanOptionsBase {
    scanId: number;
}

export interface ZapNewContextOptions extends ZapRequestOptionsBase {
    zapapiformat: string;
    contextName: number;
}

export interface ZapScanStatus {
    status: number;
}

export interface ZapScanResult {
    scan: number;
}
