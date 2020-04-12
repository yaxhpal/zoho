$(document).ready(function () {
    
    $('#form-error-alert').hide();

    $('.close-alert').click(function () {
        $('#form-error-alert').hide()
    })

    $('#message-text').smsArea();

    $('#sms-sender-ids').select2({
        placeholder: "Select a sender id"
    })

    $('#phone-fields').select2({
        placeholder: "Select phone field"
    })

    $('#sms-templates').select2({
        placeholder: "Select a text template"
    }).on('select2:select', function (e) {
        var data = e.params.data;
        templateText = $('#' + data.id).val();
        $('#message-text').val("");
        $('#message-text').insertAtCaret(templateText)
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
    }).on('select2:unselect', function (e) {
        var data = e.params.data;
        $('#message-text').val($('#message-text').val().replace("${" + data.id + "}", ""));
        console.log(data);
    });
  
    $('#message-form').submit(function (event) {
        payload = collateDataV2();
        sendMessageV2(payload);
        event.preventDefault();
    });

    $('#preview-message').click(function () {
        text = $('#message-text').val();
        if (text == undefined || text.replace(/\n/g, '').replace(/\t/g, '').replace(/ /g, '') == "") {
            $('#form-error-message').text("Message can not be empty.");
            $('#form-error-alert').show();
            return false;
        }
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