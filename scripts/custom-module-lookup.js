MODULE_TO_BE_UPDATED = "smsmagic4__SMS_History";
LOOKUP_MODULE = "Deals";
LOOKUP_FIELD = "Deal";
PHONE_FIELD = "Mobile";
phone_list = {mobile_number,mobile_number.subString(1),mobile_number.subString(2),mobile_number.subString(3), mobile_number.subString(4)};
record_id = "";
is_record_found = False;
for each  mobile in phone_list
{
   response = zoho.crm.searchRecords(LOOKUP_MODULE,"("+PHONE_FIELD+":equals:"+mobile + ")");
   for each  deal in response
   {
	record_id = deal.get("id");
	info "Found deal with id: " + record_id;
	is_record_found = True;
	break;
   }
   
   response = zoho.crm.searchRecords(LOOKUP_MODULE,"("+PHONE_FIELD+":equals:0"+mobile + ")");
   for each  deal in response
   {
	record_id = deal.get("id");
	info "Found deal with id: " + record_id;
	is_record_found = True;
	break;
   }	
	
   if(is_record_found)
   {
	break;
   }
}


if(is_record_found) 
{
   info "Updating module: " + MODULE_TO_BE_UPDATED + " record with id: " + target_id;
   info "Updating lookup field: " + LOOKUP_FIELD + " with id: " + record_id;
   params = Map(); 
   params.put(LOOKUP_FIELD,record_id.toLong());
   response= zoho.crm.updateRecord(MODULE_TO_BE_UPDATED,target_id.toLong(),params);
   
   if("Error".equalsIgnoreCase(response.get("status")))
   {
	info "Failed to update record: " + response.get("message");
   }
   else
   {
   	info "Hurray! record updated successfully.";
   }
}
