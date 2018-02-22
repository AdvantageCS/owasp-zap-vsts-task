import * as Request from 'request';
import * as RequestPromise from 'request-promise';
import * as Task from 'vsts-task-lib';
import { TaskInput } from './TaskInput';
import { SimpleResult } from '../interfaces/types/ContextResult';

export class RequestService {
    constructor(private zapHost: string, private zapPort: number) { }

    executeAction<T>(taskInputs: TaskInput, component: string, action: string, params: any): Promise<T> {
        return this.sendZapRequest<T>(taskInputs, `${component}/action/${action}`, params)
            .then(async (response: T) => {
                Task.debug(`ZAP API Response: ${JSON.stringify(response)}`);
                return response;
            });
        }

    getView<T>(taskInputs: TaskInput, component: string, view: string, params: any): Promise<T> {
        return this.sendZapRequest<T>(taskInputs, `${component}/view/${view}`, params);
    }

    executeActionCheckResult(taskInputs: TaskInput, component: string, action: string, params: any): Promise<void> {
        return this.executeAction<SimpleResult>(taskInputs, component, action, params)
            .then((result: SimpleResult) => result.Result === 'OK' ? Promise.resolve() : Promise.reject(result.Result));
    }

    sendRequestGetResponseAsString(relativeUri: string, params: any): Promise<string> {
        const requestOptions: Request.UriOptions & RequestPromise.RequestPromiseOptions = {
            // tslint:disable-next-line:no-http-string
            uri: `http://${this.zapHost}:${this.zapPort}/${relativeUri}/`,
            qs: params
        };

        Task.debug(`ZAP API Call: ${requestOptions.uri} | Request Options: ${JSON.stringify(requestOptions.qs)}`);

        return new Promise<string>((resolve, reject) => {
            RequestPromise(requestOptions)
                .then((res: any) => {
                    resolve(res);
                })
                .catch((err: any) => {
                    Task.debug(`ZAP API Call: ${requestOptions.uri} | Response: ${err}`);
                    reject(err.message || err);
                });
        });
    }
    
    private sendZapRequest<T>(taskInputs: TaskInput, relativeUri: string, params: any): Promise<T> {
        const requestOptions: Request.UriOptions & RequestPromise.RequestPromiseOptions = {
            // tslint:disable-next-line:no-http-string
            uri: `http://${this.zapHost}:${this.zapPort}/JSON/${relativeUri}/`,
            qs: { 
                zapapiformat: 'JSON',
                formMethod: 'GET'
            }
        };

        Object.keys(params).forEach(key => {
            requestOptions.qs[key] = params[key];
        });
    
        Task.debug(`ZAP API Call: ${requestOptions.uri} | Request Options: ${JSON.stringify(requestOptions.qs)}`);
        return new Promise<T>((resolve, reject) => {
            RequestPromise(requestOptions)
                .then(async (res: any) => {
                    resolve(JSON.parse(res));
                })
                .catch((err: any) => {
                    Task.debug(`ZAP API Result: ${requestOptions.uri} | Failed: ${err.message || err}`);
                    reject(err);
                }); 
        });
    }
}