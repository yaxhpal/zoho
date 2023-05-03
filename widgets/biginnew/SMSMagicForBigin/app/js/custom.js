// Save Bigin variable
function saveOrgVar(apiName, apiValue) {
  ZOHO.BIGIN.API.setBiginVariable({ apiname: apiName, value: apiValue }).then(
    function (response) {
      smsmagic.log("saveOrgVar: " + JSON.stringify(response, null, 2));
    }
  );
}

// Set Input field value
function setInputFieldValue(inputFieldId, inputFieldValue, inputFieldLabel) {
  if ($(inputFieldId).val() === inputFieldValue) {
    return;
  }
  $(inputFieldId).val(inputFieldValue);
  $(inputFieldId).focus();
  if (inputFieldLabel) {
    $(`${inputFieldId}Display`).val(inputFieldLabel);
  }
  IS_FIELD_TOUCHED = true;
  $(SAVE_SETTINGS_BTN_ID).removeAttr("disabled");
}

$(document).ready(function () {
  $(BASE_URL_INPUT_ID).change(function () {
    IS_FIELD_TOUCHED = true;
    $(SAVE_SETTINGS_BTN_ID).removeAttr("disabled");
  });

  // Save the configured settings
  $(SAVE_SETTINGS_BTN_ID).click(function () {
    if (IS_FIELD_TOUCHED) {
      $(SAVE_SETTINGS_BTN_ID).prop("disabled", true);
      IS_FIELD_TOUCHED = false;
      let baseURL = $(BASE_URL_INPUT_ID).val();
      let phoneField = $(PHONE_FIELD_INPUT_ID).val();
      console.warn(`Base URL = ${baseURL}, Phone field = ${phoneField}`);
      if (baseURL.trim() != "") {
        saveOrgVar(baseURLAPIName, baseURL);
        ACCOUNT_SYNC = false;
      }
      if (phoneField.trim() != "") {
        saveOrgVar(phoneFieldAPIName, phoneField);
      }
      magicToast.show();
    }
  });

  $(SIGN_UP_BTN).click(function () {
    let baseURL = $(BASE_URL_INPUT_ID).val();
    window.open(`${baseURL}/trial`, "_blank");
    ACCOUNT_SYNC = false;
  });

  // Fetch Current User and organization information from Bigin
  $("#nav-home-tab").click(function () {
    if (ACCOUNT_SYNC) {
      return;
    }
    ACCOUNT_SYNC = true;
    let baseURL = $(BASE_URL_INPUT_ID).val();
    $("#account-failed-alert").addClass("visually-hidden");
    $("#account-success-alert").addClass("visually-hidden");
    $("#accountstatus-loading").removeClass("visually-hidden");
    $(SIGN_UP_BTN).addClass("invisible");
    if (baseURL.trim() != "") {
      let request = {
        url: `${baseURL}${SMS_MAGIC_ACCOUNT_API_PATH}`,
        headers: { "Content-Type": "application/json" },
        body: ORG_INFO,
      };
      ZOHO.BIGIN.HTTP.post(request).then(function (data) {
        smsmagic.log("Request response ==> " + data);
        let accountSetup = false;
        try {
          data = JSON.parse(data);
          let accountid = data.account_id;
          let apiKey = data.api_key;
          smsmagic.log(`Request response Account ==> ${accountid} API Key ==> ${apiKey}`);
          if (smsmagic.isNotBlank(apiKey)) {
            smsmagic.log("Request response ==> success");
            $("#accountid").val(accountid);
            $("#apikey").val(apiKey);
            $("#account-success-alert").removeClass("visually-hidden");
            accountSetup = true;
          }
        } catch (error) {
          console.warn("syncAccountDetails: " + error);
        }
        if (!accountSetup) {
          $("#account-failed-alert").removeClass("visually-hidden");
          $("#signup-btn").removeClass("invisible");
        }
        $("#accountstatus-loading").addClass("visually-hidden");
      });
    } else {
      $("#toast-text").html("Please configure Base URL first");
      magicToast.show();
    }
  });
});
