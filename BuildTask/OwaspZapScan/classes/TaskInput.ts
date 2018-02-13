export class TaskInput {
    /* Required */
    private _zapApiKey: string | undefined;
    set ZapApiKey(value: string) {
        this._zapApiKey = value;
    }

    get ZapApiKey(): string {
        if (this._zapApiKey) {
            return this._zapApiKey;
        }
        /* istanbul ignore next */
        throw new Error('The ZAP API Key is required but not set.');
    }


    private _zapApiUrl: string | undefined;
    set ZapApiUrl(value: string) {
        this._zapApiUrl = value;
    }
    
    get ZapApiUrl(): string {
        if (this._zapApiUrl) {
            return this._zapApiUrl;
        }
        /* istanbul ignore next */
        throw new Error('The ZAP API URL is required but not set.');
    }

    
    private _targetUrl: string | undefined;
    set TargetUrl(value: string) {
        this._targetUrl = value;
    }

    get TargetUrl(): string {
        if (this._targetUrl) {
            return this._targetUrl;
        }
        /* istanbul ignore next */
        throw new Error('The Target URL is required but not set.');
    }


    /* Spider Scan */
    private _executeSpiderScan: boolean = false;
    set ExecuteSpiderScan(value: boolean) {
        this._executeSpiderScan = value;
    }

    get ExecuteSpiderScan(): boolean {
        return this._executeSpiderScan;
    }


    private _recurseSpider: boolean = false;
    set RecurseSpider(value: boolean) {
        this._recurseSpider = value;
    }

    get RecurseSpider(): boolean {
        return this._recurseSpider;
    }
    
    
    private _subTreeOnly: boolean = false;
    set SubTreeOnly(value: boolean) {
        this._subTreeOnly = value;
    }

    get SubTreeOnly(): boolean {
        return this._subTreeOnly;
    }
    
    
    private _maxChildrenToCrawl: string = '';
    set MaxChildrenToCrawl(value: string) {
        this._maxChildrenToCrawl = value;
    }

    get MaxChildrenToCrawl(): string {
        return this._maxChildrenToCrawl;
    }


    private _contextName: string = '';
    set ContextName(value: string) {
        this._contextName = value;
    }

    get ContextName(): string {
        return this._contextName;
    }


    /* Active Scan */
    private _executeActiveScan: boolean = false;
    set ExecuteActiveScan(value: boolean) {
        this._executeActiveScan = value;
    }

    get ExecuteActiveScan(): boolean {
        return this._executeActiveScan;
    }


    private _contextId: string = '';
    set ContextId(value: string) {
        this._contextId = value;
    }

    get ContextId(): string {
        return this._contextId;
    }


    private _recurse: boolean = false;
    set Recurse(value: boolean) {
        this._recurse = value;
    }

    get Recurse(): boolean {
        return this._recurse;
    }


    private _inScopeOnly: boolean = false;
    set InScopeOnly(value: boolean) {
        this._inScopeOnly = value;
    }

    get InScopeOnly(): boolean {
        return this._inScopeOnly;
    }


    private _scanPolicyName: string = '';
    set ScanPolicyName(value: string) {
        this._scanPolicyName = value;
    }

    get ScanPolicyName(): string {
        return this._scanPolicyName;
    }


    private _method: string = '';
    set Method(value: string) {
        this._method = value;
    }

    get Method(): string {
        return this._method;
    }


    private _postData: string = '';
    set PostData(value: string) {
        this._postData = value;
    }

    get PostData(): string {
        return this._postData;
    }


    
    /* Reporting */
    private _reportType: string = '';
    set ReportType(value: string) {
        this._reportType = value;
    }

    get ReportType(): string {
        return this._reportType;
    }


    private _reportFileDestination: string = '';
    set ReportFileDestination(value: string) {
        this._reportFileDestination = value;
    }

    get ReportFileDestination(): string {
        return this._reportFileDestination;
    }


    private _reportFileName: string = '';
    set ReportFileName(value: string) {
        this._reportFileName = value;
    }

    get ReportFileName(): string {
        return this._reportFileName;
    }


    private _projectName: string = '';
    set ProjectName(value: string) {
        this._projectName = value;
    }

    get ProjectName(): string {
        return this._projectName;
    }


    private _buildDefinitionName: string = '';
    set BuildDefinitionName(value: string) {
        this._buildDefinitionName = value;
    }

    get BuildDefinitionName(): string {
        return this._buildDefinitionName;
    }



    /* Verification */
    private _enableVerifications: boolean = false;
    set EnableVerifications(value: boolean) {
        this._enableVerifications = value;
    }

    get EnableVerifications(): boolean {
        return this._enableVerifications;
    }


    private _maxHighRiskAlerts: number = 0;
    set MaxHighRiskAlerts(value: number) {
        this._maxHighRiskAlerts = value;
    }

    get MaxHighRiskAlerts(): number {
        return this._maxHighRiskAlerts;
    }


    private _maxMediumRiskAlerts: number = 0;
    set MaxMediumRiskAlerts(value: number) {
        this._maxMediumRiskAlerts = value;
    }

    get MaxMediumRiskAlerts(): number {
        return this._maxMediumRiskAlerts;
    }


    private _maxLowRiskAlerts: number = 0;
    set MaxLowRiskAlerts(value: number) {
        this._maxLowRiskAlerts = value;
    }

    get MaxLowRiskAlerts(): number {
        return this._maxLowRiskAlerts;
    }
}