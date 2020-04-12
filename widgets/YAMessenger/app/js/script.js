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
    initializeWidget();
    $('#message-text').smsArea();

    $('#sms-sender-ids').select2({
        placeholder: "Select a sender id"
    }).on('select2:select', function (e) {
        var data = e.params.data;
        console.log(data);
    });

    $('#sms-templates').select2({
        placeholder: "Select a text template"
    }).on('select2:select', function (e) {
        var data = e.params.data;
        templateText = $('#' + data.id).val();
        $('#message-text').val("");
        $('#message-text').insertAtCaret(templateText)
        console.log(data);
    });

    $('#phone-fields').select2({
        placeholder: "Select phone field"
    }).on('select2:select', function (e) {
        var data = e.params.data;
        console.log(data);
    });

    $('#record-fields').select2({
        placeholder: "Select merge field",
        allowClear: true
    }).on('select2:unselecting', function () {
        $(this).data('unselecting', true);
    }).on('select2:opening', function (e) {
        if ($(this).data('unselecting')) {
            $(this).removeData('unselecting');
            e.preventDefault();
        }
    }).on('select2:select', function (e) {
        var data = e.params.data;
        $('#message-text').insertAtCaret("${" + data.id + "}");
        console.log(data);
    });

    $('b[role="presentation"]').hide();
    $('.select2-selection__arrow').append('<span style="color: gray;font-size: 12px;"><i class="fa fa-angle-down"></i></span>');

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

    $("#message-text").focusin(function () {
        $('#text-active').removeClass('invisible')
    });

    $("#message-text").focusout(function () {
        $('#text-active').addClass('invisible')
    });
});