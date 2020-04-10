var recordId;
var recordModule;
var ButtonPosition;
var smsTemplates;
var records = []
var currentUser;
var accountId;
var crmApiKey;
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
    } else if (menudId == "sms-sender-ids") {
        funcName = "insertSenderId";
    } else {
        funcName = "selectPhoneField";
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
            phoneFields = [];
            data.fields.forEach(function (field) {
                addListItem("record-fields", field.field_label, recordModule + "__" + field.api_name, null);
                if (field.field_label.toLowerCase().includes('phone') || field.field_label.toLowerCase().includes('mobile')){
                    addListItem("phone-fields", field.field_label, field.api_name, null);
                }
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

         // Get org detais
         ZOHO.CRM.API.getOrgVariable("yamessenger__apiKey").then(function(data){
            console.log("yamessenger__apiKey:: " + JSON.stringify(data));
            crmApiKey = data.Success.Content;
        });
         // Get org detais
         ZOHO.CRM.API.getOrgVariable("yamessenger__account_id").then(function(data){
            console.log("yamessenger__account_id:: " + JSON.stringify(data));
            accountId = data.Success.Content;
        });

        ZOHO.CRM.CONFIG.getCurrentUser().then(function(data){
            console.log("Current User:: " + JSON.stringify(data));
            currentUser = {'id': data.users[0]['id'], 'name': data.users[0]['email']}
        });     
        
        recordId.forEach(function(itemId){
            ZOHO.CRM.API.getRecord({Entity:recordModule,RecordID:itemId})
            .then(function(data){
                records.push(data.data[0]);
            });
         });
    });

    ZOHO.embeddedApp.init();
}

function collateData(){
    modulename = recordModule;
    user = {'id': currentUser.id, 'name': 'ankita.sinha0423@gmail.com'};
    senderId = $('#selected-sender-id').val();
    accountId = $('#account-id').text();
    apiKey = $('#apikey').text();;
    messages = [];
    records.forEach(function(record){
        messages.push({
            'mobilenumber': record[$('#selected-phone-field').text()],
            'recordId': record['id'],
            'text': $('#message-text').val()
        })
    });
    return createMessagePayload(modulename, user, senderId, accountId, apiKey, messages)
}

function createMessagePayload(modulename, user, senderId, accountId, apikey, messages) {
    var xmlDocument = $.parseXML('<m:Library xmlns:m="http://www.screen-magic.com" xmlns="http://www.defns.com" />');
    var usernameElem = xmlDocument.createElement('username');
    var senderidElem = xmlDocument.createElement('senderid');
    var accountidElem = xmlDocument.createElement('accountid');
    var apikeyElem = xmlDocument.createElement('apikey');    
    usernameElem.textContent = user.name;
    usernameElem.setAttribute('userid', user.id);
    senderidElem.textContent = senderId;
    accountidElem.textContent = accountId;
    apikeyElem.textContent = apikey;
    xmlDocument.documentElement.appendChild(usernameElem);
    xmlDocument.documentElement.appendChild(senderidElem);
    xmlDocument.documentElement.appendChild(accountidElem);
    xmlDocument.documentElement.appendChild(apikeyElem);
    messages.forEach(function(sms){
        var messageElem = xmlDocument.createElement('message');
        messageElem.textContent = sms.text;
        messageElem.setAttribute('mobilenumber', sms.mobilenumber);
        messageElem.setAttribute('modulename', modulename);
        messageElem.setAttribute('recordId', sms.recordId);
        xmlDocument.documentElement.appendChild(messageElem);
    }); 
    payload = xmlDocument.documentElement.outerHTML  
    return payload;  
}

function sendMessage(payload){
    payload = payload.replace(/xmlns=""/g, "").replace(/"/g, "'");
    var request = {
        url : "https://api.sms-magic.com/v1/smsgateway/post",
        params:{text: payload}
   }
   toggleLoading();
   ZOHO.CRM.HTTP.post(request)
   .then(function(data){
       toggleLoading();
       console.log(data)
   })
}