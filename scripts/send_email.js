response = invokeurl
[
	url :"http://slowwly.robertomurray.co.uk/delay/5000/url/http://www.google.com"
	type :GET
];
info response;
history = zoho.crm.getRecordById("smsmagic4__SMS_History",record_id);
info history;
owner = history.get('Owner').get('name');
lead_name = history.get('smsmagic4__Lead').get('name');
mobile = history.get('smsmagic4__MobileNumber');
sendmail
[
	from :zoho.adminuserid
	to :"yashpal.meena@screen-magic.com"
	cc:"yaxhpal@gmail.com"
	reply to :zoho.adminuserid
	subject :"Welcome to " + lead_name
	message :"Hi&nbsp; " + owner + ",<div><br></div><div>&nbsp; &nbsp; &nbsp; There is new lead " + lead_name + " in the town.&nbsp;</div><div>&nbsp; &nbsp; &nbsp; Please talk to them @ " + mobile + ".</div><div><br></div><div>Thanks you,</div><div>Zoho Email Notifications</div>"
]
