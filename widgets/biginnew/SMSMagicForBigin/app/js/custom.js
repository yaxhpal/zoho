$(document).ready(function () {
  console.log("Document is ready");
  /*
   * Subscribe to the EmbeddedApp onPageLoad event before
   * initializing the widget
   */
  ZOHO.embeddedApp.on("PageLoad", function (data) {
    console.log("PageLoad is complete");
    /*
     * Verify if EntityInformation is Passed
     */
    if (data && data.Entity) {
      /*
       * Fetch Information of Record passed in PageLoad
       * and insert the response into the dom
       */
      ZOHO.CRM.API.getRecord({
        Entity: data.Entity,
        RecordID: data.EntityId,
      }).then(function (response) {
        console.log("ZOHO.CRM.API.getRecord: " + response);
        $("#recordInfo").innerHTML = JSON.stringify(response, null, 2);
      });
    }

   /*
    * Fetch Current User Information from CRM
    * and insert the response into the dom
    */
    ZOHO.CRM.CONFIG.getCurrentUser().then(function (response) {
      console.log("ZOHO.CRM.CONFIG.getCurrentUser: " + response);
      $("#userInfo").innerHTML = JSON.stringify(response, null, 2);
    });

    /*
     * Fetch Current User Information from CRM
     * and insert the response into the dom
     */
    ZOHO.CRM.CONFIG.getCurrentUser().then(function (response) {
      console.log("ZOHO.CRM.CONFIG.getCurrentUser: " + response);
      $("#userInfo").innerHTML = JSON.stringify(response, null, 2);
    });

    ZOHO.CRM.CONFIG.getOrgInfo().then(function (response) {
      console.log("ZOHO.CRM.CONFIG.getOrgInfo: " + response);
      $("#orgInfo").innerHTML = JSON.stringify(response, null, 2);
    });

    // var data_keys = { apiKeys: ["smsmagic4bigin__SMS_Magic_Data_Center_URL"] };
    // ZOHO.CRM.API.getOrgVariable(data_keys).then(function (data) {
    //   console.log("ZOHO.CRM.API.getOrgVariable: " + date);
    //   try {
    //     console.log("smsmagic4bigin__SMS_Magic_Data_Center_URL:: " + JSON.stringify(data));
    //   } catch (err) {
    //     console.log('getOrgVariable error: ' + err);
    //   }
    // });
  });
  ZOHO.embeddedApp.init();
});
