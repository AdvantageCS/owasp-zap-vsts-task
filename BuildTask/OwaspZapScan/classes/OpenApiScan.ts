import * as Task from 'vsts-task-lib';

import { OpenApiImportResult } from '../interfaces/types/ZapScan';
import { TaskInput } from './TaskInput';
import { RequestService } from './RequestService';

export class OpenApiScan {
    constructor(private taskInputs: TaskInput, private requestService: RequestService) {}
       
    import(url: string): Promise<void> {
        return this.requestService.executeAction<OpenApiImportResult>(this.taskInputs, 'openapi', 'importUrl', {
            url: url
        }).then((result: OpenApiImportResult) => {
            if (result.importUrl) {
                result.importUrl.forEach((element: string) => {
                    Task.debug(`Open API import warning: ${element}`);                
                });    
            }
        });
    }
}
