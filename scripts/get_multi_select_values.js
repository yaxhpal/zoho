info lead_id;
query_value = Map();
query_value.put("Criteria",lead_id);
all_contacts = zoho.crm.searchRecords('Leads_X_Contacts',"(Lead:equals:" + lead_id + ")");
selected_contacts = {};
for each  contact in all_contacts
{
	info contact;
	selected_contacts.add(contact.get('Contacts').get('name'));
}
response = zoho.crm.updateRecord('Leads',lead_id,{'Selected_Contacts':selected_contacts.sort(true).toString(", ")});
info response;
