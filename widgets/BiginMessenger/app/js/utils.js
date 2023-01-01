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

// https://stackoverflow.com/questions/4705185/count-characters-sms-using-jquery
(function ($) {
    $.fn.smsArea = function (options) {
        var e = this,
            cutStrLength = 0,

            s = $.extend({

                cut: true,
                maxSmsNum: 3,
                interval: 200,

                counters: {
                    message: $('#smsCount'),
                    character: $('#smsLength')
                },

                lengths: {
                    ascii: [160, 306, 459],
                    unicode: [70, 134, 201]
                }
            }, options);


        e.keyup(function () {

            clearTimeout(this.timeout);
            this.timeout = setTimeout(function () {

                var
                    smsType,
                    smsLength = 0,
                    smsCount = -1,
                    charsLeft = 0,
                    text = e.val(),
                    isUnicode = false;

                for (var charPos = 0; charPos < text.length; charPos++) {
                    switch (text[charPos]) {
                        case "\n":
                        case "[":
                        case "]":
                        case "\\":
                        case "^":
                        case "{":
                        case "}":
                        case "|":
                        case "€":
                        case "£":
                            smsLength += 2;
                            break;

                        default:
                            smsLength += 1;
                    }


                    if (text.charCodeAt(charPos) > 127 && text[charPos] != "€") isUnicode = true;
                }

                if (isUnicode) {
                    smsType = s.lengths.unicode;

                } else {
                    smsType = s.lengths.ascii;
                }

                for (var sCount = 0; sCount < s.maxSmsNum; sCount++) {

                    cutStrLength = smsType[sCount];
                    if (smsLength <= smsType[sCount]) {

                        smsCount = sCount + 1;
                        charsLeft = smsType[sCount] - smsLength;
                        break
                    }
                }

                if (s.cut) e.val(text.substring(0, cutStrLength));
                smsCount == -1 && (smsCount = s.maxSmsNum, charsLeft = 0);

                s.counters.message.html(smsCount);
                s.counters.character.html(charsLeft);

            }, s.interval)
        }).keyup()

    }
}(jQuery));


function showError(message) {
    console.log(message);
}

function toggleLoading() {
    $("body").toggleClass("loading");
}