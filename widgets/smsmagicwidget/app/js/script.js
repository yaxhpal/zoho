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
    $.fn.updateProgress = function() {
        ssid = $.trim($('#selected-sender-id').val()).length;
        txtval = $.trim($('#message-text').val()).length;
        console.log("XXX: " + ssid);
        console.log("YYY: " + txtval);
        if(ssid && txtval) {
            $('#progress-bar').width('100%');  
        } else if (ssid) {
            $('#progress-bar').width('50%');
        } else if (txtval) {
            $('#progress-bar').width('50%');
        } else {
            $('#progress-bar').width('2%');
        }
    };

    $("body").removeClass("loading");  

    $('.sender-ids-item').click(function () {
        senderId = $(this).text();
        $('#selected-sender-id').val(senderId);
        $.fn.updateProgress()
    });

    $('.sms-templates-item').click(function () {
        templateName = $(this).text();
        $('#selected-template').val(templateName)
        $.fn.updateProgress()
        templateText = $('#' + $(this).data("value")).val()
        $('#message-text').val(templateText);
    });

    $('.record-fields-item').click(function () {
        recordField = "${" + $(this).text() + "}";
        $('#message-text').insertAtCaret(recordField);
        $.fn.updateProgress()
    });

    $('#message-text').blur(function() {
        $.fn.updateProgress()
    });

    $('#reset-form').click(function() {
        $('#progress-bar').width('2%');
    });
});