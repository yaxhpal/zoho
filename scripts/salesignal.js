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
	lookup_record_id = 0;
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
	if(direction == "IN")
	{
		contact_email = zoho.crm.getRecordById(lookup_module,lookup_record.get("id")).get("Email");
		signalMap = Map();
		signalMap.put("signal_namespace","smsmagic4.incomingmessage");
		signalMap.put("message",sms_history_record.get("smsmagic4__Text"));
		signalMap.put("subject"," Sent a message.");
		signalMap.put("email",contact_email);
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

