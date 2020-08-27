// Delay the execution as mapping of Lead or Contact might not happen immediately
// - Mapping happening my SMS Magic Sync logic OR
// - By Worklow at Zoho CRM Side (We need delay for this)
for each  x in {1,2,3,4,5,6,7,8,9,10}
{
	response = invokeurl
	[
		url :"https://www.google.com/search?q=screenmagic+zoho&t=" + x
		type :GET
	];
}
info sms_history;
target_record_id = sms_history.get("smsmagic4__SMS_History.ID");
if(target_record_id == null)
{
	target_record_id = sms_history.get("smsmagic4.SMS_History.ID");
}
info target_record_id;
if(target_record_id != null)
{
	sms_history_record = zoho.crm.getRecordById("smsmagic4__SMS_History",target_record_id);
	lead_record = sms_history_record.get("smsmagic4__Lead");
	contact_record = sms_history_record.get("smsmagic4__Contact");
	lookup_module = null;
	if(lead_record != null)
	{
		lookup_module = "Leads";
		lookup_record = lead_record;
	}
	else if(contact_record != null)
	{
		lookup_module = "Contacts";
		lookup_record = contact_record;
	}
	info lookup_module;
	info lookup_record;
	direction = sms_history_record.get("smsmagic4__Direction");
	info direction;
	if(lookup_module != null && direction == "IN")
	{
		signalMap = Map();
		lookup_record = zoho.crm.getRecordById(lookup_module,lookup_record.get("id"));
		contact_email = lookup_record.get('Email');
		contact_phone = lookup_record.get('Phone');
		contact_mobile = lookup_record.get('Mobile');
		contact_name = lookup_record.get("name");
		if(!contact_email.isNull())
		{
			signalMap.put("email",contact_email);
		}
		if(!contact_phone.isNull())
		{
			signalMap.put("Phone",contact_phone);
		}
		if(!contact_mobile.isNull())
		{
			signalMap.put("Mobile",contact_mobile);
		}
		signalMap.put("signal_namespace","smsmagic4.incomingmessage");
		signalMap.put("message",sms_history_record.get("smsmagic4__Text"));
		signalMap.put("subject","Sent a message");
		actionsList = List();
		actionMap = Map();
		actionMap.put("type","link");
		actionMap.put("display_name","View Message.");
		actionMap.put("url","/crm/EntityInfo.do?module=CustomModule1&id=" + target_record_id);
		actionsList.add(actionMap);
		signalMap.put("actions",actionsList);
		result = zoho.crm.invokeConnector("raisesignal",signalMap);
		info result;
	}
}
