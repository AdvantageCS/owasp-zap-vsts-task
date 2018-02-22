import * as Task from 'vsts-task-lib';

import { NewContextResult, NewUserResult } from './../interfaces/types/ContextResult';
import { TaskInput } from './TaskInput';
import { RequestService } from './RequestService';

export class Context {
    private contextId: string | undefined;

    constructor(private taskInputs: TaskInput, private requestService: RequestService, private contextName: string) {}
    
    create(): Promise<string> {
        return this.requestService.executeAction<NewContextResult>(this.taskInputs, 'context', 'newContext', {
            contextName: this.contextName                
        })
        .then((result: NewContextResult) => {
            this.contextId = result.contextId;
            return result.contextId;
        });
    }
    
    includeInContext(pattern: string): Promise<void> {
        return this.requestService.executeActionCheckResult(this.taskInputs, 'context', 'includeInContext', {
            contextName: this.contextName,
            regex: pattern
        });
    }
    
    excludeFromContext(pattern: string): Promise<void> {
        return this.requestService.executeActionCheckResult(this.taskInputs, 'context', 'excludeFromContext', {
            contextName: this.contextName,
            regex: pattern
        });
    }

    setWindowsAuthentication(domain: string): Promise<void> {
        if (!this.contextId) {
            throw new Error('Context not yet created.');
        }

        const hostname = this.taskInputs.TargetUrl.split('/')[2];
        const port = this.taskInputs.TargetUrl.split(':')[0] === 'https' ? 443 : 80;

        return this.requestService.executeActionCheckResult(this.taskInputs, 'authentication', 'setAuthenticationMethod', {
            contextId: this.contextId,
            authMethodName: 'httpAuthentication',
            authMethodConfigParams: `hostname=${hostname}&port=${port}&realm=${domain}`
        })
        .then(() => this.setLoggedOutIndicator('Unauthorized'))
        .then(() => this.setSessionManagementMethod('httpAuthSessionManagement'));
    }

    setScriptBasedAuthentication(scriptName: string): Promise<void> {
        if (!this.contextId) {
            throw new Error('Context not yet created.');
        }

        return this.requestService.executeActionCheckResult(this.taskInputs, 'authentication', 'setAuthenticationMethod', {
            contextId: this.contextId,
            authMethodName: 'scriptBasedAuthentication',
            authMethodConfigParams: `scriptName=${scriptName}&token_endpoint=${this.taskInputs.TargetUrl}/connect/token`
        })
        .then(() => this.setLoggedOutIndicator('Unauthorized'))
        .then(() => this.setSessionManagementMethod('httpAuthSessionManagement'));
    }

    createStandardUser(userName: string, password: string): Promise<string> {
        return this.requestService.executeAction<NewUserResult>(this.taskInputs, 'users', 'newUser', {
            contextId: this.contextId,
            name: userName        
        })
        .then((result: NewUserResult) => this.addUserCredentials(result.userId, `username=${userName}&password=${password}`))
        .then((userId: string) => this.enableUser(userId, true));
    }

    createTokenUser(clientId: string, clientSecret: string): Promise<string> {
        return this.requestService.executeAction<NewUserResult>(this.taskInputs, 'users', 'newUser', {
            contextId: this.contextId,
            name: clientId        
        })
        .then((result: NewUserResult) => this.addUserCredentials(result.userId, `client_id=${clientId}&client_secret=${clientSecret}`))
        .then((userId: string) => this.enableUser(userId, true));
    }

    private setLoggedInIndicator(loggedInPattern: string): Promise<void> {
        return this.requestService.executeActionCheckResult(this.taskInputs, 'authentication', 'setLoggedInIndicator', {
            contextId: this.contextId,
            loggedInIndicatorRegex: loggedInPattern
        });
    }

    private setLoggedOutIndicator(loggedOutPattern: string): Promise<void> {
        return this.requestService.executeActionCheckResult(this.taskInputs, 'authentication', 'setLoggedOutIndicator', {
            contextId: this.contextId,
            loggedOutIndicatorRegex: loggedOutPattern
        });
    }

    private setSessionManagementMethod(methodName: string): Promise<void> {
        return this.requestService.executeActionCheckResult(this.taskInputs, 'sessionManagement', 'setSessionManagementMethod', {
            contextId: this.contextId,
            methodName: methodName
        });
    }

    private addUserCredentials(userId: string, credentialConfigParams: string): Promise<string> {
        return this.requestService.executeActionCheckResult(this.taskInputs, 'users', 'setAuthenticationCredentials', {
            contextId: this.contextId,
            userId: userId,
            authCredentialsConfigParams: credentialConfigParams
        }).then(() => Promise.resolve(userId));
    }

    private enableUser(userId: string, enabled: boolean): Promise<string> {
        return this.requestService.executeActionCheckResult(this.taskInputs, 'users', 'setUserEnabled', {
            contextId: this.contextId,
            userId: userId,
            enabled: enabled
        }).then(() => Promise.resolve(userId));
    }
}
