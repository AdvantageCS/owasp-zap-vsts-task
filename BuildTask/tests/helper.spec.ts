// tslint:disable-next-line:no-require-imports
require('dotenv').config();
import * as path from 'path';
import * as fs from 'fs';
import * as expect from 'expect';

import { Helper } from '../OwaspZapScan/classes/Helper';
import { AlertResult } from './../OwaspZapScan/interfaces/types/AlertResult';

describe('OWASP Zap Scan Helpers', () => {
    describe('When a valid xmlReport and a url is passed, the helper', () => {
        it('Should not be undefined or null', () => {            
            const helper = new Helper();
            expect(helper).toNotBe(undefined).toNotBe(null);
        });
    });

    describe('When a valid xmlReport and a url is passed, the return value', () => {
        let helper: Helper;
        let xmlString: string;
        let result: AlertResult;
        // tslint:disable-next-line:no-http-string
        const validTargetUrl: string = 'https://localhost';
        // tslint:disable-next-line:no-http-string
        const invalidTargetUrl: string = 'https://localhost';
    
        before(() => {
            helper = new Helper();
            const xmlPath = path.join(__dirname, 'valid.xml');
            xmlString = fs.readFileSync(xmlPath, 'utf8');
            result = helper.processAlerts(xmlString, validTargetUrl);
        });
    
        it('Should not be undefined', () => {            
            expect(result).toNotBe(undefined);
        });

        it('Should not be null', () => {
            expect(result).toNotBe(null);
        });

        it('Should contain an array of alerts',  () => {
            expect(result.Alerts).toBeAn(Array);
        });

        it('Should contain one or many alerts',  () => {
            expect(result.Alerts.length).toBeGreaterThan(0);
        });

        it('Should have 0 high risk alerts', () => {
            expect(result.HighAlerts).toBe(0);
        });

        it('Should have 1 medium risk alerts', () => {
            expect(result.MediumAlerts).toBe(1);
        });

        it('Should have 1 medium alert instance', () => {
            expect(result.Alerts[0].instances[0].instance.length).toBe(1);
        });

        it('Should have 3 low risk alerts', () => {
            expect(result.LowAlerts).toBe(3);
        });

        it('Should have 0 info risk alerts', () => {
            expect(result.InformationalAlerts).toBe(0);
        });
    });

    describe('When a valid xmlReport and an invalid url is passed, the return value', () => {
        let helper: Helper;
        let xmlString: string;
        let result: AlertResult;
        // tslint:disable-next-line:no-http-string
        const invalidTargetUrl: string = 'https://invalid';
    
        before(() => {
            helper = new Helper();
            const xmlPath = path.join(__dirname, 'valid.xml');
            xmlString = fs.readFileSync(xmlPath, 'utf8');
            result = helper.processAlerts(xmlString, invalidTargetUrl);
        });
    
        it('Should throw an exception', () => {            
            expect(result).toNotBe(undefined);
        });

        it('Should be null', () => {
            expect(result).toNotBe(null);
        });

        it('Should contain an array of alerts',  () => {
            expect(result.Alerts).toBeAn(Array);
        });

        it('Should not contain any alerts',  () => {
            expect(result.Alerts.length).toBe(0);
        });

        it('Should have 0 high risk alerts', () => {
            expect(result.HighAlerts).toBe(0);
        });

        it('Should have 0 medium risk alerts', () => {
            expect(result.MediumAlerts).toBe(0);
        });

        it('Should have 0 low risk alerts', () => {
            expect(result.LowAlerts).toBe(0);
        });

        it('Should have 0 info risk alerts', () => {
            expect(result.InformationalAlerts).toBe(0);
        });
    });

    describe('When an invalid xmlReport and a valid url is passed, the return value', () => {
        let helper: Helper;
        let xmlString: string;
        // tslint:disable-next-line:no-http-string
        const validTargetUrl: string = 'https://localhost';
    
        before(() => {
            helper = new Helper();
            const xmlPath = path.join(__dirname, 'invalid.xml');
            xmlString = fs.readFileSync(xmlPath, 'utf8');
        });
    
        it('Should throw error', () => {  
            expect(() => helper.processAlerts(xmlString, validTargetUrl)).toThrow(Error);
        });
    });    
});
