// test = {
//     "EntityId": ["99643000000125354", "99643000000125353", "99643000000125352", "99643000000125351", "99643000000125350", "99643000000125349", "99643000000125348", "99643000000125347", "99643000000125346", "99643000000125345"],
//     "Entity": "Leads",
//     "ButtonPosition": "ListView"
// }

// test =  {
//     "EntityId":["99643000000125354"],
//     "Entity":"Leads",
//     "ButtonPosition":"DetailView"
// }
// templates = {
//     "data":[
//        {
//           "$approval":{
//              "delegate":false,
//              "approve":false,
//              "reject":false,
//              "resubmit":false
//           },
//           "Owner":{
//              "name":"Lamda",
//              "id":"99643000000122001",
//              "email":"lamdasky@gmail.com"
//           },
//           "Modified_Time":"2020-03-22T08:27:50+05:30",
//           "$currency_symbol":"$",
//           "Created_Time":"2020-03-22T08:27:50+05:30",
//           "$photo_id":null,
//           "clickatellsmscrm__Message":"hi ${Leads.First Name}, this is a sample message.",
//           "$review_process":null,
//           "$editable":true,
//           "$orchestration":null,
//           "Name":"Sample SMS template for Leads",
//           "clickatellsmscrm__Module_Name":"Leads",
//           "Record_Image":null,
//           "Modified_By":{
//              "name":"Lamda",
//              "id":"99643000000122001",
//              "email":"lamdasky@gmail.com"
//           },
//           "$review":null,
//           "$state":"save",
//           "$process_flow":false,
//           "$status":"c_46",
//           "id":"99643000000128200",
//           "Created_By":{
//              "name":"Lamda",
//              "id":"99643000000122001",
//              "email":"lamdasky@gmail.com"
//           },
//           "$approved":true
//        }
//     ],
//     "info":{
//        "per_page":200,
//        "count":1,
//        "page":1,
//        "more_records":false
//     },
//     "$responseHeaders":{
//        "x-ratelimit-remaining":null,
//        "x-ratelimit-limit":null,
//        "x-ratelimit-reset":null
//     }
//  }
var recordId;
var recordModule;
var ButtonPosition;
var smsTemplates;
var templateId;
var scheduledTime;
var Mobile;
var func_name;

