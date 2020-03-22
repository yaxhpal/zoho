fieldMap = Map();
fieldMap.put("module", "smsmagic4__SMS_History");
fieldMap.put("criteria", "smsmagic4__MobileNumber:equals:" + phone_field);
response = zoho.crm.invokeConnector("crm.search", fieldMap);
smsRecords = response.get("response").get("data");
rowCount = 1;
if (sms_record != null) {
    info("Got record");
    responseXML = "<record>";
    for each record in smsRecords {
        recordText = record.get("smsmagic4__Text");
        recordText = recordText.replaceAll("& ", "&amp; ", true);
        recordText = recordText.replaceAll("'", "&apos;", true);
        recordText = recordText.replaceAll("\"", "&quot;", true);
        recordText = recordText.replaceAll(">", "&gt;", true);
        recordText = recordText.replaceAll("<", "&lt;", true);
        responseXML = responseXML + "<row no=\"" + rowCount + "\">";
        responseXML = responseXML + "<FL val= \"SMS History Name\">" + record.get("Name") + "</FL>";
        responseXML = responseXML + "<FL val= \"Mobile Number\">" + record.get("smsmagic4__MobileNumber") + "</FL>";
        responseXML = responseXML + "<FL val= \"Direction\">" + record.get("smsmagic4__Direction") + "</FL>";
        responseXML = responseXML + "<FL val= \"Status\">" + record.get("smsmagic4__Status") + "</FL>";
        responseXML = responseXML + "<FL val= \"SMS Text\">" + recordText + "</FL>";
        responseXML = responseXML + "</row>";
        rowCount = rowCount + 1;
    }
    //
    responseXML = responseXML + "</record>";
} else {
    info "no record ";
    responseXML = "<record><row no='1'><FL val= ''>No Record
    Found < /FL></row > < /record>";
}
return responseXML;