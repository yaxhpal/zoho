var magicToast = null;

var baseURLAPIName = "smsmagic4bigin__Base_URL";
var BASE_URL_INPUT_ID = "#baseURL";

var PHONE_FIELDS_CONTAINER_ID = "#phone-fields";
var phoneFieldAPIName = "smsmagic4bigin__Phone_Field";
var PHONE_FIELD_INPUT_ID = "#inputPhoneField";

var IS_FIELD_TOUCHED = false;

var SAVE_SETTINGS_BTN_ID = "#save-settings";
var HTTP_SUCCESS_CODE = "200";
var SMS_MAGIC_ACCOUNT_API_PATH = "/api/v2/bigin/account"

var account_syncing = false;

// Save Bigin variable
function saveOrgVar(apiName, apiValue) {
  ZOHO.BIGIN.API.setBiginVariable({apiname: apiName, value: apiValue}).then(function (response) {
    console.log("saveOrgVar: " + JSON.stringify(response, null, 2));
  });
}

// Set Input field value
function setInputFieldValue(inputFieldId, inputFieldValue, inputFieldLabel) {
  if ($(inputFieldId).val() === inputFieldValue) {
    console.warn("No change detected");
    return;
  }
  $(inputFieldId).val(inputFieldValue);
  $(inputFieldId).focus();
  if (inputFieldLabel) {
    $(`${inputFieldId}Display`).val(inputFieldLabel);
  }
  IS_FIELD_TOUCHED = true;
  $(SAVE_SETTINGS_BTN_ID).removeAttr('disabled');
}

$(document).ready(function () {
  /*
   * Subscribe to the EmbeddedApp onPageLoad event before initializing the widget
   */
  ZOHO.embeddedApp.on("PageLoad", function (data) {
    console.log("PageLoad is complete" + JSON.stringify(data, null, 2));

    // Get all the field names for this module
    ZOHO.BIGIN.META.getFields({ Entity: "Contacts" }).then(function (data) {
      $(PHONE_FIELDS_CONTAINER_ID).val(null).trigger("change");
      data.fields.forEach(function (field) {
        if (field.data_type === "phone") {
          console.log("Adding phone field==> " + field.field_label);
          let newOption = $(`<li onclick="javascript:setInputFieldValue('#inputPhoneField', '${field.api_name}', '${field.field_label}');"><button class="dropdown-item">${field.field_label}</a></li>`);
          $(PHONE_FIELDS_CONTAINER_ID).append(newOption).trigger("change");
        }
      });
    });

    // Get Base URL variable value
    ZOHO.BIGIN.API.getBiginVariable({ nameSpace: baseURLAPIName }).then(function (data) {
      console.log("ZOHO.BIGIN.API.getOrgVariable: " + JSON.stringify(data, null, 2));
      $(BASE_URL_INPUT_ID).val(data.Success.Content);
    });

    // Get Phone Field variable value
    ZOHO.BIGIN.API.getBiginVariable({ nameSpace: phoneFieldAPIName }).then(function (data) {
      console.log("ZOHO.BIGIN.API.getOrgVariable: " + JSON.stringify(data, null, 2));
      $(`${PHONE_FIELD_INPUT_ID}Display`).val(data.Success.Content.replace("_", " "));
      $(PHONE_FIELD_INPUT_ID).val(data.Success.Content);
    });
  });
  ZOHO.embeddedApp.init();

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
        account_syncing = false;
      }
      if (phoneField.trim() != "") {
        saveOrgVar(phoneFieldAPIName, phoneField);
      }
      magicToast.show();
    }
  });

  $("#signup-btn").click(function () {
    let baseURL = $(BASE_URL_INPUT_ID).val();
    window.open(`${baseURL}/trial`, "_blank");
    account_syncing = false;
  });

  // Fetch Current User and organization information from Bigin
  $("#nav-home-tab").click(function () {
    if (account_syncing) {
      return;
    }
    account_syncing = true;
    let baseURL = $(BASE_URL_INPUT_ID).val();
    let orgInfo = {};
    $("#account-failed-alert").addClass("visually-hidden");
    $("#account-success-alert").addClass("visually-hidden");
    $("#accountstatus-loading").removeClass("visually-hidden");
    $("#signup-btn").addClass("invisible")
    if (baseURL.trim() != "") {
      ZOHO.BIGIN.CONFIG.getCurrentUser().then(function (response) {
        console.log("ZOHO.BIGIN.CONFIG.getCurrentUser: " + JSON.stringify(response, null, 2));
        orgInfo["zoho_user_id"] = response["users"][0]["id"];
        orgInfo["zoho_user_email"] = response["users"][0]["email"];
        ZOHO.BIGIN.CONFIG.getOrgInfo().then(function (response) {
          console.log("ZOHO.BIGIN.CONFIG.getOrgInfo: " + JSON.stringify(response, null, 2));
          orgInfo["zoho_org_id"] = response["org"][0]["id"];
          orgInfo["product"] = "bigin";
          let request = {
              url: `${baseURL}${SMS_MAGIC_ACCOUNT_API_PATH}`,
              headers: {"Content-Type": "application/json"},
              body: orgInfo
          }
          ZOHO.BIGIN.HTTP.post(request).then(function (data) {
            console.log("Request response ==> " + data);
            let accountSetup = false;
            try {
              data = JSON.parse(data);
              let accountid = data.Account;
              let apiKey = data.APIKey;
              console.log("Request response Account ==> " + accountid + " API Key ==> " + apiKey);
              if (apiKey != undefined && apiKey.trim() !== "" && apiKey != null) {
                console.log("Request response ==> success");
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
              $("#signup-btn").removeClass("invisible")
            }
            $("#accountstatus-loading").addClass("visually-hidden");
          });
        });
      });
    } else {
      $("#toast-text").html('Please configure Base URL first');
      magicToast.show();
    }
  });
});
