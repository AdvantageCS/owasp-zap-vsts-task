// The authenticate function will be called for authentications made via ZAP.

var HttpRequestHeader = Java.type("org.parosproxy.paros.network.HttpRequestHeader");
var HttpHeader = Java.type("org.parosproxy.paros.network.HttpHeader");
var URI = Java.type("org.apache.commons.httpclient.URI");

// The authenticate function is called whenever ZAP requires to authenticate, for a Context for which this script
// was selected as the Authentication Method. The function should send any messages that are required to do the authentication
// and should return a message with an authenticated response so the calling method.
//
// NOTE: Any message sent in the function should be obtained using the 'helper.prepareMessage()' method.
//
// Parameters:
//		helper - a helper class providing useful methods: prepareMessage(), sendAndReceive(msg), getHttpSender()
//		paramsValues - the values of the parameters configured in the Session Properties -> Authentication panel.
//					The paramsValues is a map, having as keys the parameters names (as returned by the getRequiredParamsNames()
//					and getOptionalParamsNames() functions below)
//		credentials - an object containing the credentials values, as configured in the Session Properties -> Users panel.
//					The credential values can be obtained via calls to the getParam(paramName) method. The param names are the ones
//					returned by the getCredentialsParamsNames() below
function authenticate(helper, paramsValues, credentials) {
    print("Authenticating via JavaScript script...");

    var authHelper = new OAuthAuthenticator(helper, paramsValues, credentials);
    return authHelper.login();
}

// This function is called during the script loading to obtain a list of the names of the required configuration parameters,
// that will be shown in the Session Properties -> Authentication panel for configuration. They can be used
// to input dynamic data into the script, from the user interface (e.g. a login URL, name of POST parameters etc.)
function getRequiredParamsNames(){
	return ["token_endpoint"];
}

// This function is called during the script loading to obtain a list of the names of the optional configuration parameters,
// that will be shown in the Session Properties -> Authentication panel for configuration. They can be used
// to input dynamic data into the script, from the user interface (e.g. a login URL, name of POST parameters etc.)
function getOptionalParamsNames(){
	return [];
}

// This function is called during the script loading to obtain a list of the names of the parameters that are required,
// as credentials, for each User configured corresponding to an Authentication using this script 
function getCredentialsParamsNames(){
	return ["client_id", "client_secret"];
}

function OAuthAuthenticator(helper, paramsValues, credentials) {
    this.helper = helper;
    this.tokenEndpoint = paramsValues.get('token_endpoint');
    this.clientId = credentials.getParam('client_id');
    this.clientSecret = credentials.getParam('client_secret');
    return this;
}

OAuthAuthenticator.prototype = {
    login: function () {
        var response = this.doTokenRequest();
        var parsedResponse = JSON.parse(response.getResponseBody().toString());
        if (parsedResponse.access_token === undefined || parsedResponse.access_token === null) {
            print('Authentication failure to ' + this.tokenEndpoint + ' with : client_id = ' + this.clientId + ' ; secret = ' + this.clientSecret);
            print(response.getResponseBody().toString())
        }
        else {
            print('Authentication succes. Token = ' + parsedResponse.access_token);
            org.zaproxy.zap.extension.script.ScriptVars.setGlobalVar("access_token", parsedResponse.access_token)
        }
        return response;
    },

    doTokenRequest: function () {
        var uri = new URI(this.tokenEndpoint, false);
        var requestHeader = new HttpRequestHeader(HttpRequestHeader.POST, uri, HttpHeader.HTTP10);
        var requestBody = 'grant_type=client_credentials&client_id=' + this.clientId + '&client_secret=' + this.clientSecret
        requestHeader.setContentLength(requestBody.length);

        var msg = this.helper.prepareMessage();
        msg.setRequestHeader(requestHeader);
        msg.setRequestBody(requestBody);
        this.helper.sendAndReceive(msg);
        return msg;
    }
};