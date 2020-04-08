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



// const el = document.getElementById('emailContentEmail');

// el.addEventListener('paste', (e) => {
//     // Get user's pasted data
//     let data = e.clipboardData.getData('text/html') ||
//         e.clipboardData.getData('text/plain');

//     // Filter out everything except simple text and allowable HTML elements
//     let regex = /<(?!(\/\s*)?()[>,\s])([^>])*>/g;
//     data = data.replace(regex, '');

//     // Insert the filtered content
//     document.execCommand('insertHTML', false, data);

//     // Prevent the standard paste behavior
//     e.preventDefault();
// });
// var content_id = 'emailContentEmail';
// max = 2000;
// //binding keyup/down events on the contenteditable div
// $('#' + content_id).keyup(function (e) {
//     check_charcount(content_id, max, e);
// });
// $('#' + content_id).keydown(function (e) {
//     check_charcount(content_id, max, e);
// });

// function check_charcount(content_id, max, e) {
//     if (e.which != 8 && $('#' + content_id).text().length > max) {
//         document.getElementById("ErrorText").innerText = "Message should be within 2000 characters.";
//         document.getElementById("Error").style.display = "block";
//         // document.getElementById("ErrorText").style.color="red";
//         setTimeout(function () {
//             document.getElementById("Error").style.display = "none";
//         }, 1500);
//         // $('#'+content_id).text($('#'+content_id).text().substring(0, max));
//         e.preventDefault();
//     }
// }

// function sendSMS() {
//     var date = document.getElementById("datepicker").value;
//     var time = document.getElementById("timeList").value;
//     if (document.getElementById("emailContentEmail").innerText.length > 2000) {
//         document.getElementById("ErrorText").innerText = "Message should be within 2000 characters.";
//         document.getElementById("Error").style.display = "block";
//         document.getElementById("Error").style.color = "red";
//         setTimeout(function () {
//             document.getElementById("Error").style.display = "none";
//         }, 1500);
//     } else if (scheduledTime && new Date(date + " " + time).getTime() < new Date().getTime()) {
//         document.getElementById("ErrorText").innerText = "Schedule time should be in future.";
//         document.getElementById("Error").style.display = "block";
//     } else if (document.getElementById("emailContentEmail").innerText.replace(/\n/g, "").replace(/\t/g, "").replace(/ /g, "") == "") {
//         document.getElementById("ErrorText").innerText = "Message cannot be empty.";
//         document.getElementById("Error").style.display = "block";
//         setTimeout(function () {
//             document.getElementById("Error").style.display = "none";
//         }, 1500);
//     } else if (func_name == "clickatellsmscrm__smshandler" && (Mobile == null || Mobile == "")) {
//         document.getElementById("ErrorText").innerText = "Mobile field is empty.";
//         document.getElementById("Error").style.display = "block";
//     } else {
//         var notes = "";
//         if (func_name == "clickatellsmscrm__bulksms") {
//             notes = "\n(" + recordModule + " without mobile number will be ignored.)"
//         }
//         document.getElementById("ErrorText").innerText = "Sending... " + notes;
//         document.getElementById("Error").style.display = "block";
//         var message = document.getElementById("emailContentEmail").innerText;
//         if (func_name == "clickatellsmscrm__smshandler") {
//             recordId = recordId[0];
//         }
//         var req_data = {
//             "arguments": JSON.stringify({
//                 "action": "sendSMS",
//                 "message": message,
//                 "recordModule": recordModule,
//                 "scheduledTime": scheduledTime,
//                 "templateId": templateId,
//                 "recordId": recordId,
//                 "to": Mobile
//             })
//         };

//         ZOHO.CRM.FUNCTIONS.execute(func_name, req_data)
//             .then(function (data) {
//                 if (data.details.output == "Your SMS has been sent successfully.") {
//                     document.getElementById("ErrorText").innerHTML = '<div class="material-icons" style="float:left;">check</div><div style="float:left;padding-left:5px;">' + data.details.output + '</div>';
//                     setTimeout(function () {
//                         ZOHO.CRM.UI.Popup.closeReload();
//                     }, 3000);
//                 } else {
//                     document.getElementById("ErrorText").innerHTML = data.details.output;
//                     setTimeout(function () {
//                         ZOHO.CRM.UI.Popup.close();
//                     }, 3000);
//                 }
//             });
//     }
// }