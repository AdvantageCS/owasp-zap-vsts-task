import * as task from 'vsts-task-lib/task';
import * as toolrunner from 'vsts-task-lib/toolrunner';
import * as net from 'net';

import { RequestService } from './RequestService';

export class ZapRunner {
    async startZap(): Promise<RequestService> {
        const cmdPath = task.which('cmd');
        const zapDir = 'C:\\OWASP\\ZAP';
        const zapPath = `${zapDir}\\zap.bat`;
        task.checkPath(zapPath, 'zap.bat');

        const port: number = await this.findFreePort();
        const tool: toolrunner.ToolRunner = task
            .tool(cmdPath)
            .arg(['/c', zapPath, '-daemon'])
            .arg(['-host', 'localhost', '-port', `${port}`]) 
            .arg('-addonupdate')
            .arg(['-addoninstall', 'openapi'])
            .arg(['-config', 'api.disablekey=true'])
            .arg(['-config', 'api.addrs.addr.name=.*'])
            .arg(['-config', 'api.addrs.addr.regex=true']);
        
        task.debug(`Starting ZAP in daemon mode listening on port ${port}`);
        return new Promise<RequestService>((resolve, reject) => {
            tool.on('stdline', (output: string) => {
                if (output.indexOf('ZAP is now listening on localhost') >= 0) {
                    resolve(new RequestService('localhost', port));
                }
            });
            tool.exec(<toolrunner.IExecOptions>{
                cwd: zapDir,
                failOnStdErr: true,
                ignoreReturnCode: false
            }).then(() => {
                reject('ZAP exited.');
            });
        });
    }
    
    private async findFreePort(): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            const srv = new net.Server();
            srv.listen(0, () => {
                const port: number = srv.address().port;
                srv.close();
                resolve(port);
            });
            srv.on('error', err => { reject(err); });
        });
    }
}
