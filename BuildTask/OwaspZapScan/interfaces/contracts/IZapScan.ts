import { ZapScanType } from '../../enums/Enums';

export interface IZapScan {
    readonly scanType: string;
    readonly zapScanType: ZapScanType;
    executeScan(): Promise<void>;
}