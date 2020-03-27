var recordId;
var recordModule;
var ButtonPosition;
var smsTemplates;
var templateId;
var Mobile;

function addListItem(menudId, itemLabel, itemValue, itemId) {
    if (itemId != null) {
        cacheItem = '<textarea id="' + itemId + '">' + itemValue + '</textarea>';
        $('#value-cache').append(item);
        itemValue = itemId;
    }
    item = '<a class="dropdown-item ' + menudId + '-item" href="#" data-value="' + itemValue + '">' + itemLabel + '</a>';
    $("#" + menudId).append(item);
}

function showError(message) {
    console.log(message);
}

function initializeWidget() {

    ZOHO.embeddedApp.on("PageLoad", function (record) {
        console.log("Zoho Page loading....")
        recordId = record.EntityId;
        recordModule = record.Entity;
        ButtonPosition = record.ButtonPosition;
        selectModule(recordModule);

        // Get all the field names for this module
        ZOHO.CRM.META.getFields({
            Entity: recordModule
        }).then(function (data) {
            console.log(JSON.stringify(data));
            data.fields.forEach(function (field) {
                addListItem("record-fields", field.field_label, recordModule + "__" + field.api_name, null);
            });
        })

        // Get all the SMS templates
        ZOHO.CRM.API.getAllRecords({
            Entity: "smsmagic4__SMS_Templates",
            sort_order: "desc",
            per_page: 50,
            page: 1
        }).then(function (data) {
            smsTemplates = data.data;
            smsTemplates.forEach(function (template) {
                addListItem("sms-templates", template.Name, template.smsmagic4__Text, template.id);
            });
        })

        // Get all the sender ids
        ZOHO.CRM.API.getAllRecords({
            Entity: "smsmagic4__SMS_SenderId",
            sort_order: "desc",
            per_page: 50,
            page: 1
        }).then(function (data) {
            smsSenderIds = data.data;
            smsSenderIds.forEach(function (senderId) {
                if (senderId.Name == null || senderId.Name == "") {
                    senderId.Name = senderId.smsmagic4__SenderId;
                }
                addListItem("sms-sender-ids", senderId.Name, senderId.smsmagic4__SenderId, null);
            });
        })

        // Check if mobile field is valid or not
        if (ButtonPosition == "DetailView" || recordId.length == 1) {
            ZOHO.CRM.API.getRecord({
                Entity: recordModule,
                RecordID: recordId[0]
            }).then(function (data) {
                mobile = data.data[0].Mobile;
                if (mobile == null || mobile == "") {
                    showError("Mobile field is empty for selected record");
                }
            })
        }
    });

    ZOHO.embeddedApp.init();

    // ZOHO.embeddedApp.init().then(function () {
    //     ZOHO.CRM.API.getOrgVariable("smsmagic4__smsmagicApiKey").then(function (apiKey) {
    //         if (apiKey && apiKey.Success && apiKey.Success.Content == "") {
    //             showError("Please enter your SMS Magic Api Key in extension configuration page.");
    //         }
    //     });
    // });
}