document.addEventListener("DOMContentLoaded", function (event) {

    ZOHO.embeddedApp.on("PageLoad", function (record) {
        recordId = record.EntityId;
        recordModule = record.Entity;
        ButtonPosition = record.ButtonPosition;
        selectModule(recordModule);

        // Get all the field names for this module
        ZOHO.CRM.META.getFields({
            Entity: recordModule
        }).then(function (data) {
            data.fields.forEach(function (field) {
                addListItem("record-fields", field.field_label, recordModule + "__" + field.api_name);
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
                addListItem("sms-templates", template.Name, template.smsmagic4__Text);
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
                addListItem("sms-sender-ids", senderId.Name, senderId.smsmagic4__SenderId);
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

    ZOHO.embeddedApp.init().then(function () {
        ZOHO.CRM.API.getOrgVariable("smsmagic4__smsmagicApiKey").then(function (apiKey) {
            if (apiKey && apiKey.Success && apiKey.Success.Content == "") {
                showError("Please enter your SMS Magic Api Key in extension configuration page.");
            }
        });
    });
});


const el = document.getElementById('emailContentEmail');

el.addEventListener('paste', (e) => {
    // Get user's pasted data
    let data = e.clipboardData.getData('text/html') ||
        e.clipboardData.getData('text/plain');

    // Filter out everything except simple text and allowable HTML elements
    let regex = /<(?!(\/\s*)?()[>,\s])([^>])*>/g;
    data = data.replace(regex, '');

    // Insert the filtered content
    document.execCommand('insertHTML', false, data);

    // Prevent the standard paste behavior
    e.preventDefault();
});
var content_id = 'emailContentEmail';
max = 2000;
//binding keyup/down events on the contenteditable div
$('#' + content_id).keyup(function (e) {
    check_charcount(content_id, max, e);
});
$('#' + content_id).keydown(function (e) {
    check_charcount(content_id, max, e);
});

function check_charcount(content_id, max, e) {
    if (e.which != 8 && $('#' + content_id).text().length > max) {
        document.getElementById("ErrorText").innerText = "Message should be within 2000 characters.";
        document.getElementById("Error").style.display = "block";
        // document.getElementById("ErrorText").style.color="red";
        setTimeout(function () {
            document.getElementById("Error").style.display = "none";
        }, 1500);
        // $('#'+content_id).text($('#'+content_id).text().substring(0, max));
        e.preventDefault();
    }
}

function sendSMS() {
    var date = document.getElementById("datepicker").value;
    var time = document.getElementById("timeList").value;
    if (document.getElementById("emailContentEmail").innerText.length > 2000) {
        document.getElementById("ErrorText").innerText = "Message should be within 2000 characters.";
        document.getElementById("Error").style.display = "block";
        document.getElementById("Error").style.color = "red";
        setTimeout(function () {
            document.getElementById("Error").style.display = "none";
        }, 1500);
    } else if (scheduledTime && new Date(date + " " + time).getTime() < new Date().getTime()) {
        document.getElementById("ErrorText").innerText = "Schedule time should be in future.";
        document.getElementById("Error").style.display = "block";
    } else if (document.getElementById("emailContentEmail").innerText.replace(/\n/g, "").replace(/\t/g, "").replace(/ /g, "") == "") {
        document.getElementById("ErrorText").innerText = "Message cannot be empty.";
        document.getElementById("Error").style.display = "block";
        setTimeout(function () {
            document.getElementById("Error").style.display = "none";
        }, 1500);
    } else if (func_name == "clickatellsmscrm__smshandler" && (Mobile == null || Mobile == "")) {
        document.getElementById("ErrorText").innerText = "Mobile field is empty.";
        document.getElementById("Error").style.display = "block";
    } else {
        var notes = "";
        if (func_name == "clickatellsmscrm__bulksms") {
            notes = "\n(" + recordModule + " without mobile number will be ignored.)"
        }
        document.getElementById("ErrorText").innerText = "Sending... " + notes;
        document.getElementById("Error").style.display = "block";
        var message = document.getElementById("emailContentEmail").innerText;
        if (func_name == "clickatellsmscrm__smshandler") {
            recordId = recordId[0];
        }
        var req_data = {
            "arguments": JSON.stringify({
                "action": "sendSMS",
                "message": message,
                "recordModule": recordModule,
                "scheduledTime": scheduledTime,
                "templateId": templateId,
                "recordId": recordId,
                "to": Mobile
            })
        };

        ZOHO.CRM.FUNCTIONS.execute(func_name, req_data)
            .then(function (data) {
                if (data.details.output == "Your SMS has been sent successfully.") {
                    document.getElementById("ErrorText").innerHTML = '<div class="material-icons" style="float:left;">check</div><div style="float:left;padding-left:5px;">' + data.details.output + '</div>';
                    setTimeout(function () {
                        ZOHO.CRM.UI.Popup.closeReload();
                    }, 3000);
                } else {
                    document.getElementById("ErrorText").innerHTML = data.details.output;
                    setTimeout(function () {
                        ZOHO.CRM.UI.Popup.close();
                    }, 3000);
                }
            });
    }
}

function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en'
    }, 'google_translate_element');
}

function addListItem(id, text, className, value) {
    if (className == "dropdown-item") {
        var linode = '<li class="' + className + '"><button class="' + className + '" onclick="insert(this)">' + text + '<input type="hidden" value="' + value + '"></button></li>';
    } else {
        var linode = '<li class="' + className + '">' + text + '</li>';
    }
    $('#' + id).append(linode);

}

function styling(tag) {
    document.execCommand(tag);
}

function link() {
    $("#linkForm").slideToggle("slow");
}

function image() {
    $("#imageForm").slideToggle("slow");
}