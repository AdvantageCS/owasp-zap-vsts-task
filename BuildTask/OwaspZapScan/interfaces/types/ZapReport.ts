/* ZAP Report interfaces */
export interface ScanReport {
    OWASPZAPReport: OwaspZapReport;
}

export interface OwaspZapReport {
    site: Array<Site>;
    $: { version: string, generated: string };
}

export interface Site {
    $: {
        name: string,
        host: string,
        port: string,
        ssl: string,
    };
    alerts: Array<Alerts>;
}

export interface Alerts {
    alertitem: Array<AlertItem>;
}

export interface AlertItem {
    pluginid: Array<string>;
    alert: Array<string>;
    name: Array<string>;
    riskcode: Array<string>;
    confidence: Array<string>;
    riskdesc: Array<string>;
    desc: Array<string>;
    instances: Array<InstanceList>;
    count: Array<string>;
    solution: Array<string>;
    reference: Array<string>;
    cweid: Array<string>;
    wascid: Array<string>;
    sourceid: Array<string>;
    otherinfo: Array<string>;
}

export interface InstanceList {
    instance: Array<Instance>;
}

export interface Instance {
    uri: Array<string>;
    method: Array<string>;
    evidence: Array<string>;
    param: Array<string>;
    attack: Array<string>;
}