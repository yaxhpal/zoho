// Declaration of all constants
const baseURLAPIName = "smsmagicbigin__Base_URL";
const phoneFieldAPIName = "smsmagicbigin__Phone_Field";
const BASE_URL_INPUT_ID = "#baseURL";
const PHONE_FIELDS_CONTAINER_ID = "#phone-fields";
const PHONE_FIELD_INPUT_ID = "#inputPhoneField";
const SAVE_SETTINGS_BTN_ID = "#save-settings";
const SMS_MAGIC_ACCOUNT_API_PATH = "/api/v2/zoho/account";
const SIGN_UP_BTN = "#signup-btn";

// Switch to log messages. For production, assign it 'false'
const DEBUG = true;

// All the global variables used in the app
var magicToast = null;
var IS_FIELD_TOUCHED = false;
var ACCOUNT_SYNC = false;
var ORG_INFO = {};

// Helper construct
const smsmagic = {
    isNotBlank: function (stringValue) {
      return (stringValue != undefined && stringValue != null && stringValue.trim() !== "");
    },
    log: DEBUG?console.log:function(){},
};

// Subscribe to the EmbeddedApp onPageLoad event before initializing the widget
$(document).ready(function () {
  ZOHO.embeddedApp.on("PageLoad", function (data) {
    smsmagic.log("PageLoad is complete" + JSON.stringify(data, null, 2));

    // Get all the field names for this module
    ZOHO.BIGIN.META.getFields({ Entity: "Contacts" }).then(function (response) {
      $(PHONE_FIELDS_CONTAINER_ID).val(null).trigger("change");
      response.fields.forEach(function (field) {
        if (field.data_type === "phone") {
          smsmagic.log("Adding phone field==> " + field.field_label);
          let newOption = $(`<li onclick="javascript:setInputFieldValue('#inputPhoneField', '${field.api_name}', '${field.field_label}');"><button class="dropdown-item">${field.field_label}</a></li>`);
          $(PHONE_FIELDS_CONTAINER_ID).append(newOption).trigger("change");
        }
      });
    });

    // Get SMS Magic Bigin variable value
    ZOHO.BIGIN.API.getBiginVariable({nameSpace: [baseURLAPIName, phoneFieldAPIName].toString()}).then(function (response) {
      smsmagic.log("ZOHO.BIGIN.API.getOrgVariable: " + JSON.stringify(response, null, 2));
      let baseUrl = response.Success.Content[baseURLAPIName]["value"];
      let phoneField = response.Success.Content[phoneFieldAPIName]["value"];
      if (smsmagic.isNotBlank(baseUrl)) {
        $(BASE_URL_INPUT_ID).val(baseUrl);
      }
      if (smsmagic.isNotBlank(phoneField)) {
        $(PHONE_FIELD_INPUT_ID).val(phoneField);
        $(`${PHONE_FIELD_INPUT_ID}Display`).val(phoneField.replace("_"," "));
      }
    });

    // Get Current User and Org info
    ZOHO.BIGIN.CONFIG.getCurrentUser().then(function (response) {
      smsmagic.log("ZOHO.BIGIN.CONFIG.getCurrentUser: " + JSON.stringify(response, null, 2));
      ORG_INFO["zoho_user_id"] = response["users"][0]["id"];
      ORG_INFO["zoho_user_email"] = response["users"][0]["email"];
      ZOHO.BIGIN.CONFIG.getOrgInfo().then(function (response) {
        smsmagic.log("ZOHO.BIGIN.CONFIG.getOrgInfo: " + JSON.stringify(response, null, 2));
        ORG_INFO["zoho_org_id"] = response["org"][0]["id"];
        ORG_INFO["product"] = "bigin";
        $("#overlay").hide();
      });
    });
  });
  ZOHO.embeddedApp.init();
});
