import * as Task from 'vsts-task-lib';

import { RequestService } from './RequestService';
import { IZapScan } from '../interfaces/contracts/IZapScan';
import { SpiderScan } from './SpiderScan';
import { ActiveScan } from './ActiveScan';
import { TaskInput } from './TaskInput';
import { Context } from './Context';
import { ScanPolicy } from './ScanPolicy';

export class UIContext {
    private static readonly scanPolicyFileName: string = 'ui-policy.xml';
    private static readonly scanPolicyName: string = 'UI Policy';

    public static async scanUI(taskInputs: TaskInput, requestService: RequestService): Promise<void> {
        const contextName = 'UI';
        const startUrl = `${taskInputs.TargetUrl}/admin`;
        const context = new Context(taskInputs, requestService, contextName);
        const contextId = await context.create();
        await context.includeInContext(`${taskInputs.TargetUrl}.*`);
        await context.excludeFromContext(`${taskInputs.TargetUrl}/api.*`);
        await context.setWindowsAuthentication('');
        const userId = await context.createStandardUser(taskInputs.WindowsUsername, taskInputs.WindowsPassword);

        // ensure the scan policy is loaded
        const scanPolicy = new ScanPolicy(taskInputs, requestService, this.scanPolicyName);
        await scanPolicy.ensureImported(this.scanPolicyFileName);

        /* Execute Spider Scan if selected */
        if (taskInputs.ExecuteSpiderScan) {
            const scan = new SpiderScan(taskInputs, requestService, startUrl, contextId, contextName, userId);
            await scan.executeScan();
        }
        /* Execute Active Scan if selected */
        if (taskInputs.ExecuteActiveScan) {
            const scan = new ActiveScan(taskInputs, requestService, this.scanPolicyName, contextId, userId);
            await scan.executeScan();
        }
    }
}
