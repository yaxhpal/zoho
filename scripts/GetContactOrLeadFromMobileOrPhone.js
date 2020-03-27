/ +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ 
//  Method Signature: void attachContactOrLead(String mobilenumber, String target_record_id)
//  This method searches Contact or Lead based on given mobile number. The search is done on both
//  Phone as well as Mobile fields. If a match is found then it is attached to given module's either
//  Contact or Lead lookup fields
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// All specific Constants here 
info sms_history;
MODULE_TO_BE_UPDATED = "smsmagic4__SMS_History";
LEAD_LOOKUP_FIELD = "smsmagic4__Lead";
CONTACT_LOOKUP_FIELD = "smsmagic4__Contact";
target_record_id = sms_history.get("smsmagic4__SMS_History.ID");
info "History record id: " + target_record_id;
mobile_number = sms_history.get("smsmagic4__MobileNumber");
info "Mobile Number is: " + mobile_number;
// Get the contacts from given mobile/phone number 
response = zoho.crm.searchRecords("Contacts","(Phone:equals:" + mobile_number + ")");
info response;
if(response.isEmpty())
{
	info "Could not find contact using Phone field, searching with Mobile field...";
	response = zoho.crm.searchRecords("Contacts","(Mobile:equals:" + mobile_number + ")");
}
field_to_be_updated = "";
info response;
if(response.isEmpty())
{
	info "No matching contact record found. Searching Leads";
	response = zoho.crm.searchRecords("Leads","(Phone:equals:" + mobile_number + ")");
	if(response.isEmpty())
	{
		info "Could not find lead using Phone field, searching with Mobile field...";
		response = zoho.crm.searchRecords("Leads","(Mobile:equals:" + mobile_number + ")");
	}
	if(response.isEmpty())
	{
		info "Could not find any contact or lead with given mobile number: " + mobile_number;
		return;
	}
	else
	{
		field_to_be_updated = LEAD_LOOKUP_FIELD;
		record_id = response.get(0).get("id");
		info "Found lead with id: " + record_id;
	}
}
else
{
	field_to_be_updated = CONTACT_LOOKUP_FIELD;
	record_id = response.get(0).get("id");
	info "Found contact with id: " + record_id;
}
if(isBlank(target_record_id))
{
	info "Module record id can not be blank. Exiting...";
	return;
}
else
{
	info "Updating module: " + MODULE_TO_BE_UPDATED + " record with id: " + target_record_id;
	params = Map();
	params.put(field_to_be_updated,record_id.toLong());
	response = zoho.crm.updateRecord(MODULE_TO_BE_UPDATED,target_record_id.toLong(),params);
	if("Error".equalsIgnoreCase(response.get("status")))
	{
		info "Failed to update record: " + response.get("message");
	}
	else
	{
		info "Hurray! record updated successfully.";
	}
}
