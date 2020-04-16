target_record_id = "99643000000226200";
mobile_number = "663-673-2688";
// sms_history = Map();
MODULE_TO_BE_UPDATED = "smsmagic4__SMS_History";
LEAD_LOOKUP_FIELD = "smsmagic4__Lead";
CONTACT_LOOKUP_FIELD = "smsmagic4__Contact";
// target_record_id = sms_history.get("smsmagic4__SMS_History.ID");
// mobile_number = sms_history.get("smsmagic4__MobileNumber");
field_to_be_updated = null;
record_id = null;
phone_criteria = List();
mobile_criteria = List();
for each index position in {0,1,2,3}
{
	item = mobile_number.subString(position);
	phone_criteria.add("(Phone:equals:" + item + ")");
	phone_criteria.add("(Phone:equals:0" + item + ")");
	mobile_criteria.add("(Mobile:equals:" + item + ")");
	mobile_criteria.add("(Mobile:equals:0" + item + ")");
}
phone_criteria_str = toString(phone_criteria, " or ");
mobile_criteria_str = toString(mobile_criteria, " or ");
info phone_criteria_str;
response = zoho.crm.searchRecords("Contacts",phone_criteria_str);
if(response.isEmpty())
{
	response = zoho.crm.searchRecords("Contacts",mobile_criteria_str);
	if(response.isEmpty())
	{
		response = zoho.crm.searchRecords("Leads",phone_criteria_str);
		if(response.isEmpty())
		{
			response = zoho.crm.searchRecords("Leads",mobile_criteria_str);
			if(response.isEmpty())
			{
				info "Not found";
				return "";
			}
			else
			{
				field_to_be_updated = LEAD_LOOKUP_FIELD;
				record_id = response.get(0).get("id");
			}
		}
		else
		{
			field_to_be_updated = LEAD_LOOKUP_FIELD;
			record_id = response.get(0).get("id");
		}
	}
	else
	{
		field_to_be_updated = CONTACT_LOOKUP_FIELD;
		record_id = response.get(0).get("id");
	}
}
else
{
	field_to_be_updated = CONTACT_LOOKUP_FIELD;
	record_id = response.get(0).get("id");
}
if(field_to_be_updated != null && record_id != null && target_record_id != null)
{
	params = Map();
	params.put(field_to_be_updated,record_id.toLong());
	response = zoho.crm.updateRecord(MODULE_TO_BE_UPDATED,target_record_id.toLong(),params);
	info response;
}
return "";
