import * as Request from 'request';
import * as RequestPromise from 'request-promise';
import * as Task from 'vsts-task-lib';
import * as sleep from 'thread-sleep';

import { IZapScan } from './../interfaces/contracts/IZapScan';
import { ScanResult } from './../interfaces/types/ScanResult';
import { ZapSpiderScanOptions, ZapScanResult, ZapSpiderScanStatusOptions, ZapScanStatus } from "../interfaces/types/ZapScan";

export class SpiderScan implements IZapScan {
    public ScanType: string = 'Spider Scan';
    requestOptions: Request.UriOptions & RequestPromise.RequestPromiseOptions;
    scanOptions: ZapSpiderScanOptions;

    constructor(
        public zapApiUrl: string,
        public zapApiKey: string,
        public targetUrl: string,
        public subTreeOnly: boolean, 
        public recurse: boolean, 
        public maxChildrenToCrawl: string,
        public contextName: string
    ) { 
        /* Spider Scan Options */
        this.scanOptions = {
            apikey: zapApiKey,
            url: targetUrl,        
            maxChildren: maxChildrenToCrawl,
            recurse: String(recurse),
            subtreeOnly: String(subTreeOnly),
            contextName: contextName,
            formMethod: 'GET',
            zapapiformat: 'JSON'
        };

        /* Scan Request Options */
        this.requestOptions = {
            uri: `http://${zapApiUrl}/JSON/spider/action/scan/`,
            qs: this.scanOptions
        };
    }

    ExecuteScan(): Promise<ScanResult> {
        let scanResult: ScanResult = { Success: false };

        Task.debug(`${this.ScanType} | Target URL: ${this.requestOptions.uri} | Scan Options: ${JSON.stringify(this.scanOptions)}`);

        return new Promise<ScanResult>((resolve, reject) => {
            RequestPromise(this.requestOptions)
                .then(async (res: any) => {

                    let result: ZapScanResult = JSON.parse(res);
                    console.log(`OWASP ZAP Spider Scan Initiated. ID: ${result.scan}`);

                    scanResult.Success = await this.checkSpiderScanStatus(result.scan);
                    if (!scanResult.Success) {
                        scanResult.Message = 'Spider Scan status check failed.';
                        reject(scanResult);
                    }
                    
                    resolve(scanResult);
                })
                .error((err: any) => {
                    scanResult.Success = false;
                    scanResult.Message = err.message || err;

                    reject(scanResult);
                }); 
        });        
    }

    private checkSpiderScanStatus(scanId: number): Promise<boolean> {
        let previousScanStatus: number = 0;
        let scanCompleted: boolean = false;

        return new Promise<boolean>(async (resolve, reject) => {
            try {
                while (true) {
                    sleep(4000);
                    let scanStatus: number = await this.getSpiderScanStatus(scanId);

                    if (scanStatus < 0) {
                        throw new Error('Failed to get spider scan status.');
                    }

                    if(scanStatus >= 100) {
                        console.log(`Spider Scan In Progress: ${scanStatus}%`);
                        console.log('Spider Scan Complete.');
                        console.log('----------------------------------------');
                        scanCompleted = true;
                        break;
                    }

                    if (previousScanStatus != scanStatus) {
                        console.log(`Spider Scan In Progress: ${scanStatus}%`);
                        scanCompleted = false;
                    }

                    previousScanStatus = scanStatus;
                }

                resolve(scanCompleted);

            } catch (error) {
                reject(scanCompleted);
            }
        });
    }

    private getSpiderScanStatus(scanId: number): Promise<number> {
        let statusOptions: ZapSpiderScanStatusOptions = {
            zapapiformat: 'JSON',
            apikey: this.zapApiKey,
            formMethod: 'GET',
            scanId: scanId
        };

        let requestOptions: Request.UriOptions & RequestPromise.RequestPromiseOptions = {
            uri: `http://${this.zapApiUrl}/JSON/spider/view/status/`,
            qs: statusOptions
        };

        Task.debug(`${this.ScanType} | ZAP API Call: ${this.requestOptions.uri} | Request Options: ${JSON.stringify(statusOptions)}`);

        return new Promise<number>((resolve, reject) => {
            RequestPromise(requestOptions)
                .then((res: any) => {
                    let result: ZapScanStatus = JSON.parse(res);
                    Task.debug(`${this.ScanType} | Status Result: ${JSON.stringify(result)}`);
                    
                    resolve(result.status);
                })
                .error((err: any) => {
                    reject(-1);
                });
        });
    }


}