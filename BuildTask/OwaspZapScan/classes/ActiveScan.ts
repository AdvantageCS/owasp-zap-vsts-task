import { ZapScanBase } from './ZapScanBase';
import { ZapScanType } from '../enums/Enums';
import { TaskInput } from './TaskInput';
import { RequestService } from './RequestService';

export class ActiveScan extends ZapScanBase {
    constructor(taskInputs: TaskInput, requestService: RequestService, scanPolicyName: string, contextId?: string, userId?: string) {
        super(taskInputs, requestService, {
            scanPolicyName: scanPolicyName,
            userId: userId,
            contextId: contextId
        });
    }

    protected get component(): string {
        return 'ascan';
    }

    public get scanType(): string {
        return 'Active Scan';
    }

    public get zapScanType(): ZapScanType {
        return ZapScanType.Active;
    }
}