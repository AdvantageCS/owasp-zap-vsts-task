import * as Task from 'vsts-task-lib';
import * as Request from 'request';
import * as RequestPromise from 'request-promise';
// tslint:disable-next-line:no-require-imports
import sleep =  require('thread-sleep');

import { IZapScan } from './../interfaces/contracts/IZapScan';
import { ScanResult } from '../interfaces/types/ScanResult';
import { ZapScanResult, ZapScanStatus, ZapActiveScanOptions, ZapScanStatusOptions } from '../interfaces/types/ZapScan';
import { ZapScanType } from './../enums/Enums';
import { TaskInput } from './TaskInput';
import { ZapScanOptionsBase } from './../interfaces/types/ZapScan';
import { RequestService } from './RequestService';

export abstract class ZapScanBase implements IZapScan {
    zapScanType: ZapScanType;
    scanType: string;    
    requestOptions: Request.UriOptions & RequestPromise.RequestPromiseOptions;
    protected taskInputs: TaskInput;
    private requestService: RequestService;

    constructor(taskInputs: TaskInput, zapScanType: ZapScanType, scanType: string, requestService: RequestService, requestOptions: Request.UriOptions & RequestPromise.RequestPromiseOptions) {
        this.taskInputs = taskInputs;
        this.zapScanType = zapScanType;
        this.scanType = scanType;
        this.requestOptions = requestOptions;
        this.requestService = requestService;
    }

    ExecuteScan(): Promise<ScanResult> {
        const scanResult: ScanResult = { Success: false };
        return this.requestService.SendRequestGetResponseAs<ZapScanResult>(this.scanType, this.requestOptions)
            .then(async (result: ZapScanResult) => {
                console.log(`OWASP ZAP ${this.scanType} Initiated. ID: ${result.scan}`);
                scanResult.Success = await this.CheckScanStatus(result.scan, this.zapScanType);
                if (!scanResult.Success) {
                    scanResult.Message = `${this.scanType} status check failed.`;
                    return Promise.reject(scanResult);
                }                    
                return Promise.resolve(scanResult);
            })
            .catch((err: any) => {
                scanResult.Success = false;
                scanResult.Message = err.message || err;
                return Promise.reject(scanResult);
            }); 
    }

    protected CheckScanStatus(scanId: number, scanType: ZapScanType): Promise<boolean> {
        let previousScanStatus: number = 0;
        let scanCompleted: boolean = false;

        return new Promise<boolean>(async (resolve, reject) => {
            try {
                // tslint:disable-next-line:no-constant-condition
                while (true) {
                    sleep(10000);
                    const scanStatus: number = await this.GetScanStatus(scanId, scanType);

                    if (scanStatus < 0) {
                        throw new Error(`Failed to get ${this.scanType} status.`);
                    }

                    if (scanStatus >= 100) {
                        console.log(`${this.scanType} In Progress: ${scanStatus}%`);
                        console.log(`${this.scanType} Complete.`);
                        console.log('---------------------------------------');
                        scanCompleted = true;
                        break;
                    }

                    if (previousScanStatus !== scanStatus) {
                        console.log(`${this.scanType} In Progress: ${scanStatus}%`);
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

    protected GetScanStatus(scanId: number, scanType: ZapScanType): Promise<number> {
        let zapScanType: string = '';
        const statusOptions: ZapScanStatusOptions = {
            zapapiformat: 'JSON',
            apikey: this.taskInputs.ZapApiKey,
            formMethod: 'GET',
            scanId: scanId
        };
        
        if (scanType === ZapScanType.Active) { zapScanType = 'ascan'; }
        else if (scanType === ZapScanType.Spider) { zapScanType = 'spider'; }
        else if (scanType === ZapScanType.AjaxSpider) { zapScanType = 'ajaxSpider'; }

        const requestOptions: Request.UriOptions & RequestPromise.RequestPromiseOptions = {
            // tslint:disable-next-line:no-http-string
            uri: `http://${this.taskInputs.ZapApiUrl}/JSON/${zapScanType}/view/status/`,
            qs: statusOptions
        };

        return this.requestService.SendRequestGetResponseAs<ZapScanStatus>('Get Scan Status', requestOptions)
            .then((result: ZapScanStatus) => {
                return result.status;
            });
    }
}