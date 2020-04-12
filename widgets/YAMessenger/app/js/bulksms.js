var recordId;
var recordModule;
var ButtonPosition;
var smsTemplates;
var records = []
var currentUser;
var accountId;
var crmApiKey;
var requestTimeout;

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
            // console.log(JSON.stringify(data));
            phoneFields = [];
            $('#record-fields').val(null).trigger('change');
            $('#phone-fields').val(null).trigger('change');
            data.fields.forEach(function (field) {
                newOption = new Option(field.field_label, field.api_name, false, false);
                $('#record-fields').append(newOption).trigger('change');
                if (["phone", "mobile"].some(el => field.api_name.toLowerCase().includes(el))) {
                    newOption = new Option(field.field_label, field.api_name, false, false);
                    $('#phone-fields').append(newOption).trigger('change');
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
            // console.log(JSON.stringify(data));
            smsTemplates = data.data;
            $('#sms-templates').val(null).trigger('change');
            smsTemplates.forEach(function (template) {
                newOption = new Option(template.Name, template.id, false, false);
                $('#sms-templates').append(newOption).trigger('change');
                $('#value-cache').append('<textarea id="' + template.id + '">' + template.yamessenger__Text + '</textarea>');
            });
        })

        // Get all the sender ids
        ZOHO.CRM.API.getAllRecords({
            Entity: "yamessenger__SMS_SenderIds",
            sort_order: "desc",
            per_page: 50,
            page: 1
        }).then(function (data) {
            // console.log(JSON.stringify(data));
            smsSenderIds = data.data;
            $('#sms-sender-ids').val(null).trigger('change');
            smsSenderIds.forEach(function (senderId) {
                if (senderId.yamessenger__Active) {
                    if (senderId.Name == null || senderId.Name == "") {
                        senderId.Name = senderId.yamessenger__Sende_Id;
                    } else {
                        senderId.Name = senderId.Name + ' (' + senderId.yamessenger__Sende_Id + ')';
                    }
                    newOption = new Option(senderId.Name, senderId.yamessenger__Sende_Id, false, false);
                    $('#sms-sender-ids').append(newOption).trigger('change');
                }
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

        // Get API Key for YAMessenger
        ZOHO.CRM.API.getOrgVariable("yamessenger__apiKey").then(function (data) {
            console.log("yamessenger__apiKey:: " + JSON.stringify(data));
            crmApiKey = data.Success.Content;
        });

        // Get Account ID for YAMessenger
        ZOHO.CRM.API.getOrgVariable("yamessenger__account_id").then(function (data) {
            console.log("yamessenger__account_id:: " + JSON.stringify(data));
            accountId = data.Success.Content;
        });

        // Get current Zoho CRM user information
        ZOHO.CRM.CONFIG.getCurrentUser().then(function (data) {
            // console.log("Current User:: " + JSON.stringify(data));
            currentUser = {
                'id': data.users[0]['id'],
                'name': data.users[0]['email']
            }
        });

        // Get all the user 
        requestTimeout = 0;
        recordId.forEach(function (itemId) {
            setTimeout(getModuleRecord, requestTimeout, recordModule, itemId, requestTimeout);
            requestTimeout += 800;
        });
    });

    ZOHO.embeddedApp.init();
}

function getModuleRecord(moduleName, itemId, timeout) {
    console.log("Module: " + moduleName + " Record Id: " + itemId + " Timeout: " + timeout);
    ZOHO.CRM.API.getRecord({
            Entity: moduleName,
            RecordID: itemId
        })
        .then(function (data) {
            item = data.data[0];
            item['Owner'] = item['Owner']['name'];
            item['Modified_By'] = item['Modified_By']['name'];
            item['Created_By'] = item['Created_By']['name'];
            records.push(item);
            if (timeout == 800 * (recordId.length - 1)) {
                toggleLoading();
            }
        });
}

function collateData() {
    modulename = recordModule;
    user = {
        'id': currentUser.id,
        'name': 'ankita.sinha0423@gmail.com'
    };
    senderId = $('#selected-sender-id').val();
    accountId = $('#account-id').text();
    apiKey = $('#apikey').text();;
    messages = [];
    records.forEach(function (record) {
        messages.push({
            'mobilenumber': record[$('#selected-phone-field').text()],
            'recordId': record['id'],
            'text': applyMergeField($('#message-text').val(), record)
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
    messages.forEach(function (sms) {
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

function applyMergeField(text, record) {
    allmatches = [...text.matchAll(/\$\{([^{.]+)\}/g)];
    allmatches.forEach(function (fieldmatch) {
        text = text.replace(fieldmatch[0], record[fieldmatch[1]] || "");
    })
    return text;
}

function sendMessage(payload) {
    payload = payload.replace(/xmlns=""/g, "").replace(/"/g, "'");
    var request = {
        url: "https://api.sms-magic.com/v1/smsgateway/post",
        params: {
            text: payload
        }
    }
    toggleLoading();
    ZOHO.CRM.HTTP.post(request)
        .then(function (data) {
            toggleLoading();
            console.log(data)
        })
}