import { RequestService } from './classes/RequestService';
import * as path from 'path';
import * as Task from 'vsts-task-lib';

import { Report } from './classes/Report';
import { Verify } from './classes/Verify';
import { Helper } from './classes/Helper';
import { TaskInput } from './classes/TaskInput';
import { Context } from './classes/Context';
import { UIContext } from './classes/UIContext';
import { ApiContext } from './classes/ApiContext';
import { ZapRunner } from './classes/ZapRunner';

Task.setResourcePath(path.join(__dirname, 'task.json'));

async function run(): Promise<void> {
    const taskInputs: TaskInput = new TaskInput();

    /* Get the required inputs */
    taskInputs.TargetUrl = Task.getInput('TargetUrl', true);
    
    /* Authentication Options */
    taskInputs.AuthClientId = Task.getInput('AuthClientId', true);
    taskInputs.AuthClientSecret = Task.getInput('AuthClientSecret', true);
    taskInputs.WindowsUsername = Task.getInput('WindowsUsername', true);
    taskInputs.WindowsPassword = Task.getInput('WindowsPassword', true);

    /* Spider Scan Options */
    taskInputs.ExecuteSpiderScan = Task.getBoolInput('ExecuteSpiderScan');
    taskInputs.MaxChildrenToCrawl = Task.getInput('MaxChildrenToCrawl');
    
    /* Active Scan Options inputs */
    taskInputs.ExecuteActiveScan = Task.getBoolInput('ExecuteActiveScan');
    taskInputs.ScanPolicyName = Task.getInput('ScanPolicyName');
    
    /* Reporting options */
    taskInputs.ReportType = Task.getInput('ReportType');
    taskInputs.ReportFileDestination = Task.getPathInput('ReportFileDestination');
    taskInputs.ReportFileName = Task.getInput('ReportFileName');
    taskInputs.ProjectName = Task.getVariable('Build.Repository.Name');
    taskInputs.BuildDefinitionName = Task.getVariable('Build.DefinitionName');
    
    /* Verification Options */
    taskInputs.EnableVerifications = Task.getBoolInput('EnableVerifications');
    taskInputs.MaxHighRiskAlerts = parseInt(Task.getInput('MaxHighRiskAlerts'), 10);
    taskInputs.MaxMediumRiskAlerts = parseInt(Task.getInput('MaxMediumRiskAlerts'), 10);
    taskInputs.MaxLowRiskAlerts = parseInt(Task.getInput('MaxLowRiskAlerts'), 10);

    /* Start ZAP in daemon mode */
    const zapRunner: ZapRunner = new ZapRunner();
    const requestService: RequestService = await zapRunner.startZap();
    Task.debug('ZAP started; preparing scans.');

    try {
        /* Scan the UI and API contexts */
        await UIContext.scanUI(taskInputs, requestService);
        await ApiContext.scanApi(taskInputs, requestService);
    
        /* Generate the report */
        const report: Report = new Report(new Helper(), requestService, taskInputs);
        const isSuccess: boolean = await report.GenerateReport();
    
        /* Perform the Verifications and Print the report */
        const verify: Verify = new Verify(new Helper(), report, taskInputs);
        verify.assert();

        Task.setResult(isSuccess ? Task.TaskResult.Succeeded : Task.TaskResult.SucceededWithIssues, 
            'OWASP ZAP Active Scan Complete. Result is within the expected thresholds.');
    } finally {
        /* Shutdown the ZAP process */
        await requestService.executeActionCheckResult(taskInputs, 'core', 'shutdown', {});
    }
}   

run().catch((err: any) => {
    console.log(err);
    Task.setResult(Task.TaskResult.Failed, `Failed to initiate the active scan. Error: ${err.message || err}`);
});
