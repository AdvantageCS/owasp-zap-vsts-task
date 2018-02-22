import * as Task from 'vsts-task-lib';
import * as path from 'path';

import { TaskInput } from './TaskInput';
import { RequestService } from './RequestService';

export class Scripts {
    constructor(private taskInputs: TaskInput, private requestService: RequestService, private scriptName: string) {}
       
    remove(): Promise<void> {
        return this.requestService.executeActionCheckResult(this.taskInputs, 'script', 'remove', {
            scriptName: this.scriptName
        });
    }

    load(scriptType: string, fileName: string, scriptEngine: string = 'ECMAScript : Oracle Nashorn', shortDescription?: string): Promise<void> {
        return this.requestService.executeActionCheckResult(this.taskInputs, 'script', 'load', {
            scriptName: this.scriptName,
            scriptType: scriptType,
            scriptEngine: scriptEngine,
            fileName: path.join(__dirname, '..', 'zap-scripts', fileName),
            shortDescription: shortDescription
        });
    }

    enable(): Promise<void> {
        return this.requestService.executeActionCheckResult(this.taskInputs, 'script', 'enable', {
            scriptName: this.scriptName
        });
    }
}
