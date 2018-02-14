import * as Task from 'vsts-task-lib';

import { NewContextResult, IncludeInContextResult } from './../interfaces/types/ContextResult';
import { TaskInput } from './TaskInput';
import { RequestService } from './RequestService';

export class Context {
    private requestService: RequestService;
    private taskInputs: TaskInput;

    constructor(requestService: RequestService, taskInputs: TaskInput) {
        this.requestService = requestService;
        this.taskInputs = taskInputs;
    }
    
    create(contextName: string): Promise<string> {
        const requestOptions = {
            // tslint:disable-next-line:no-http-string
            uri: `http://${this.taskInputs.ZapApiUrl}/JSON/context/action/newContext/`,
            qs: { 
                zapapiformat: 'JSON',
                apikey: this.taskInputs.ZapApiKey,
                formMethod: 'GET',
                contextName: contextName    
            }
        };

        return this.requestService.SendRequestGetResponseAs<NewContextResult>('Create Context', requestOptions)
            .then((result: NewContextResult) => {
                return result.contextId;
            });
    }
    
    includeInContext(contextName: string, pattern: string): Promise<string> {
        const requestOptions = {
            // tslint:disable-next-line:no-http-string
            uri: `http://${this.taskInputs.ZapApiUrl}/JSON/context/action/includeInContext/`,
            qs: { 
                zapapiformat: 'JSON',
                apikey: this.taskInputs.ZapApiKey,
                formMethod: 'GET',
                contextName: contextName,
                regex: pattern
            }
        };

        return this.requestService.SendRequestGetResponseAs<IncludeInContextResult>('Include In Context', requestOptions)
            .then((result: IncludeInContextResult) => {
                if (result.Result !== 'OK') {
                    return Promise.reject(result.Result);
                }
                return Promise.resolve(result.Result);
            });
    }
}
