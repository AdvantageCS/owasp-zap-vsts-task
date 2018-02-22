import * as Task from 'vsts-task-lib';
import * as Request from 'request';
import * as RequestPromise from 'request-promise';
// tslint:disable-next-line:no-require-imports
import sleep =  require('thread-sleep');

import { IZapScan } from './../interfaces/contracts/IZapScan';
import { ZapScanResult, ZapScanStatus, ZapActiveScanOptions } from '../interfaces/types/ZapScan';
import { ZapScanType } from './../enums/Enums';
import { TaskInput } from './TaskInput';
import { ZapScanOptionsBase } from './../interfaces/types/ZapScan';
import { RequestService } from './RequestService';

export abstract class ZapScanBase implements IZapScan {
    constructor(protected taskInputs: TaskInput, protected requestService: RequestService, protected scanOptions: any) {}

    protected abstract get component(): string;
    public abstract get scanType(): string;
    public abstract get zapScanType(): ZapScanType;

    public async executeScan(): Promise<void> {
        const scanAction: string = this.scanOptions.userId ? 'scanAsUser' : 'scan';
        const result: ZapScanResult = await this.requestService.executeAction<ZapScanResult>(this.taskInputs, this.component, scanAction, this.scanOptions);
        console.log(`OWASP ZAP ${this.scanType} Initiated. ID: ${result.scan}`);
        const success: boolean = await this.CheckScanStatus(result.scan, this.zapScanType);
        if (!success) {
            throw Error(`${this.scanType} status check failed.`);
        }
    }

    private CheckScanStatus(scanId: number, scanType: ZapScanType): Promise<boolean> {
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

    private GetScanStatus(scanId: number, scanType: ZapScanType): Promise<number> {
        const zapScanType: string = scanType === ZapScanType.Active ? 'ascan' 
            : scanType === ZapScanType.Spider ? 'spider' 
            : scanType === ZapScanType.AjaxSpider ? 'ajaxSpider' : '';
        return this.requestService.getView<ZapScanStatus>(this.taskInputs, zapScanType, 'status', {
            scanId: scanId            
        })
        .then((result: ZapScanStatus) => result.status);
    }
}