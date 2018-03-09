import * as Task from 'vsts-task-lib';
import * as path from 'path';

import { TaskInput } from './TaskInput';
import { RequestService } from './RequestService';
import { StatusCodeError } from 'request-promise/errors';

export class ScanPolicy {
    constructor(private taskInputs: TaskInput, private requestService: RequestService, private policyName: string) {}

    async ensureImported(fileName: string): Promise<void> {
        await this.removeIfExists(this.policyName);
        await this.import(fileName);
    }

    private removeIfExists(scanPolicyName: string): Promise<void> {
        return this.requestService.executeActionCheckResult(this.taskInputs, 'ascan', 'removeScanPolicy', {
            scanPolicyName: scanPolicyName
        }).catch((err: any) => {
            if (err instanceof StatusCodeError) {
                if (JSON.parse(err.error).code === 'does_not_exist') {
                    return Promise.resolve();
                }
            } 
            return Promise.reject(err);
        });
    }

    private import(fileName: string): Promise<void> {
        return this.requestService.executeActionCheckResult(this.taskInputs, 'ascan', 'importScanPolicy', {
            path: path.join(__dirname, '..', 'scan-policies', fileName)
        });
    }
}
