if (phone != null &&  phone != "") {
	digits = phone.toList('');
	sanitized_phone = "";
	for each char in digits {
		if(char.isNumber()) {
			sanitized_phone+=char;	
		}
	}
	info sanitized_phone;
}
