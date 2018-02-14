import { ZapScanBase } from './ZapScanBase';
import { ScanResult } from './../interfaces/types/ScanResult';
import { ZapActiveScanOptions } from './../interfaces/types/ZapScan';
import { ZapScanType } from '../enums/Enums';
import { TaskInput } from './TaskInput';
import { RequestService } from './RequestService';

export class ActiveScan extends ZapScanBase {
    constructor(taskInputs: TaskInput, requestService: RequestService) {
        super(taskInputs, ZapScanType.Active, 'Active Scan', requestService, {
            // tslint:disable-next-line:no-http-string
            uri: `http://${taskInputs.ZapApiUrl}/JSON/ascan/action/scan/`,
            qs: {
                apikey: taskInputs.ZapApiKey,
                url: taskInputs.TargetUrl,
                contextId: taskInputs.ContextId,
                method: taskInputs.Method,
                inScopeOnly: String(taskInputs.InScopeOnly),
                recurse: String(taskInputs.Recurse),
                scanPolicyName: taskInputs.ScanPolicyName,
                postData: taskInputs.PostData,
                zapapiformat: 'JSON',
                formMethod: 'GET'
            }
        });
    }

    ExecuteScan(): Promise<ScanResult> {
        return super.ExecuteScan();
    }
}