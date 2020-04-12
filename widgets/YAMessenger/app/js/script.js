jQuery.fn.extend({
    insertAtCaret: function (myValue) {
        return this.each(function (i) {
            if (document.selection) {
                //For browsers like Internet Explorer
                this.focus();
                var sel = document.selection.createRange();
                sel.text = myValue;
                this.focus();
            } else if (this.selectionStart || this.selectionStart == '0') {
                //For browsers like Firefox and Webkit based
                var startPos = this.selectionStart;
                var endPos = this.selectionEnd;
                var scrollTop = this.scrollTop;
                this.value = this.value.substring(0, startPos) + myValue + this.value.substring(endPos, this.value.length);
                this.focus();
                this.selectionStart = startPos + myValue.length;
                this.selectionEnd = startPos + myValue.length;
                this.scrollTop = scrollTop;
            } else {
                this.value += myValue;
                this.focus();
            }
        });
    }
});

$(document).ready(function () {
    $('#reset-form').click(function () {
        $('#progress-bar').width('2%');
    });

    $('#message-form').submit(function (event) {
        payload = collateData();
        console.log("Record Data" + payload);
        // sendMessage(payload);
        event.preventDefault();
    });

    $('#preview-message').click(function () {
        text = $('#message-text').val();
        text = applyMergeField(text, records[0]);
        text = text.replace(/\n/g, '<br>');
        $('#preview-text').text("");
        $('#preview-text').append(text);
        $('#preview-modal').modal('show');
        event.preventDefault();
    });

    $('#sms-sender-ids').on('select2:select', function (e) {
        var data = e.params.data;
        console.log(data);
    });

    $('#sms-templates').on('select2:select', function (e) {
        var data = e.params.data;
        templateText = $('#' + data.id).val();
        $('#message-text').val(templateText);
        console.log(data);
    });

    $('#phone-fields').on('select2:select', function (e) {
        var data = e.params.data;
        console.log(data);
    });

    $('#record-fields').on('select2:select', function (e) {
        var data = e.params.data;
        $('#message-text').insertAtCaret("${" + data.id + "}");
        console.log(data);
    });

    $("#message-text" ).focusin(function() {
        $('#text-active').removeClass('invisible')
    });

    $("#message-text" ).focusout(function() {
        $('#text-active').addClass('invisible')
    });
});