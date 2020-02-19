// Required data
senderId = "16167104980";
apiKey = "fab0246db696e612b6147893690cbc3e";
accountId = "80023872";
userId = "yaxhpal@gmail.com";
// Get the targeted Deal Object
record = zoho.crm.getRecordById("Deals",deal_id);
// We only get comma separated vendor names from multi-lookup field. So,
// from names we are going to search all associated vendors
vendor_names = record.get('Vendors').toList(",");
info vendor_names;
sms_list = List();
for each  vendor_name in vendor_names
{
	vendor_records = zoho.crm.searchRecords("Vendors","Vendor_Name:equals:" + trim(vendor_name));
	// Now, from vedor records, we are going to get other details like phone field etc. 
	for each  record in vendor_records
	{
		sms_text = "<m:Library xmlns:m=\"http://www.screen-magic.com\" xmlns=\"http://www.defns.com\"><username>" + userId + "</username><senderid>" + senderId + "</senderid><accountid>" + accountId + "</accountid><apikey>" + apiKey + "</apikey><message mobilenumber=\"" + record.get("Phone") + "\" modulename=\"Vendor\" recordId=\"" + record.get('Id') + "\">" + "Hi Swanand!!" + "</message></m:Library>";
		sms_list.add(sms_text);
	}
}
// Now that we have SMSes list, lets send all SMSes one by one.
header = Map();
header.put("content-type","application/x-www-form-urlencoded");
header.put("cache-control","no-cache");
url = "https://api.sms-magic.com/v1/smsgateway/post";
for each  sms_text in sms_list
{
	smsMap = Map();
	smsMap.put("text",sms_text);
	response = invokeurl
	[
		url :url
		type :POST
		parameters:smsMap
		headers:header
	];
	info response;
	externalId = response.get('id');
	params = Map();
	params.put("External_Id", externalId);
	params.put("Deal_Id", deal_id);
	createResp = zoho.crm.createRecord("Deal_Texts",  params);
}