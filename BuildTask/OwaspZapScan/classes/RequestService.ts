import * as Request from 'request';
import * as RequestPromise from 'request-promise';
import * as Task from 'vsts-task-lib';

export class RequestService {
    constructor() { }

    SendRequestGetResponseAsString(operationName: string, requestOptions: Request.UriOptions & RequestPromise.RequestPromiseOptions): Promise<string> {
        Task.debug(`${operationName} | ZAP API Call: ${requestOptions.uri} | Request Options: ${JSON.stringify(requestOptions.qs)}`);

        return new Promise<string>((resolve, reject) => {
            RequestPromise(requestOptions)
                .then((res: any) => {
                    resolve(res);
                })
                .error((err: any) => {
                    reject(err.message || err);
                });
        });
    }

    SendRequestGetResponseAs<T>(operationName: string, requestOptions: Request.UriOptions & RequestPromise.RequestPromiseOptions): Promise<T> {
        Task.debug(`${operationName} | ZAP API Call: ${requestOptions.uri} | Request Options: ${JSON.stringify(requestOptions.qs)}`);
        
        return new Promise<T>((resolve, reject) => {
            RequestPromise(requestOptions)
                .then(async (res: any) => {
                    Task.debug(`${operationName} | Target URL: ${requestOptions.uri} | Response: ${res}`);
                    const result: T = JSON.parse(res);
                    resolve(result);
                })
                .error((err: any) => {
                    Task.debug(`${operationName} | Target URL: ${requestOptions.uri} | Failed: ${err.message || err}`);
                    reject(err);
                }); 
        });
    }
}