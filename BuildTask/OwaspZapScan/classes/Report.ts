import * as fs from 'fs';
import * as path from 'path';
import * as Task from 'vsts-task-lib';
import * as Request from 'request';
import * as RequestPromise from 'request-promise';

import { AlertItem } from './../interfaces/types/ZapReport';
import { AlertRowType, ReportType } from './../enums/Enums';
import { Constants } from './Constants';
import { Helper } from './../classes/Helper';
import { AlertResult } from './../interfaces/types/AlertResult';
import { ZapRequestOptionsBase } from './../interfaces/types/ZapScan';
import { TaskInput } from './TaskInput';
import { RequestService } from './RequestService';

export class Report {
    private _reportOptions: ZapRequestOptionsBase;
    private _helper: Helper;    
    private _requestService: RequestService;
    private _taskInputs: TaskInput;

    constructor(helper: Helper, requestService: RequestService, taskInputs: TaskInput) {
        this._helper = helper;
        this._requestService = requestService;
        this._taskInputs = taskInputs;

        /* Report Options */
        this._reportOptions = {
            formMethod: 'GET'
        };
    }

    generateReportOfType(type: ReportType): Promise<string> {
        let reportType: string = 'xmlreport';

        /* Set report type */
        if (type === ReportType.XML) { reportType = Constants.XML_REPORT; }
        if (type === ReportType.HTML) { reportType = Constants.HTML_REPORT; } 
        if (type === ReportType.MD) { reportType = Constants.MD_REPORT; }

        return this._requestService.sendRequestGetResponseAsString(`OTHER/core/other/${reportType}/`, this._reportOptions);
    }

    async GenerateReport(): Promise<boolean> {
        Task.debug('Generating report...');

        let type: ReportType;
        let ext: string;
        let scanReport: string;

        const fileName = this._taskInputs.ReportFileName === '' ? 'OWASP-ZAP-Report' :  this._taskInputs.ReportFileName;
        const destination = this._taskInputs.ReportFileDestination === '' ? './' : this._taskInputs.ReportFileDestination;

        if (this._taskInputs.ReportType === Constants.XML) {
            type = ReportType.XML;
            ext = Constants.XML;
        } else if (this._taskInputs.ReportType === Constants.MARKDOWN) {
            type = ReportType.MD;
            ext = Constants.MARKDOWN;
        } else {
            type = ReportType.HTML;
            ext = Constants.HTML;
        }
        
        const fullFilePath: string = path.normalize(`${destination}/${fileName}.${ext}`);
        
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'test') { 
            Task.debug(`Report Filename: ${fullFilePath}`);
        }       

        if (type === ReportType.HTML) {
            /* Get the Scan Result */
            const xmlResult: string = await this.generateReportOfType(ReportType.XML);
            /* Sort and Count the Alerts */
            const processedAlerts: AlertResult = this._helper.processAlerts(xmlResult, this._taskInputs.TargetUrl);
            /* Generate the Custom HTML Report */
            scanReport = this.createCustomHtmlReport(processedAlerts);

        } else {
            scanReport = await this.generateReportOfType(type);
        }        
        
