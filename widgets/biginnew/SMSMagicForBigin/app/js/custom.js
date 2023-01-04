$(document).ready(function () {
  console.log("Document is ready");
  /*
   * Subscribe to the EmbeddedApp onPageLoad event before
   * initializing the widget
   */
  ZOHO.embeddedApp.on("PageLoad", function (data) {
    console.log("PageLoad is complete" + JSON.stringify(data, null, 2));
    /*
     * Verify if EntityInformation is Passed
     */
    if (data && data.Entity) {
      /*
       * Fetch Information of Record passed in PageLoad
       * and insert the response into the dom
       */
      console.log("Fetching data: " + JSON.stringify(ZOHO, null, 2));
      ZOHO.BIGIN.API.getRecord({
        Entity: data.Entity,
        RecordID: data.EntityId,
      }).then(function (response) {
        console.log("ZOHO.BIGIN.API.getRecord: " + JSON.stringify(response, null, 2));
        $("#recordInfo").html(JSON.stringify(response));
      });
    }

   /*
    * Fetch Current User Information from CRM
    * and insert the response into the dom
    */
    ZOHO.BIGIN.CONFIG.getCurrentUser().then(function (response) {
      console.log("ZOHO.BIGIN.CONFIG.getCurrentUser: " + JSON.stringify(response, null, 2));
      $("#userInfo").html(JSON.stringify(response));
    });

    /*
     * Fetch Current User Information from CRM
     * and insert the response into the dom
     */
    ZOHO.BIGIN.CONFIG.getCurrentUser().then(function (response) {
      console.log("ZOHO.BIGIN.CONFIG.getCurrentUser: " + JSON.stringify(response, null, 2));
      $("#userInfo").html(JSON.stringify(response));
    });

    ZOHO.BIGIN.CONFIG.getOrgInfo().then(function (response) {
      console.log("ZOHO.BIGIN.CONFIG.getOrgInfo: " + JSON.stringify(response, null, 2));
      $("#orgInfo").html(JSON.stringify(response));
    });

    var data_keys = { apiKeys: ["smsmagiccompose__Base_URL"] };
    ZOHO.BIGIN.API.getOrgVariable(data_keys).then(function (data) {
      console.log("ZOHO.BIGIN.API.getOrgVariable: " + JSON.stringify(data, null, 2));
      try {
        console.log("smsmagiccompose__Base_URL:: " + JSON.stringify(data));
      } catch (err) {
        console.log('getOrgVariable error: ' + err);
      }
    });
  });
  ZOHO.embeddedApp.init();
});
