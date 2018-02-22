// The sendingRequest and responseReceived functions will be called for all requests/responses sent/received by ZAP, 
// including automated tools (e.g. active scanner, fuzzer, ...)

// Note that new HttpSender scripts will initially be disabled
// Right click the script in the Scripts tree and select "enable"  

// 'initiator' is the component the initiated the request:
// 		1	PROXY_INITIATOR
// 		2	ACTIVE_SCANNER_INITIATOR
// 		3	SPIDER_INITIATOR
// 		4	FUZZER_INITIATOR
// 		5	AUTHENTICATION_INITIATOR
// 		6	MANUAL_REQUEST_INITIATOR
// 		7	CHECK_FOR_UPDATES_INITIATOR
// 		8	BEAN_SHELL_INITIATOR
// 		9	ACCESS_CONTROL_SCANNER_INITIATOR
// 		10	AJAX_SPIDER_INITIATOR
// For the latest list of values see the HttpSender class:
// https://github.com/zaproxy/zaproxy/blob/master/src/org/parosproxy/paros/network/HttpSender.java
// 'helper' just has one method at the moment: helper.getHttpSender() which returns the HttpSender 
// instance used to send the request.

function sendingRequest(msg, initiator, helper) {
	// Debugging can be done using println like this
    var accessToken = org.zaproxy.zap.extension.script.ScriptVars.getGlobalVar("access_token");
    if (accessToken) {
        //print('adding token to url=' + msg.getRequestHeader().getURI().toString())
        var httpRequestHeader = msg.getRequestHeader();
        httpRequestHeader.setHeader('Authorization', 'Bearer ' + accessToken);
        msg.setRequestHeader(httpRequestHeader);        
    }
}

function responseReceived(msg, initiator, helper) {
}
