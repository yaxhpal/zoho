var recordId;
var recordModule;
var ButtonPosition;
var smsTemplates;
var templateId;
var Mobile;

function addListItem(menudId, itemLabel, itemValue, itemId) {
    if (itemId != null) {
        cacheItem = '<textarea id="' + itemId + '">' + itemValue + '</textarea>';
        $('#value-cache').append(cacheItem);
        itemValue = itemId;
    }
    funcName = "";
    if (menudId == "record-fields") {
        funcName = "insertField";
    } else if (menudId == "sms-templates") {
        funcName = "insertTemplate";   
    } else {
        funcName = "insertSenderId";
    }
    item = '<a onclick="'+funcName+'(this);" class="dropdown-item ' + menudId + '-item" href="#" data-value="' + itemValue + '">' + itemLabel + '</a>';
    $("#" + menudId).append(item);
}

function showError(message) {
    console.log(message);
}

function closePopUp(toReload) {
    if (toReload) {
        return ZOHO.CRM.UI.Popup.closeReload();
    } else {
        return ZOHO.CRM.UI.Popup.close();
    }
}

function toggleLoading() {
    $("body").toggleClass("loading");
}

function initializeWidget() {
    ZOHO.embeddedApp.on("PageLoad", function (record) {
        console.log("Zoho Page loading....")
        recordId = record.EntityId;
        recordModule = record.Entity;
        ButtonPosition = record.ButtonPosition;

        // Get all the field names for this module
        ZOHO.CRM.META.getFields({
            Entity: recordModule
        }).then(function (data) {
            console.log(JSON.stringify(data));
            toggleLoading();
            data.fields.forEach(function (field) {
                addListItem("record-fields", field.field_label, recordModule + "__" + field.api_name, null);
            });
        })

        // Get all the SMS templates
        ZOHO.CRM.API.getAllRecords({
            Entity: "yamessenger__SMS_Templates",
            sort_order: "desc",
            per_page: 50,
            page: 1
        }).then(function (data) {
            console.log(JSON.stringify(data));
            smsTemplates = data.data;
            smsTemplates.forEach(function (template) {
                addListItem("sms-templates", template.Name, template.yamessenger__Text, template.id);
            });
        })

        // Get all the sender ids
        ZOHO.CRM.API.getAllRecords({
            Entity: "yamessenger__SMS_SenderIds",
            sort_order: "desc",
            per_page: 50,
            page: 1
        }).then(function (data) {
            console.log(JSON.stringify(data));
            smsSenderIds = data.data;
            smsSenderIds.forEach(function (senderId) {
                if (senderId.Name == null || senderId.Name == "") {
                    senderId.Name = senderId.smsmagic4__SenderId;
                }
                addListItem("sms-sender-ids", senderId.Name, senderId.yamessenger__Sende_Id, null);
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
}