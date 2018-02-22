require('dotenv').config();
import * as expect from 'expect';

import { TaskInput } from './../OwaspZapScan/classes/TaskInput';

describe('OWASP Zap Scan Inputs', () => {
    describe('When invalid/no inputs are provided', () => {
        let taskInput: TaskInput;

        beforeEach(() => {
            taskInput = new TaskInput();
        });

        it('Should return false when ExecuteSpiderScan is called', () => {
            expect(taskInput.ExecuteSpiderScan).toBeFalsy();
        });

        it('Should return empty string when MaxChildrenToCrawl is called', () => {
            expect(taskInput.MaxChildrenToCrawl).toEqual('');
        });

        it('Should return false when ExecuteActiveScan is called', () => {
            expect(taskInput.ExecuteActiveScan).toBeFalsy();
        });

        it('Should return empty string when ScanPolicyName is called', () => {
            expect(taskInput.ScanPolicyName).toEqual('');
        });

        it('Should return empty string when ReportType is called', () => {
            expect(taskInput.ReportType).toEqual('');
        });

        it('Should return empty string when ReportFileDestination is called', () => {
            expect(taskInput.ReportFileDestination).toEqual('');
        });

        it('Should return empty string when ReportFileName is called', () => {
            expect(taskInput.ReportFileName).toEqual('');
        });

        it('Should return empty string when ProjectName is called', () => {
            expect(taskInput.ProjectName).toEqual('');
        });

        it('Should return empty string when BuildDefinitionName is called', () => {
            expect(taskInput.BuildDefinitionName).toEqual('');
        });

        it('Should return false when EnableVerifications is called', () => {
            expect(taskInput.EnableVerifications).toBeFalsy();
        });
        
        it('Should return 0 when MaxHighRiskAlerts is called', () => {
            expect(taskInput.MaxHighRiskAlerts).toEqual(0);
        });

        it('Should return 0 when MaxMediumRiskAlerts is called', () => {
            expect(taskInput.MaxMediumRiskAlerts).toEqual(0);
        });

        it('Should return 0 when MaxLowRiskAlerts is called', () => {
            expect(taskInput.MaxLowRiskAlerts).toEqual(0);
        });
    });


    describe('When valid inputs are provided', () => {
        let taskInput: TaskInput;

        beforeEach(() => {
            taskInput = new TaskInput();
            // tslint:disable-next-line:no-http-string
            taskInput.TargetUrl = 'http://example.com';
        
            /* Spider Scan Options */
            taskInput.ExecuteSpiderScan = true;
            taskInput.MaxChildrenToCrawl = '5';
            
            /* Active Scan Options inputs */
            taskInput.ExecuteActiveScan = true;
            taskInput.ScanPolicyName = 'policy-name';
            
            /* Reporting options */
            taskInput.ReportType = 'xml';
            taskInput.ReportFileDestination = 'path/to/report';
            taskInput.ReportFileName = 'scan-report';
            taskInput.ProjectName = 'project-name';
            taskInput.BuildDefinitionName = 'build-name';
            
            /* Verification Options */
            taskInput.EnableVerifications = true;
            taskInput.MaxHighRiskAlerts = 1;
            taskInput.MaxMediumRiskAlerts = 1;
            taskInput.MaxLowRiskAlerts = 1;
        });

        it('Should return when TargetUrl is called', () => {
            // tslint:disable-next-line:no-http-string
            expect(taskInput.TargetUrl).toEqual('http://example.com');
        });

        it('Should return true when ExecuteSpiderScan is called', () => {
            expect(taskInput.ExecuteSpiderScan).toBeTruthy();
        });

        it('Should return empty string when MaxChildrenToCrawl is called', () => {
            expect(taskInput.MaxChildrenToCrawl).toEqual('5');
        });

        it('Should return true when ExecuteActiveScan is called', () => {
            expect(taskInput.ExecuteActiveScan).toBeTruthy();
        });

        it('Should return empty string when ScanPolicyName is called', () => {
            expect(taskInput.ScanPolicyName).toEqual('policy-name');
        });

        it('Should return empty string when ReportType is called', () => {
            expect(taskInput.ReportType).toEqual('xml');
        });

        it('Should return empty string when ReportFileDestination is called', () => {
            expect(taskInput.ReportFileDestination).toEqual('path/to/report');
        });

        it('Should return empty string when ReportFileName is called', () => {
            expect(taskInput.ReportFileName).toEqual('scan-report');
        });

        it('Should return empty string when ProjectName is called', () => {
            expect(taskInput.ProjectName).toEqual('project-name');
        });

        it('Should return empty string when BuildDefinitionName is called', () => {
            expect(taskInput.BuildDefinitionName).toEqual('build-name');
        });

        it('Should return true when EnableVerifications is called', () => {
            expect(taskInput.EnableVerifications).toBeTruthy();
        });
        
        it('Should return 1 when MaxHighRiskAlerts is called', () => {
            expect(taskInput.MaxHighRiskAlerts).toEqual(1);
        });

        it('Should return 1 when MaxMediumRiskAlerts is called', () => {
            expect(taskInput.MaxMediumRiskAlerts).toEqual(1);
        });

        it('Should return 1 when MaxLowRiskAlerts is called', () => {
            expect(taskInput.MaxLowRiskAlerts).toEqual(1);
        });

    });
});