history_record = zoho.crm.getRecordById("smsmagic4__SMS_History",target_id);
phone = history_record.get("smsmagic4__MobileNumber");
response = zoho.crm.searchRecords("Vendors", "(Phone:equals:" + phone + ")");
for each  record in response {
	vendor = zoho.crm.getRecordById("Vendors", record.get('id'));
	deal_names = vendor.get('Deals').toList(",");
	for each deal_name in deal_names {
		deal_records = zoho.crm.searchRecords("Deals","Deal_Name:equals:" + trim(deal_name));
		for each deal in deal_records {
			params = Map();
			params.put("Deals", deal.get('id'));
			params.put("SMS_History", target_id);
			create_response = zoho.crm.createRecord("SMS_History_X_Deals", params);
			info create_response;
		}
	}
}