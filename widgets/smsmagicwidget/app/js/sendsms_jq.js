function initializeWidget() {
    /*
     * Subscribe to the EmbeddedApp onPageLoad event before initializing the widget 
     */
    ZOHO.embeddedApp.on("PageLoad", function (data) {

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
                    RecordID: data.EntityId
                })
                .then(function (response) {
                    document.getElementById("recordInfo").innerHTML = JSON.stringify(response, null, 2);
                });
        }

        /*
         * Fetch Current User Information from CRM
         * and insert the response into the dom
         */
        ZOHO.CRM.CONFIG.getCurrentUser()
            .then(function (response) {
                document.getElementById("userInfo").innerHTML = JSON.stringify(response, null, 2);
            });
    })
    /*
     * initialize the widget.
     */
    ZOHO.embeddedApp.init();
}