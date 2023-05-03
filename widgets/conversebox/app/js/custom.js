var recordId;
var recordModule;
var recordName;
var ownerName;

$(document).ready(function () {
  var messageTemplate = Handlebars.compile($("#message-template").html());
  var messageResponseTemplate = Handlebars.compile(
    $("#message-response-template").html()
  );
  var chatHistory = $(".chat-history");
  var chatHistoryList = chatHistory.find("ul");

  ZOHO.embeddedApp.on("PageLoad", function (record) {
    console.log("Zoho Page loading....");
    recordId = record.EntityId;
    recordModule = record.Entity;
    ZOHO.CRM.API.getRecord({
      Entity: record.Entity,
      RecordID: recordId,
    }).then(function (data) {
      console.log("All records: " + JSON.stringify(data, null, 2));
      record = data.data[0];
      recordName = record.Full_Name;
      ownerName = record.Owner.name;
      ZOHO.CRM.API.searchRecord({
        Entity: "smsmagic4__SMS_History",
        Type: "criteria",
        Query: `(smsmagic4__Lead:equals:${recordId})`,
        sort_by: "Created_Time",
        sort_order: "asc",
      }).then(function (data) {
        console.log("All records: " + JSON.stringify(data, null, 2));
        let records = data.data;
        records.sort(function(a, b){return a.Created_Time > b.Created_Time? 1: -1;});
        records.forEach(function (message) {
          direction = message.smsmagic4__Direction;
          text = message.smsmagic4__Text;
          createdTime = $.format.date(message.Created_Time, 'MM/dd/yyyy hh:mm:ss a');
          if (direction === "IN") {
            let context = {
              author: recordName,
              message: text,
              time: createdTime
            };
            chatHistoryList.append(messageResponseTemplate(context));
          } else {
            let context = {
              author: ownerName,
              message: text,
              time: createdTime
            };
            chatHistoryList.append(messageTemplate(context));
          }
        });
        chatHistory.scrollTop(chatHistory[0].scrollHeight);
      });
    });
  });
  ZOHO.embeddedApp.init();
});
