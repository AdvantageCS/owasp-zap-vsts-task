import { RequestService } from './RequestService';
import { OpenApiScan } from './OpenApiScan';
import { Scripts } from './Scripts';
import { TaskInput } from './TaskInput';
import { Context } from './Context';
import { IZapScan } from '../interfaces/contracts/IZapScan';
import { ActiveScan } from './ActiveScan';
import { ScanPolicy } from './ScanPolicy';

export class ApiContext {
    private static readonly authScriptName: string = 'API authentication';
    private static readonly senderScriptName: string = 'API token sender';
    private static readonly scanPolicyFileName: string = 'api-policy.xml';
    private static readonly scanPolicyName: string = 'API Policy';

    public static async scanApi(taskInputs: TaskInput, requestService: RequestService): Promise<void> {
        // define the API context
        const context = new Context(taskInputs, requestService, 'Api');
        const contextId = await context.create();
        await context.includeInContext(`${taskInputs.TargetUrl}/api.*`);

        // load the auth/sender scripts
        const apiAuthScript = new Scripts(taskInputs, requestService, ApiContext.authScriptName);
        await apiAuthScript.load('authentication', 'oauth-authentication.js');
        const apiTokenSenderScript = new Scripts(taskInputs, requestService, ApiContext.senderScriptName);
        await apiTokenSenderScript.load('httpsender', 'oauth-httpsender.js');
        await apiTokenSenderScript.enable();

        // configure script-based authentication for OAuth
        await context.setScriptBasedAuthentication(ApiContext.authScriptName);
        const userId = await context.createTokenUser(taskInputs.AuthClientId, taskInputs.AuthClientSecret);

        // ensure the scan policy is loaded
        const scanPolicy = new ScanPolicy(taskInputs, requestService, this.scanPolicyName);
        await scanPolicy.ensureImported(this.scanPolicyFileName);

        /* Import the Open API URLs */
        await new OpenApiScan(taskInputs, requestService).import(`${taskInputs.TargetUrl}/docs/api/${taskInputs.ApiVersion}/open-api.json`);

        /* Execute Active Scan if selected */
        if (taskInputs.ExecuteActiveScan) {
            const scan = new ActiveScan(taskInputs, requestService, this.scanPolicyName, contextId, userId);
            await scan.executeScan();
        }        
    }
}
