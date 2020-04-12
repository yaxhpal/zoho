var recordId;
var recordModule;
var ButtonPosition;
var smsTemplates;
var records = []
var currentUser;
var accountId;
var crmApiKey;
var requestTimeout;

$(document).ready(function () {
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
});

function validateSMS() {
    senderId = $('#sms-sender-ids').select2('data');
    phoneField = $('#phone-fields').select2('data');
    text = $('#message-text').val();
    debugger
    if (senderId == undefined || senderId[0].id == "") {
        $('#form-error-message').text("Please select valid sender id.");
        $('#form-error-alert').show();
        return false;
    }

    if (phoneField == undefined || phoneField[0].id == "") {
        $('#form-error-message').text("Please select valid phone field.");
        $('#form-error-alert').show();
        return false;
    }

    if (text == undefined || text.replace(/\n/g, '').replace(/\t/g, '').replace(/ /g, '') == "") {
        $('#form-error-message').text("Message can not be empty.");
        $('#form-error-alert').show();
        return false;
    }
    return true;
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

function applyMergeField(text, record) {
    allmatches = [...text.matchAll(/\$\{([^{]+)\}/g)];
    allmatches.forEach(function (fieldmatch) {
        fieldValue = record[fieldmatch[1]] || "";
        if (fieldmatch[0].includes('Time')) {
            fieldValue = $.format.date(fieldValue, 'MM/dd/yyyy hh:mm:ss a');
        }
        text = text.replace(fieldmatch[0], fieldValue);
    })
    return text;
}

function collateDataV2() {
    modulename = recordModule;
    user = {
        'id': currentUser.id,
        'name': currentUser.name
    };
    senderId = $('#sms-sender-ids').select2('data')[0].id;
    accountId = $('#account-id').text();
    apiKey = $('#apikey').text();;
    messages = [];
    records.forEach(function (record) {
        messages.push({
            'mobilenumber': record[$('#phone-fields').select2('data')[0].id],
            'recordId': record['id'],
            'text': applyMergeField($('#message-text').val(), record)
        })
    });
    return createJsonPayload(modulename, user, senderId, accountId, apiKey, messages)
}

function createJsonPayload(modulename, user, senderId, accountId, apikey, messages) {
    payload = {
        "account": {"id": accountId, "senderId": senderId, "apiKey":  apikey, "source": 3005},
        "messages": [],
        "zoho": {"module": modulename, "recordCount": messages.length, "user": { "email": user.name, "id": user.id}}
      };
      messages.forEach(function (sms) {
            message = { "mobileNumber": sms.mobilenumber, "text": sms.text, "recordId": sms.recordId};
            payload['messages'].push(message);
      });
      return payload
}

function sendMessageV2(payload) {
    if (validateSMS()) {
        var request = {
            url: "https://ptsv2.com/t/qk035-1580415095/post",
            headers:{"Content-Type": "application/json", 'Accept-Encoding': 'gzip, deflate, br'},
            body: payload
        }
        // console.log("Request: " + JSON.stringify(request));
        toggleLoading();
        ZOHO.CRM.HTTP.post(request)
            .then(function (data) {
                toggleLoading();
                console.log(data)
        });
    } else {
        console.log('ERROR: Can not send message as input params are invalid.')
    }
}