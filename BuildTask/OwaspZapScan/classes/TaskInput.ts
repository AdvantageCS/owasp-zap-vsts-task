export class TaskInput {
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


    private _apiVersion: string = '2018-01';
    set ApiVersion(value: string) {
        this._apiVersion = value;
    }

    get ApiVersion(): string {
        return this._apiVersion;
    }
    

    /* Spider Scan */
    private _executeSpiderScan: boolean = false;
    set ExecuteSpiderScan(value: boolean) {
        this._executeSpiderScan = value;
    }

    get ExecuteSpiderScan(): boolean {
        return this._executeSpiderScan;
    }
        
    
    private _maxChildrenToCrawl: string = '';
    set MaxChildrenToCrawl(value: string) {
        this._maxChildrenToCrawl = value;
    }

    get MaxChildrenToCrawl(): string {
        return this._maxChildrenToCrawl;
    }


    /* Active Scan */
    private _executeActiveScan: boolean = false;
    set ExecuteActiveScan(value: boolean) {
        this._executeActiveScan = value;
    }

    get ExecuteActiveScan(): boolean {
        return this._executeActiveScan;
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


    /* Authentication */
    private _authClientId: string = '';
    set AuthClientId(value: string) {
        this._authClientId = value;
    }
    get AuthClientId(): string {
        return this._authClientId;
    }

    private _authClientSecret: string = '';
    set AuthClientSecret(value: string) {
        this._authClientSecret = value;
    }
    get AuthClientSecret(): string {
        return this._authClientSecret;
    }

    private _windowsUsername: string = '';
    set WindowsUsername(value: string) {
        this._windowsUsername = value;
    }
    get WindowsUsername(): string {
        return this._windowsUsername;
    }

    private _windowsPassword: string = '';
    set WindowsPassword(value: string) {
        this._windowsPassword = value;
    }
    get WindowsPassword(): string {
        return this._windowsPassword;
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