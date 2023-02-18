allIds = List();
info pipeline;
contacts = zoho.bigin.getRelatedRecords("Contact_Name","Deals",pipeline.get("Deals.ID"),Map(),"smsmagicbigin__connect");
info contacts;
if(contacts.isEmpty() || contacts.get("status") == "error")
{
	info "Contacts not found";
}
else
{
	for each  item in contacts
	{
		allIds.add(item.get("id"));
		info item;
	}
}
contacts = zoho.bigin.getRelatedRecords("Secondary_Contacts","Deals",pipeline.get("Deals.ID"),Map(),"smsmagicbigin__connect");
info contacts;
if(contacts.isEmpty() || contacts.get("status") == "error")
{
	info "Secondary Contacts not found";
}
else
{
	for each  item in contacts
	{
		allIds.add(item.get("id"));
		info item;
	}
}
info contacts;
appUrl = "https://app.sms-magic.com/app/#/zoho-send-sms?recordIds=" + allIds.toString() + "&phoneField=Phone&objectName=Contacts&productName=bigin";
openUrlResponse = openUrl(appUrl,"new window");
return "";
