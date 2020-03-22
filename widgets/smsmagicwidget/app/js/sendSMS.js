var emailContent = [];
var emailContentText = "";
var startIndex = 0;
var endIndex = 0;
var currentEditor = "";
var subject = "";
var sel;
var range;
var calendarsMap;
var recordId;
var recordModule;
var ButtonPosition;
var smsTemplates;
var templateId;
var scheduledTime;
var Mobile;
var func_name;
document.addEventListener("DOMContentLoaded", function (event) {
    var timeList = ["12:00 AM", "12:15 AM", "12:30 AM", "12:45 AM", "01:00 AM", "01:15 AM", "01:30 AM", "01:45 AM", "02:00 AM", "02:15 AM", "02:30 AM", "02:45 AM", "03:00 AM", "03:15 AM", "03:30 AM", "03:45 AM", "04:00 AM", "04:15 AM", "04:30 AM", "04:45 AM", "05:00 AM", "05:15 AM", "05:30 AM", "05:45 AM", "06:00 AM", "06:15 AM", "06:30 AM", "06:45 AM", "07:00 AM", "07:15 AM", "07:30 AM", "07:45 AM", "08:00 AM", "08:15 AM", "08:30 AM", "08:45 AM", "09:00 AM", "09:15 AM", "09:30 AM", "09:45 AM", "10:00 AM", "10:15 AM", "10:30 AM", "10:45 AM", "11:00 AM", "11:15 AM", "11:30 AM", "11:45 AM", "12:00 PM", "12:15 PM", "12:30 PM", "12:45 PM", "01:00 PM", "01:15 PM", "01:30 PM", "01:45 PM", "02:00 PM", "02:15 PM", "02:30 PM", "02:45 PM", "03:00 PM", "03:15 PM", "03:30 PM", "03:45 PM", "04:00 PM", "04:15 PM", "04:30 PM", "04:45 PM", "05:00 PM", "05:15 PM", "05:30 PM", "05:45 PM", "06:00 PM", "06:15 PM", "06:30 PM", "06:45 PM", "07:00 PM", "07:15 PM", "07:30 PM", "07:45 PM", "08:00 PM", "08:15 PM", "08:30 PM", "08:45 PM", "09:00 PM", "09:15 PM", "09:30 PM", "09:45 PM", "10:00 PM", "10:15 PM", "10:30 PM", "10:45 PM", "11:00 PM", "11:15 PM", "11:30 PM", "11:45 PM"];
    var timeOptions = "";
    timeList.forEach(function (time) {
        timeOptions = timeOptions + "<option  value='" + time + "'>" + time + "</option>"
    });
    // var cusotmerData = ["Owner", "Email", "$currency_symbol", "Other_Phone", "Mailing_State", "$upcoming_activity", "Other_State", "Other_Country", "Last_Activity_Time", "Department", "$process_flow", "Assistant", "Mailing_Country", "id", "$approved", "Reporting_To", "$approval", "Other_City", "Created_Time", "$editable", "Home_Phone", "$status", "Created_By", "Secondary_Email", "Description", "Vendor_Name", "Mailing_Zip", "$photo_id", "Twitter", "Other_Zip", "Mailing_Street", "Salutation", "First_Name", "Full_Name", "Asst_Phone", "Record_Image", "Modified_By", "Skype_ID", "Phone", "Account_Name", "Email_Opt_Out", "Modified_Time", "Date_of_Birth", "Mailing_City", "Title", "Other_Street", "Mobile", "Last_Name", "Lead_Source", "Tag", "Fax"];
    var cusotmerData = ["Contact Id", "Account Name", "Assistant", "Asst Phone", "Owner", "Created By", "Created Time", "Date of Birth", "Department", "Description", "Email", "Email Opt Out", "Fax", "First Name", "Full Name", "Home Phone", "Last Activity Time", "Last Name", "Lead Source", "Mailing City", "Mailing Country", "Mailing State", "Mailing Street", "Mailing Zip", "Mobile", "Modified By", "Modified Time", "Other City", "Other Country", "Other Phone", "Other State", "Other Street", "Other Zip", "Phone", "Record Image", "Reporting To", "Salutation", "Secondary Email", "Skype ID", "Title", "Twitter", "Vendor Name"];
    cusotmerData.forEach(function (field) {
        addListItem("dropdown-menu-email", field, "dropdown-item", "Contacts." + field);
    });
    var userData = ["First Name", "Last Name", "Email", "Role", "Profile", "Alias", "Phone", "Mobile", "Website", "Fax", "Date of Birth", "Online Status", "Street", "City", "State", "Zip Code", "Country"];
    userData.forEach(function (field) {
        addListItem("dropdown-menu-user", field, "dropdown-item", "Users." + field);
    });
    ZOHO.embeddedApp.on("PageLoad", function (record) {
        recordId = record.EntityId;
        recordModule = record.Entity;
        ButtonPosition = record.ButtonPosition;
        selectModule(recordModule);
        ZOHO.CRM.API.searchRecord({
                Entity: "smsmagic4__SMS_Templates",
                Type: "criteria",
                Query: "(smsmagic4__Module_Name:equals:" + recordModule + ")"
            })
            .then(function (data) {
                smsTemplates = data.data;
                var templateList = "";
                if (data.data) {
                    for (let i = 0; i < data.data.length; i++) {
                        templateList = templateList + '<li class="templateItem" id="' + data.data[i].id + '" onclick="showsms(this)"></li>';
                    }
                    $('#templateList').append(templateList);
                    if (templateList == "") {
                        $('#templateList').append('<li style="text-align:center;">No Templates</li>');
                    } else {
                        for (let i = 0; i < data.data.length; i++) {
                            document.getElementById(data.data[i].id).innerText = data.data[i].Name;
                        }
                    }

                } else {
                    $('#templateList').append('<li style="text-align:center;">No Templates</li>');
                }
                if (record.ButtonPosition == "DetailView") {
                    func_name = "clickatellsmscrm__smshandler";
                    ZOHO.CRM.API.getRecord({
                            Entity: recordModule,
                            RecordID: recordId[0]
                        })
                        .then(function (data) {
                            document.getElementById("loader").style.display = "none";
                            Mobile = data.data[0].Mobile;
                            if (data.data[0].Mobile == null || data.data[0].Mobile == "") {
                                document.getElementById("ErrorText").innerText = "Mobile field is empty.";
                                document.getElementById("Error").style.display = "block";
                            }
                        })

                } else {
                    document.getElementById("loader").style.display = "none";
                    func_name = "clickatellsmscrm__bulksms";
                }
            })
    });
    ZOHO.embeddedApp.init().then(function () {
        ZOHO.CRM.CONFIG.getOrgInfo().then(function (data) {
            console.log(data);
            $('#timeList').append(timeOptions);
            $('#datepicker').datepicker().datepicker('setDate', new Date());
            var date = document.getElementById("datepicker").value;
            var time = document.getElementById("timeList").value;
            document.getElementById("scheduledDateTime").innerText = new Date(date).toDateString() + " at " + time + " (" + Intl.DateTimeFormat().resolvedOptions().timeZone + ")";
        });

        ZOHO.CRM.API.getOrgVariable("clickatellsmscrm__clickatellApiKey").then(function (apiKey) {
            if (apiKey && apiKey.Success && apiKey.Success.Content == "") {
                document.getElementById("ErrorText").innerText = "Please enter your Clickatell api key in extension configuration page.";
                document.getElementById("Error").style.display = "block";
            }
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
});

function selectModule(module) {
    document.getElementById("moduleFields").innerText = "Insert " + module + " Fields";
    var customerData = [];
    if (module == "Leads") {
        customerData = ["Lead Id", "Annual Revenue", "City", "Company", "Country", "Created By", "Created Time", "Description", "Designation", "Email", "Email Opt Out", "Fax", "First Name", "Full Name", "Industry", "Last Activity Time", "Last Name", "Lead Source", "Lead Status", "Mobile", "Modified By", "Modified Time", "No of Employees", "Owner", "Phone", "Rating", "Record Image", "Salutation", "Secondary Email", "Skype ID", "State", "Street", "Tag", "Twitter", "Website", "Zip Code"]
    } else if (module == "Contacts") {
        customerData = ["Contact Id", "Account Name", "Assistant", "Asst Phone", "Owner", "Created By", "Created Time", "Date of Birth", "Department", "Description", "Email", "Email Opt Out", "Fax", "First Name", "Full Name", "Home Phone", "Last Activity Time", "Last Name", "Lead Source", "Mailing City", "Mailing Country", "Mailing State", "Mailing Street", "Mailing Zip", "Mobile", "Modified By", "Modified Time", "Other City", "Other Country", "Other Phone", "Other State", "Other Street", "Other Zip", "Phone", "Record Image", "Reporting To", "Salutation", "Secondary Email", "Skype ID", "Title", "Twitter", "Vendor Name"];
    }
    document.getElementById("dropdown-menu-email").innerHTML = "";
    customerData.forEach(function (field) {
        addListItem("dropdown-menu-email", field, "dropdown-item", module + "." + field);
    });
}

function updateOrgVariables(apiname, value, key) {

    if (apiname == "readreceipt__ulgebraApiKey") {
        document.getElementById("save").innerText = "Saving...";
        value = document.getElementById("apikey").value;
    } else {
        document.getElementById("ErrorText").innerText = "Saving...";
        document.getElementById("Error").style.display = "block";
    }
    ZOHO.CRM.CONNECTOR.invokeAPI("crm.set", {
        "apiname": apiname,
        "value": value
    }).then(function (res) {
        document.getElementById("ErrorText").innerText = "Saved";
        setTimeout(function () {
            document.getElementById("Error").style.display = "none";
        }, 500);
    });
}

function showsms(editor) {
    for (var i = 0; i < smsTemplates.length; i++) {
        if (smsTemplates[i].id == editor.id) {
            templateId = smsTemplates[i].id;
            document.getElementById("selectedTemplate").innerText = smsTemplates[i].Name;
            document.getElementById("tooltiptext").innerText = smsTemplates[i].Name;
            document.getElementById("emailContentEmail").innerText = smsTemplates[i].clickatellsmscrm__Message;
            break;
        }
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

function addLink() {
    var href = document.getElementById("linkUrl").value;
    if (range) {
        if (range.startOffset == range.endOffset) {
            if (range.commonAncestorContainer.parentNode.href) {
                range.commonAncestorContainer.parentNode.href = href;
            } else {
                var span = document.createElement('a');
                span.setAttribute('href', href);
                span.innerText = href;
                range.insertNode(span);
                range.setStartAfter(span);
            }
        } else {
            var data = range.commonAncestorContainer.data;
            var start = range.startOffset;
            var end = range.endOffset;
            range.commonAncestorContainer.data = "";
            var span = document.createElement('span');
            span.appendChild(document.createTextNode(data.substring(0, start)));
            var atag = document.createElement('a');
            atag.setAttribute('href', href);
            atag.innerText = data.substring(start, end);
            span.appendChild(atag);
            span.appendChild(document.createTextNode(data.substring(end)));
            range.insertNode(span);
            range.setStartAfter(span);
        }
        range.collapse(true);
    }
    $("#linkForm").slideToggle("slow");
}

function addImage() {
    var href = document.getElementById("imageUrl").value;
    var span = document.createElement('img');
    span.setAttribute('src', href);
    span.innerText = href;
    range.insertNode(span);
    range.setStartAfter(span);
    $("#imageForm").slideToggle("slow");
}

function openlink() {
    sel = window.getSelection();
    if (sel && sel.rangeCount) {
        range = sel.getRangeAt(0);
    }
    if (range && range.commonAncestorContainer.wholeText) {
        if (range.commonAncestorContainer.parentNode.href) {
            document.getElementById("linkUrl").value = range.commonAncestorContainer.parentNode.href;
            $("#linkForm").slideToggle("slow");
        }
    }
}

function insert(bookingLink) {
    // var bookingLink = this;
    var range;

    if (sel && sel.rangeCount && isDescendant(sel.focusNode)) {
        range = sel.getRangeAt(0);
        range.collapse(true);
        var span = document.createElement("span");
        span.appendChild(document.createTextNode('${' + bookingLink.children[0].value + '}'));
        range.insertNode(span);
        range.setStartAfter(span);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
    }
}

function isDescendant(child) {
    var parent = document.getElementById("emailContentEmail");
    var node = child.parentNode;
    while (node != null) {
        if (node == parent || child == parent) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}

function enableSchedule(element) {
    if (element.checked == true) {
        document.getElementById("send").innerText = "Schedule";
        var date = document.getElementById("datepicker").value;
        var time = document.getElementById("timeList").value;
        scheduledTime = new Date(date + " " + time).toISOString();
    } else {
        document.getElementById("send").innerText = "Send";
        scheduledTime = undefined;
    }
}

function openDatePicker() {
    document.getElementById("dateTime").style.display = "block";
    if (ButtonPosition == "DetailView") {
        document.getElementById("dateTime").style.top = "84%";
    } else {
        document.getElementById("dateTime").style.top = "60%";
    }
    document.getElementById("Error").style.display = "block";
}

function scheduleClose() {
    var date = document.getElementById("datepicker").value;
    var time = document.getElementById("timeList").value;
    if (new Date(date + " " + time).getTime() < new Date().getTime()) {
        document.getElementById("ErrorText").innerText = "Schedule time should be in future.";
    } else {
        document.getElementById("ErrorText").innerText = "";
        document.getElementById("dateTime").style.display = "none";
        document.getElementById("Error").style.display = "none";
        document.getElementById("scheduleCheck").checked = true;
        document.getElementById("send").innerText = "Schedule";
        document.getElementById("scheduledDateTime").innerText = new Date(date).toDateString() + " at " + time + " (" + Intl.DateTimeFormat().resolvedOptions().timeZone + ")";
        scheduledTime = new Date(date + " " + time).toISOString();
    }
}

function cancel() {
    document.getElementById("Error").style.display = "none";
}