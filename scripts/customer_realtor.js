LOOKUP_MODULE = "Contracts";
CUSTOMER_LOOKUP_FIELD = "Record";
REALTOR_LOOKUP_FIELD = "Realtors";
CUSTOM_SEARCH_FIELD = "Name";
if(direction == "OUT")
{
	idIndex = smsText.lastIndexOf("ZH");
	if(idIndex >= 0)
	{
		agentCode = smsText.subString(idIndex);
		response = zoho.crm.searchRecords(LOOKUP_MODULE,"(" + CUSTOM_SEARCH_FIELD + ":equals:" + agentCode + ")");
		if(!response.isEmpty())
		{
			agentId = response.get(0).get('id');
			agentPhone = response.get(0).get('Cell_Phone');
			realtorPhone = response.get(0).get('Buyer_Agent_Cell_Phone');
			if(mobileNumber == agentPhone)
			{
				lookup = CUSTOMER_LOOKUP_FIELD;
			}
			if(mobileNumber == realtorPhone)
			{
				lookup = REALTOR_LOOKUP_FIELD;
			}
			info lookup;
			params = Map();
			params.put(lookup,agentId.toLong());
			response = zoho.crm.updateRecord("smsmagic4__SMS_history",historyRecordId.toLong(),params);
			info response;
		}
	}
}
else
{
	// 	xmlResp = getUrl("https://www.google.com:81");
	params = Map();
	params.put("sort_by","Created_Time");
	params.put("sort_order","desc");
	recordLookup = Null;
	recordLookupName = Null;
	response = zoho.crm.getRecords("smsmagic4__SMS_History",1,200,params);
	for each  item in response
	{
		if(recordLookup.isNull() && "OUT" == item.get("smsmagic4__Direction") && mobileNumber == item.get("smsmagic4__MobileNumber"))
		{
			info item;
			recordLookup = item.get(CUSTOMER_LOOKUP_FIELD);
			recordLookupName = CUSTOMER_LOOKUP_FIELD;
			if(recordLookup.isNull())
			{
				recordLookup = item.get(REALTOR_LOOKUP_FIELD);
				recordLookupName = REALTOR_LOOKUP_FIELD;
			}
		}
	}
	info recordLookup;
	if(recordLookup.isNull())
	{
		criteria = "((smsmagic4__MobileNumber:equals:" + mobileNumber + ") and (smsmagic4__Direction:equals:OUT))";
		response = zoho.crm.searchRecords("smsmagic4__SMS_history",criteria,0,1,params);
		if(!response.isEmpty())
		{
			recordLookup = response.get(0).get(CUSTOMER_LOOKUP_FIELD);
			recordLookupName = CUSTOMER_LOOKUP_FIELD;
			if(recordLookup.isNull())
			{
				recordLookup = response.get(0).get(REALTOR_LOOKUP_FIELD);
				recordLookupName = REALTOR_LOOKUP_FIELD;
			}
		}
	}
	if(!recordLookup.isNull())
	{
		info recordLookup;
		if(!recordLookup.isEmpty())
		{
			agentId = recordLookup.get('id');
			info agentId;
			updateParams = Map();
			updateParams.put(recordLookupName,agentId);
			response = zoho.crm.updateRecord("smsmagic4__SMS_history",historyRecordId,updateParams);
			info response;
		}
	}
}
