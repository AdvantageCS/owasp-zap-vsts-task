import * as Task from 'vsts-task-lib';

import { RequestService } from './RequestService';
import { IZapScan } from '../interfaces/contracts/IZapScan';
import { SpiderScan } from './SpiderScan';
import { ActiveScan } from './ActiveScan';
import { TaskInput } from './TaskInput';
import { Context } from './Context';

export class UIContext {
    public static async scanUI(taskInputs: TaskInput, requestService: RequestService): Promise<void> {
        const contextName = 'UI';
        const startUrl = `${taskInputs.TargetUrl}/admin`;
        const context = new Context(taskInputs, requestService, contextName);
        const contextId = await context.create();
        await context.includeInContext(`${startUrl}.*`);
        await context.includeInContext(`${taskInputs.TargetUrl}/api/docs.*`);
        await context.includeInContext(`${taskInputs.TargetUrl}/schemas.*`);
        await context.setWindowsAuthentication('');
        const userId = await context.createStandardUser(taskInputs.WindowsUsername, taskInputs.WindowsPassword);

        /* Execute Spider Scan if selected */
        if (taskInputs.ExecuteSpiderScan) {
            const scan = new SpiderScan(taskInputs, requestService, startUrl, contextId, contextName, userId);
            await scan.executeScan();
        }
        /* Execute Active Scan if selected */
        if (taskInputs.ExecuteActiveScan) {
            const scan = new ActiveScan(taskInputs, requestService, startUrl, contextId, userId);
            await scan.executeScan();
        }
    }
}
