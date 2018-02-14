import { ZapScanBase } from './ZapScanBase';
import { ScanResult } from './../interfaces/types/ScanResult';
import { ZapSpiderScanOptions } from '../interfaces/types/ZapScan';
import { ZapScanType } from '../enums/Enums';
import { TaskInput } from './TaskInput';
import { RequestService } from './RequestService';

export class SpiderScan extends ZapScanBase {
    constructor(taskInputs: TaskInput, requestService: RequestService) {
        /* Spider Scan Options */
        const scanOptions = {
            apikey: taskInputs.ZapApiKey,
            url: taskInputs.TargetUrl,        
            maxChildren: taskInputs.MaxChildrenToCrawl,
            recurse: String(taskInputs.RecurseSpider),
            subtreeOnly: String(taskInputs.SubTreeOnly),
            contextName: taskInputs.ContextName,
            formMethod: 'GET',
            zapapiformat: 'JSON'
        };

        super(taskInputs, ZapScanType.Spider, 'Spider Scan', requestService, {
            // tslint:disable-next-line:no-http-string
            uri: `http://${taskInputs.ZapApiUrl}/JSON/spider/action/scan/`,
            qs: scanOptions
        });
    }
    
    ExecuteScan(): Promise<ScanResult> {
        return super.ExecuteScan();
    }
}