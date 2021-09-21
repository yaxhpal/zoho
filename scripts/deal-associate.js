MODULE_TO_BE_UPDATED = "smsmagic4__SMS_History";
LOOKUP_MODULE = "Deals";
LOOKUP_FIELD = "Deal";
PHONE_FIELD = "Contact_Phone";
recordLookup = Null;
recordLookupName = Null;

if(direction == "IN") {
	params = Map();
	params.put("sort_by","Created_Time");
	params.put("sort_order","desc");
	response = zoho.crm.getRecords("smsmagic4__SMS_History",1,200,params);
	for each item in response
	{
		if(recordLookup.isNull() && "OUT" == item.get("smsmagic4__Direction") &&  mobile_number.contains(item.get("smsmagic4__MobileNumber")))
		{
			info item;
			recordLookup = item.get(LOOKUP_FIELD);
			recordLookupName = LOOKUP_FIELD;
			break;
		}
	}

	info recordLookup;
	if(recordLookup.isNull())
	{
		mobile_criteria = List();
		for each index position in {0,1,2,3}
		{
			mobile_criteria.add("(smsmagic4__MobileNumber:equals:" + mobile_number.subString(position) + ")");
		}
		mobile_criteria_str = toString(mobile_criteria," or ");
		criteria = mobile_criteria_str + " and (smsmagic4__Direction:equals:OUT))";
		response = zoho.crm.searchRecords("smsmagic4__SMS_history",criteria,0,1,params);
		if(!response.isEmpty())
		{
			recordLookup = response.get(0).get(LOOKUP_FIELD);
			recordLookupName = LOOKUP_FIELD;
		}
	}
	if(!recordLookup.isNull())
	{
		info recordLookup;
		if(!recordLookup.isEmpty())
		{
			dealId = recordLookup.get('id');
			info dealId;
			updateParams = Map();
			updateParams.put(recordLookupName,dealId);
			response = zoho.crm.updateRecord("smsmagic4__SMS_history",historyRecordId,updateParams);
			info response;
		}
	}
}

if (recordLookup.isNull()) {
	phone_list = {
    	mobile_number,
    	mobile_number.subString(1),
    	mobile_number.subString(2),
    	mobile_number.subString(3),
    	mobile_number.subString(4)
    };
	record_id = "";
	is_record_found = False;
	for each Contact_Phone in phone_list {
	    response = zoho.crm.searchRecords(LOOKUP_MODULE, "(" + PHONE_FIELD + ":equals:" + Contact_Phone + ")");
	    for each deal in response {
	        record_id = deal.get("id");
	        info "Found deal with id: " + record_id;
	        is_record_found = True;
	        break;
	    }
	    if (is_record_found) {
	        break;
	    }
	}
	if (is_record_found) {
	    info "Updating module: " + MODULE_TO_BE_UPDATED + " record with id: " + target_id;
	    info "Updating lookup field: " + LOOKUP_FIELD + " with id: " + record_id;
	    params = Map();
	    params.put(LOOKUP_FIELD, record_id.toLong());
	    response = zoho.crm.updateRecord(MODULE_TO_BE_UPDATED, target_id.toLong(), params);
	    if ("Error".equalsIgnoreCase(response.get("status"))) {
	        info "Failed to update record: " + response.get("message");
	    } else {
	        info "Hurray! record updated successfully.";
	    }
	}
}
