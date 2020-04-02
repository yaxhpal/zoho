MODULE_TO_BE_UPDATED = "smsmagic4__SMS_History";
LOOKUP_FIELD = "smsmagic4__Lead";
LOOKUP_MODULE = "Leads";
PHONE_FIELD = "Mobile";
record_id = "";
is_record_found = False;
response = zoho.crm.searchRecords(LOOKUP_MODULE,"(" + PHONE_FIELD + ":equals:" + mobile_number + ")");
for each  lead in response
{
	record_id = lead.get("id").toLong();
	info "Found lead with id: " + record_id;
	is_record_found = True;
	break;
}
if(is_record_found)
{
	info "Updating module: " + MODULE_TO_BE_UPDATED + " record with id: " + target_id;
	info "Updating lookup field: " + LOOKUP_FIELD + " with id: " + record_id;
	params = Map();
	params.put(LOOKUP_FIELD,record_id);
	params.put('smsmagic4__Status','Success');
	response = zoho.crm.updateRecord(MODULE_TO_BE_UPDATED,target_id,params,{"trigger":{"workflow"}});
	if("Error".equalsIgnoreCase(response.get("status")))
	{
		info "Failed to update record: " + response.get("message");
	}
	else
	{
		info "Hurray! record updated successfully.";
	}
}