        /* Write the File */
        return new Promise<boolean>((resolve, reject) => {
            fs.writeFile(fullFilePath, scanReport, (err: any) => {
                if (err) {
                    Task.error('Failed to generate the HTML report');
                    reject(false);
                }
                resolve(true);
            });
        });    
    }

    printResult(highAlerts: number, mediumAlerts: number, lowAlerts: number, infoAlerts: number): void {
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'test') { 
            console.log();
            console.log('**************************');
            console.log('*   Active Scan Result   *');
            console.log('**************************');
            console.log();
            console.log('--------------------------');
            console.log('| Alert Type   | Count   |');
            console.log('--------------------------');
            console.log(`  High Risk    | ${highAlerts}`);
            console.log(`  Medium Risk  | ${mediumAlerts}`);
            console.log(`  Low Risk     | ${lowAlerts}`);
            console.log(`  Info Risk    | ${infoAlerts}`);
            console.log('__________________________');
        }        
    }

    private createCustomHtmlReport(alertResult: AlertResult): string {
        let alertHtmlTables: string = '';

        for (const alert of alertResult.Alerts) {
            alertHtmlTables += `
                ${this.createAlertTable(alert)}

            `;
        }

        const htmlLayout: string = `
            <html>
            <head>
                <META http-equiv="Content-Type" content="text/html; charset=UTF-8">
                <title>ZAP Scanning Report</title>
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ" crossorigin="anonymous" />
                <script src="https://code.jquery.com/jquery-3.2.1.min.js" integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" crossorigin="anonymous"></script>
                <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/js/bootstrap.min.js" integrity="sha384-vBWWzlZJ8ea9aCX4pEW3rVHjgjt7zpkNpZk+02D9phzyeVkE+jo0ieGizqPLForn" crossorigin="anonymous"></script>
                <style>
                    p {
                        margin-bottom: 0;
                    }

                    .legend {
                        font-size: 1.0em; 
                        color: #fff
                    }
                    
                    .legend a, .alert-header-link {
                        text-decoration: none;
                        color: #fff;
                    }
            
                    .legend a:hover, .alert-header-link:hover {
                        color: #222222;
                        text-decoration: none;
                    }
            
                    .attribute {
                        font-weight: bold;
                        font-size: 1.3em;
                    }
            
                    .alert-header {
                        font-size: 1.4em;
                        font-weight: 100;
                        color: #fff;
                    }

                    .bg-low {
                        background-color: #d8c226!important;
                    }
                </style>
            </head>
            
            <body class="container-fluid" style="padding: 0 3em">
                <div style="padding: 32px 0;">
                    <h1 class="display-3">ZAP Scanning Report</h1>
                    <p class="lead" >Project : <em>${this._taskInputs.BuildDefinitionName || ''}</em></p>
                    <p class="lead" >Completed on : <em>${new Date().toUTCString()}</em></p>
                    <hr class="my-4">
                </div>
                <div class="row">
                    <div class="col-md-3">
                        <h2>Summary of Alerts</h2>
                        <hr>
                        <table class="table">
                            <thead class="thead-inverse">
                                <tr>
                                    <th>Risk Level</th>
                                    <th>Number of Alerts</th>
                                </tr>
                            </thead>
                            <tr class="bg-danger legend">
                                <td><a href="#3">High</a></td>
                                <td>${alertResult.HighAlerts}</td>
                            </tr>
                            <tr class="bg-warning legend">
                                <td><a href="#2">Medium</a></td>
                                <td>${alertResult.MediumAlerts}</td>
                            </tr>
                            <tr class="bg-low legend">
                                <td><a href="#1">Low</a></td>
                                <td>${alertResult.LowAlerts}</td>
                            </tr>
                            <tr class="bg-success legend">
                                <td><a href="#0">Informational</a></td>
                                <td>${alertResult.InformationalAlerts}</td>
                            </tr>
                        </table>
                    </div>
                </div>
                <br><br>
                <div class="row">
                    <div class="col-md-12">
                        <h2>Alert Detail</h2>
                        <p class="lead">Click on the risk type header to expand the details panel for the risk</p>
                        <hr>                
                        ${alertHtmlTables}
                    </div>
                </div>
            </body>
            </html>            
        `;

        return htmlLayout;
    }

    private createAlertTable(alert: AlertItem): string {
        console.log(alert);
        let cssClass: string = 'bg-success';
        // tslint:disable-next-line:insecure-random
        const collapseId: string = String(Math.floor(Math.random() * 10000));
        let tableRows: string = '';
        let instanceRows: string = '';

        switch (alert.riskcode[0]) {
            case Constants.HIGH_RISK:
                cssClass = 'bg-danger';
                break;
            case Constants.MEDIUM_RISK:
                cssClass = 'bg-warning';
                break;
            case Constants.LOW_RISK:
                cssClass = 'bg-low';
                break;        
            case Constants.INFO_RISK:
                cssClass = 'bg-success';
                break;
        }

        for (const instance of alert.instances[0].instance) {
            instanceRows += `
                ${instance.uri !== undefined ? this.createAlertRow('URL', instance.uri[0], AlertRowType.InstanceRow) : ''}
                ${instance.method !== undefined ? this.createAlertRow('&nbsp;&nbsp;&nbsp;&nbsp;Method', instance.method[0], AlertRowType.InstanceRow) : ''}
                ${instance.evidence !== undefined ? this.createAlertRow('&nbsp;&nbsp;&nbsp;&nbsp;Evidence', instance.evidence[0], AlertRowType.InstanceRow) : ''}
                ${instance.param !== undefined ? this.createAlertRow('&nbsp;&nbsp;&nbsp;&nbsp;Parameters', instance.param[0], AlertRowType.InstanceRow) : ''}
                ${instance.attack !== undefined ? this.createAlertRow('&nbsp;&nbsp;&nbsp;&nbsp;Attack', instance.attack[0], AlertRowType.InstanceRow) : ''}
            `; 
        }

        tableRows = `
            ${this.createAlertRow('Description', alert.desc[0])}
            ${instanceRows}
            ${this.createAlertRow('Instances', alert.count[0])}
            ${this.createAlertRow('Solution', alert.solution[0])}
            ${this.createAlertRow('Confidence', alert.confidence[0])}
            ${this.createAlertRow('Reference', alert.reference[0])}
            ${this.createAlertRow('CWE ID', alert.cweid[0])}
            ${this.createAlertRow('WASC ID', alert.wascid[0])}
            ${this.createAlertRow('Source ID', alert.sourceid[0])}
        `;

        const htmlString: string = `
        <table class="table">
            <tr class="${cssClass}" height="24">
                <td width="20%"><p class="alert-header"><a name="${alert.riskcode[0]}" class="alert-header-link" data-toggle="collapse" href="#collapseBlock${collapseId}" aria-expanded="false" aria-controls="collapseExample" >${alert.riskdesc}</a></p></td>
                <td width="80%"><p class="alert-header">${alert.name[0]}</p></td>
            </tr>
            <tbody class="collapse" id="collapseBlock${collapseId}">
                ${tableRows}
            </tbody>
        </table>
        `;

        return htmlString;
    }

    private createAlertRow(header: string, value: string, rowType: AlertRowType = AlertRowType.AlertRow): string {
        let cssClass: string = 'attribute';

        if (rowType === AlertRowType.InstanceRow) {
            cssClass = 'font-italic';
        }

        const htmlString: string = `
        <tr>
            <td width="20%">
                <p class="lead ${cssClass}" style="font-size: 1.1em;">${header}</p>
            </td>
            <td width="80%">
                <p class="lead">${value}</p>
            </td>
        </tr>
        `;
        return htmlString;
    }
}
