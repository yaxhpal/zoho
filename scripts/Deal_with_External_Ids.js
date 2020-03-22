historyRecord = zoho.crm.getRecordById("smsmagic4__SMS_History",target_id);
externalId = historyRecord.get('smsmagic4__ExternalId');
dealTexts = zoho.crm.searchRecords("Deal_Texts","(External_Id:equals:" + trim(externalId) + ")");
for each  dealText in dealTexts
{
	dealTextId = dealText.get('id');
	dealId = dealText.get('Deal_Id');
	params = Map();
	params.put("Deal",dealId);
	updateResp = zoho.crm.updateRecord("smsmagic4__SMS_History", target_id, params);
	info updateResp;
	deleteParams = Map();
	deleteParams = {"module":"Deal_Texts","id":dealTextId};
	deleteResp = zoho.crm.invokeConnector("crm.delete",deleteParams);
	info deleteResp;
	break;
}
return "";