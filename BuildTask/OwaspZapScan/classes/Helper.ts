import { Parser } from 'xml2js';
import * as Task from 'vsts-task-lib';

import { AlertResult } from './../interfaces/types/AlertResult';
import { AlertItem, ScanReport, Site } from './../interfaces/types/ZapReport';
import { Constants } from './Constants';

export class Helper {
    private parser: Parser = new Parser({
        normalize: true,
        mergeAttrs: false
    });

    constructor () {}

    processAlerts(xmlResult: string, targetUrl: string): AlertResult {
        // default result
        let alertResult: AlertResult = {
            HighAlerts: 0,
            MediumAlerts: 0,
            LowAlerts: 0,
            InformationalAlerts: 0,
            Alerts: new Array<AlertItem>()
        };

        this.parser.parseString(xmlResult, (err: any, res: any) => {
            if (err) {
                throw err;
            }

            const reportJson: ScanReport = res;
            const sites: Site[] = reportJson.OWASPZAPReport.site;
            Task.debug(`Scan report: ${JSON.stringify(sites)}`);

            for (const site of sites) {
                if (targetUrl.startsWith(site.$.name)) {
                    alertResult = this.processSiteAlerts(site.alerts[0].alertitem);
                }
            }
        });

        return alertResult;
    }

    private processSiteAlerts(alerts: AlertItem[]): AlertResult {
        const alertResult: AlertResult = {
            HighAlerts: 0,
            MediumAlerts: 0,
            LowAlerts: 0,
            InformationalAlerts: 0,
            Alerts: new Array<AlertItem>()
        };

        const high: Array<AlertItem> = new Array<AlertItem>();
        const mid: Array<AlertItem> = new Array<AlertItem>();
        const low: Array<AlertItem> = new Array<AlertItem>();
        const info: Array<AlertItem> = new Array<AlertItem>();

        for (const alert of alerts) {
            Task.debug(`Scan report alert: ${JSON.stringify(alert)}`);
            if (alert.riskcode[0] === Constants.HIGH_RISK) {
                high.push(alert);
                alertResult.HighAlerts++;
            }
            if (alert.riskcode[0] === Constants.MEDIUM_RISK) {
                mid.push(alert);
                alertResult.MediumAlerts++;
            }
            if (alert.riskcode[0] === Constants.LOW_RISK) {
                low.push(alert);
                alertResult.LowAlerts++;
            }
            if (alert.riskcode[0] === Constants.INFO_RISK) {
                info.push(alert);
                alertResult.InformationalAlerts++;
            }
        }

        alertResult.Alerts = high.concat(mid).concat(low).concat(info);
        return alertResult;
    }
}