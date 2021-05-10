import { UserAgentApplication } from "msal";

var msalConfig = {
    auth: {
        clientId: "243c7731-e1aa-420c-90a0-3b4f8f3afd61",
        authority: "https://login.microsoftonline.com/d7cbbb08-47a3-4bd7-8347-5018f2744cfb",
        redirectURI: "http://localhost:8080/"
    },
    cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: true
    }
};

var requestObj = {
    scopes: ["user.read"]
};

var myMSALObj = new UserAgentApplication(msalConfig);

var login = async () => {
    var authResult = await myMSALObj.loginPopup(requestObj);
    return authResult.account;
};

var getAccount = async () => {
    var account = await myMSALObj.getAccount();
    return account;
};

var logoff = () => {
    myMSALObj.logout();
};

export default {
    login,
    getAccount,
    logoff
};