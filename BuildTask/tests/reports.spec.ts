// tslint:disable-next-line:no-require-imports
require('dotenv').config();
import * as path from 'path';
import * as fs from 'fs';
import * as expect from 'expect';
import * as sinon from 'sinon';

import { Report } from './../OwaspZapScan/classes/Report';
import { TaskInput } from './../OwaspZapScan/classes/TaskInput';
import { RequestService } from './../OwaspZapScan/classes/RequestService';
import { Helper } from './../OwaspZapScan/classes/Helper';
import { AlertItem } from './../OwaspZapScan/interfaces/types/ZapReport';
import { AlertResult } from './../OwaspZapScan/interfaces/types/AlertResult';
import { ReportType } from '../OwaspZapScan/enums/Enums';


describe('OWASP Zap Scan Reports', () => {   
    describe('When getting the active or spider scan result', () => {
        // tslint:disable-next-line:mocha-no-side-effect-code
        const taskInput: TaskInput = new TaskInput();
        taskInput.ZapApiKey = 'empty';
        taskInput.ZapApiUrl = 'empty';
        taskInput.TargetUrl = 'empty';

        let report: Report;
        let helper: Helper;
        let requestService: RequestService;

        describe('When GetScanResults is called with XML report type', () => {            
            let xmlString: string;
    
            beforeEach(() => {
                // Stub Helper
                helper = new Helper();
                                
                // Stub RequestService
                requestService = new RequestService();
                const xmlPath = path.join(__dirname, 'valid.xml');
                xmlString = fs.readFileSync(xmlPath, 'utf8');
                sinon.stub(requestService, 'ExecuteRequest').returns(xmlString);           
                
                report = new Report(helper, requestService, taskInput);
            });
    
            it('Should return a Promise of type string', () => {
                const result = report.GenerateReportOfType(ReportType.XML);
                expect(result).toBeA('string');
            });
    
            it('Should contain XML content in the string', () => {
                expect(report.GenerateReportOfType(ReportType.XML)).toContain('<?xml version="1.0"?>');
            });
        });
    
        describe('When GetScanResults is called with HTML report type', () => {
            let htmlString: string;
    
            beforeEach(() => {
                // Stub Helper
                helper = new Helper();
                            
                // Stub RequestService
                requestService = new RequestService();
                const htmlPath = path.join(__dirname, 'valid.html');
                htmlString = fs.readFileSync(htmlPath, 'utf8');
                sinon.stub(requestService, 'ExecuteRequest').returns(htmlString);
    
                report = new Report(helper, requestService, taskInput);
            });
    
            it('Should return a Promise of type string', () => {
                const result = report.GenerateReportOfType(ReportType.HTML);
                expect(result).toBeA('string');
            });
    
            it('Should contain XML content in the string', () => {
                expect(report.GenerateReportOfType(ReportType.HTML)).toContain('<!DOCTYPE html>');
            });
        });
    
        describe('When GetScanResults is called with Markdown report type', () => {
            let mdString: string;
    
            beforeEach(() => {
                // Stub Helper
                helper = new Helper();
                            
                // Stub RequestService
                requestService = new RequestService();
                const mdPath = path.join(__dirname, 'valid.md');
                mdString = fs.readFileSync(mdPath, 'utf8');
                sinon.stub(requestService, 'ExecuteRequest').returns(mdString);
    
                report = new Report(helper, requestService, taskInput);
            });
    
            it('Should return a Promise of type string', () => {
                const result = report.GenerateReportOfType(ReportType.MD);
                expect(result).toBeA('string');
            });
    
            it('Should contain XML content in the string', () => {
                expect(report.GenerateReportOfType(ReportType.MD)).toContain('#Zap Scan Report');
            });
        });
    });

    describe('When generating the Scan Report', () => {
        // tslint:disable-next-line:mocha-no-side-effect-code
        const taskInput: TaskInput = new TaskInput();
        taskInput.ZapApiKey = 'empty';
        taskInput.ZapApiUrl = 'empty';
        taskInput.TargetUrl = 'empty';

        let report: Report;
        let helper: Helper;
        let requestService: RequestService;

        describe('When GenerateReport is called with a report type and,', () => {
            beforeEach(() => {
                taskInput.ReportFileName = 'Scan Report';
                taskInput.ReportFileDestination = path.join(__dirname);
                taskInput.BuildDefinitionName = 'Test';
            });

            describe('When the report type is XML, GenerateReport method', () => {                
                let xmlString: string;

                beforeEach(() => {
                    // Stub Helper
                    helper = new Helper();
                    const alertResults: AlertResult = {
                        HighAlerts: 0,
                        MediumAlerts: 0,
                        LowAlerts: 0,
                        InformationalAlerts: 0,
                        Alerts: Array<AlertItem>()
                    };
                    sinon.stub(helper, 'ProcessAlerts').returns(alertResults);

                    // Stub RequestService
                    requestService = new RequestService();
                    const mdPath = path.join(__dirname, 'valid.xml');
                    xmlString = fs.readFileSync(mdPath, 'utf8');
                    sinon.stub(requestService, 'ExecuteRequest').returns(xmlString);

                    taskInput.ReportType = 'xml';

                    report = new Report(helper, requestService, taskInput);
                });

                it('Should return true', () => {
                    expect(report.GenerateReport()).toBeTruthy();
                });
            });

            describe('When the report type is HTML, GenerateReport method', () => {                
                let xmlString: string;

                beforeEach(() => {
                    // Stub Helper
                    helper = new Helper();
                    const alertResults: AlertResult = {
                        HighAlerts: 0,
                        MediumAlerts: 0,
                        LowAlerts: 0,
                        InformationalAlerts: 0,
                        Alerts: Array<AlertItem>()
                    };
                    sinon.stub(helper, 'ProcessAlerts').returns(alertResults);

                    // Stub RequestService
                    requestService = new RequestService();
                    const mdPath = path.join(__dirname, 'valid.html');
                    xmlString = fs.readFileSync(mdPath, 'utf8');
                    sinon.stub(requestService, 'ExecuteRequest').returns(xmlString);

                    taskInput.ReportType = 'html';

                    report = new Report(helper, requestService, taskInput);
                });

                it('Should return true', () => {
                    expect(report.GenerateReport()).toBeTruthy();
                });
            });

            describe('When the report type is Markdown, GenerateReport method', () => {                
                let xmlString: string;

                beforeEach(() => {
                    // Stub Helper
                    helper = new Helper();
                    const alertResults: AlertResult = {
                        HighAlerts: 0,
                        MediumAlerts: 0,
                        LowAlerts: 0,
                        InformationalAlerts: 0,
                        Alerts: Array<AlertItem>()
                    };
                    sinon.stub(helper, 'ProcessAlerts').returns(alertResults);

                    // Stub RequestService
                    requestService = new RequestService();
                    const mdPath = path.join(__dirname, 'valid.md');
                    xmlString = fs.readFileSync(mdPath, 'utf8');
                    sinon.stub(requestService, 'ExecuteRequest').returns(xmlString);

                    taskInput.ReportType = 'md';

                    report = new Report(helper, requestService, taskInput);
                });

                it('Should return true', () => {
                    expect(report.GenerateReport()).toBeTruthy();
                });
            });
        });
    });

    describe('When printing the Scan Report', () => {
        describe('When calling the PrintReport with arguments', () => {
            // tslint:disable-next-line:mocha-no-side-effect-code
            const taskInput: TaskInput = new TaskInput();
            taskInput.ZapApiKey = 'empty';
            taskInput.ZapApiUrl = 'empty';
            taskInput.TargetUrl = 'empty';
    
            let report: Report;
            let helper: Helper;
            let requestService: RequestService;

            beforeEach(() => {
                // Stub Helper
                helper = new Helper();

                // Stub RequestService
                requestService = new RequestService();
                sinon.stub(requestService, 'ExecuteRequest').returns('');

                report = new Report(helper, requestService, taskInput);
            });

            it('Should print the result', () => {
                expect(report.PrintResult(0, 0, 0, 0));
            });
        });
    });

});