import * as Task from 'vsts-task-lib';

import { ZapScanBase } from './ZapScanBase';
import { ViewUrlsResult } from '../interfaces/types/ZapScan';
import { ZapScanType } from '../enums/Enums';
import { TaskInput } from './TaskInput';
import { RequestService } from './RequestService';

export class SpiderScan extends ZapScanBase {
    constructor(taskInputs: TaskInput, requestService: RequestService, url: string, contextId: string, contextName: string, userId: string, private expectedUrls: number) {
        super(taskInputs, requestService, {
            url: url,
            maxChildren: taskInputs.MaxChildrenToCrawl
        });
        
        if (userId) {
            this.scanOptions.userId = userId;
            this.scanOptions.contextId = contextId;
        }
        else {
            this.scanOptions.contextName = contextName;
        }
    }

    public async executeScan(): Promise<void> {
        await super.executeScan();
        const result: ViewUrlsResult = await this.requestService.getView<ViewUrlsResult>(this.taskInputs, 'core', 'urls', {});
        for (const url of result.urls) {
            Task.debug(`Found URL: ${url}`);
        }
        if (result.urls.length < this.expectedUrls) {
            Task.setResult(Task.TaskResult.Failed, `Passive scan located ${result.urls.length} pages; expected at least ${this.expectedUrls}.`);            
        }
    }

    protected get component(): string {
        return 'spider';
    }

    public get scanType(): string {
        return 'Spider Scan';
    }

    public get zapScanType(): ZapScanType {
        return ZapScanType.Spider;
    }
}