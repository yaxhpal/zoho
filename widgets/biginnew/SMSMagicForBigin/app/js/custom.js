$(document).ready(function () {
    /*
    * Subscribe to the EmbeddedApp onPageLoad event before
    * initializing the widget
    */
    ZOHO.embeddedApp.on("PageLoad",function(data) {
        /*
        * Verify if EntityInformation is Passed
        */
        if(data && data.Entity) {
            /*
            * Fetch Information of Record passed in PageLoad
            * and insert the response into the dom
            */
            ZOHO.CRM.API.getRecord({Entity:data.Entity,RecordID:data.EntityId}).then(function(response) {
                $("#recordInfo").innerHTML = JSON.stringify(response, null, 2);
            });
        }
        /*
        * Fetch Current User Information from CRM
        * and insert the response into the dom
        */
        ZOHO.CRM.CONFIG.getCurrentUser().then(function(response) {
            $("#userInfo").innerHTML = JSON.stringify(response, null, 2);
        });

        ZOHO.CRM.CONFIG.getOrgInfo().then(function(response) {
            $("#orgInfo").innerHTML = JSON.stringify(response, null, 2);
        });

        var data_keys = {apiKeys:["smsmagic4bigin__SMS_Magic_Data_Center_URL"]};
        ZOHO.CRM.API.getOrgVariable(data_keys).then(function (data) {
            console.log("smsmagic4bigin__SMS_Magic_Data_Center_URL:: " + JSON.stringify(data));
        });

    });
    /*
    * initialize the widget.
    */
    ZOHO.embeddedApp.init();
});