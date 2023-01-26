message = {
   "userPayload":{"type":"api", "userId":"<USERID>", "apiKey":"<APIKEY>"},
   "messageDetails":[
      {
         "messageId":"<MESSAGEID>",
         "recipient":[{"channelType":"sms", "phone":"<PHONENUMBER>"}],
         "sender":{"channelType":"sms", "phone":"5555555555555"},
         "lookupObjects":[{"referenceType":"Leads", "referenceId":"<LEADID>"}],
         "source":"3000",
         "message":{
            "type":"text",
            "content":{
               "messageText":"Hi Anubhav, \n This is reminder message. Please book your appoint me at https://booking.com/xyz. \n Cheers, \n Team Magic"
            }
         }
      }
   ]
};
response = invokeurl
[
	url: "https://api.sms-magic.com/api/v2/message/send"
	type: POST
	parameters: message.toText()
	content-type: "application/json"
];
