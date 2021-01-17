// All the relevant constants
MODULE_TO_BE_UPDATED = "smsmagic4__SMS_History";
LEAD_LOOKUP_FIELD = "smsmagic4__Lead";
CONTACT_LOOKUP_FIELD = "smsmagic4__Contact";
target_record_id = sms_history.get("smsmagic4__SMS_History.ID");
sms_history_record = zoho.crm.getRecordById("smsmagic4__SMS_History",target_record_id);
if(sms_history_record != null)
{
	mobile_number = sms_history_record.get("smsmagic4__MobileNumber");
	if(mobile_number != null)
	{
		field_to_be_updated = null;
		record_id = null;
		phone_criteria = List();
		mobile_criteria = List();
		plain_phone_criteria = List();
		for each index position in {0,1,2,3}
		{
			item = mobile_number.subString(position);
			phone_criteria.add("(Phone:equals:" + item + ")");
			phone_criteria.add("(Phone:equals:0" + item + ")");
			mobile_criteria.add("(Mobile:equals:" + item + ")");
			mobile_criteria.add("(Mobile:equals:0" + item + ")");
			plain_phone_criteria.add("(smsmagic4__Plain_Phone:equals:" + item + ")");
			plain_phone_criteria.add("(smsmagic4__Plain_Phone:equals:0" + item + ")");
		}
		phone_criteria_str = toString(phone_criteria," or ");
		mobile_criteria_str = toString(mobile_criteria," or ");
		plain_phone_criteria_str = toString(plain_phone_criteria," or ");
		response = zoho.crm.searchRecords("Contacts",phone_criteria_str);
		info response;
		if(response.isEmpty())
		{
			response = zoho.crm.searchRecords("Contacts",mobile_criteria_str);
			info response;
			if(response.isEmpty())
			{
				response = zoho.crm.searchRecords("Contacts",plain_phone_criteria_str);
				info response;
				if(response.isEmpty())
				{
					response = zoho.crm.searchRecords("Leads",phone_criteria_str);
					info response;
					if(response.isEmpty())
					{
						response = zoho.crm.searchRecords("Leads",mobile_criteria_str);
						info response;
						if(response.isEmpty())
						{
							response = zoho.crm.searchRecords("Leads",plain_phone_criteria_str);
							info response;
							if(response.isEmpty())
							{
								info "Nothing matched!";
							}
							else
							{
								info "Found Lead - 1";
								field_to_be_updated = LEAD_LOOKUP_FIELD;
								record_id = response.get(0).get("id");
							}
						}
						else
						{
							info "Found Lead - 2";
							field_to_be_updated = LEAD_LOOKUP_FIELD;
							record_id = response.get(0).get("id");
						}
					}
					else
					{
						info "Found Lead - 3";
						field_to_be_updated = LEAD_LOOKUP_FIELD;
						record_id = response.get(0).get("id");
					}
				}
				else
				{
					info "Found Contact - 3";
					field_to_be_updated = CONTACT_LOOKUP_FIELD;
					record_id = response.get(0).get("id");
				}
			}
			else
			{
				info "Found Contact - 2";
				field_to_be_updated = CONTACT_LOOKUP_FIELD;
				record_id = response.get(0).get("id");
			}
		}
		else
		{
			info "Found Contact - 1";
			field_to_be_updated = CONTACT_LOOKUP_FIELD;
			record_id = response.get(0).get("id");
		}
		if(field_to_be_updated != null && record_id != null)
		{
			params = Map();
			params.put(field_to_be_updated,record_id.toLong());
			response = zoho.crm.updateRecord(MODULE_TO_BE_UPDATED,target_record_id.toLong(),params);
			info response;
		}
	}
}
