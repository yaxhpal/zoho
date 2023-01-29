var magicToast = null;
var magicInputToast = null;
var baseURLAPIName = "smsmagic4bigin__Base_URL";
var phoneFieldAPIName = "smsmagic4bigin__Phone_Field";
var accountDetailsAPIName = "smsmagic4bigin__Account_Details";
var orgInfo = {};

function saveOrgVar(apiName, apiValue) {
  let params = { apiname: apiName, value: apiValue };
  ZOHO.BIGIN.API.setBiginVariable(params).then(function (data) {
    console.log(data);
    response = JSON.parse(data);
    if (response.status_code === "200") {
      $("#inputdcurl").val(apiValue);
      magicToast.show();
    }
  });
}

function selectPhoneField(phonleFieldAPI, phoneFieldLabel) {
  let params = {apiname: phoneFieldAPIName, value: phonleFieldAPI};
  ZOHO.BIGIN.API.setBiginVariable(params).then(function (data) {
    console.log(data);
    response = JSON.parse(data);
    if (response.status_code === "200") {
      $("#inputPhoneField").val(phoneFieldLabel);
    }
  });
}

function selectDataCenter(dc) {
  console.log("Selected DC: " + dc);
  $("#usdc").removeClass("disabled");
  $("#eudc").removeClass("disabled");
  $("#audc").removeClass("disabled");
  $("#otherdc").removeClass("disabled");
  if (dc == 1) {
    $("#usdc").addClass("disabled");
    saveOrgVar(baseURLAPIName, "https://app.sms-magic.com");
    $("#selected-dc").html("US data center");
  } else if (dc == 2) {
    $("#eudc").addClass("disabled");
    saveOrgVar(baseURLAPIName, "https://eu.app.sms-magic.com");
    $("#selected-dc").html("EU data center");
  } else if (dc == 3) {
    $("#audc").addClass("disabled");
    saveOrgVar(baseURLAPIName, "https://aus-app.sms-magic.com");
    $("#selected-dc").html("AU data center");
  } else {
    magicInputToast.show();
  }
}

  /*
  * Fetch Current User and organization information from Bigin
  */
function syncAccountDetails() {
  ZOHO.BIGIN.CONFIG.getCurrentUser().then(function (response) {
    console.log("ZOHO.BIGIN.CONFIG.getCurrentUser: " + JSON.stringify(response, null, 2));
    orgInfo["zoho_user_id"] = response["users"][0]["id"];
    orgInfo["zoho_user_email"] = response["users"][0]["email"];
    ZOHO.BIGIN.CONFIG.getOrgInfo().then(function (response) {
      console.log("ZOHO.BIGIN.CONFIG.getOrgInfo: " + JSON.stringify(response, null, 2));
      orgInfo["zoho_org_id"] = response["org"][0]["id"];
      let request = {
          url: "https://eool2p37oq9j5v9.m.pipedream.net",
          headers: {"Content-Type": "application/json"},
          body: orgInfo
      }
      ZOHO.BIGIN.HTTP.post(request).then(function (data) {
        console.log("Request response ==> " + data);
        data = JSON.parse(data);
        let accountid = data.Account;
        let apiKey = data.APIKey;
        console.log("Request response Account ==> " + accountid + " API Key ==> " + apiKey);
        if (apiKey != undefined && apiKey.trim() !== "" && apiKey != null) {
          console.log("Request response ==> success");
          $("#accountid").val(accountid);
          $("#apikey").val(apiKey);
          let params = { apiname: accountDetailsAPIName, value: data };
          ZOHO.BIGIN.API.setBiginVariable(params).then(function (response) {
              console.log("ZOHO.BIGIN.API.setBiginVariable reponse => " + response);
          });
        } else {
          $("#accountstatus").removeClass("text-success");
          $("#accountstatus").addClass("text-warning");
          $("#accountstatus").html("&#xe002;").trigger("change");
        }
      });
    });text-right
  });
}

$(document).ready(function () {
  $("#otherdcsavebtn").click(function () {
    let otherDCURL = $("#otherdcinputurl").val();
    if (otherDCURL != undefined && otherDCURL.trim() !== "" && otherDCURL != null) {
      saveOrgVar(baseURLAPIName, otherDCURL);
      $("#selected-dc").html("Custom data center");
    }
  });
  /*
   * Subscribe to the EmbeddedApp onPageLoad event before
   * initializing the widget
   */
  ZOHO.embeddedApp.on("PageLoad", function (data) {
    console.log("PageLoad is complete" + JSON.stringify(data, null, 2));
    // Get all the field names for this module
    ZOHO.BIGIN.META.getFields({ Entity: "Contacts" }).then(function (data) {
      $("#phone-fields").val(null).trigger("change");
      data.fields.forEach(function (field) {
        if (field.data_type === "phone") {
          console.log("Adding phone field==> " + field.field_label);
          let newOption = $("<li onclick=\"javascript:selectPhoneField('"+field.api_name+"', '"+field.field_label+"');\"><button class=\"dropdown-item\">"+field.field_label+"</a></li>");
          $("#phone-fields").append(newOption).trigger("change");
        }
      });
    });

    ZOHO.BIGIN.API.getBiginVariable({ nameSpace: baseURLAPIName }).then(function (data) {
      console.log("ZOHO.BIGIN.API.getOrgVariable: " + JSON.stringify(data, null, 2));
      appURL = data.Success.Content;
      try {
        if (appURL != null) {
          $("#usdc").removeClass("disabled");
          $("#eudc").removeClass("disabled");
          $("#audc").removeClass("disabled");
          $("#otherdc").removeClass("disabled");
          if (appURL === "https://app.sms-magic.com") {
            $("#usdc").addClass("disabled");
          } else if (appURL === "https://eu.app.sms-magic.com") {
            $("#eudc").addClass("disabled");
          } else if (appURL === "https://aus-app.sms-magic.com") {
            $("#audc").addClass("disabled");
          } else {
            $("#otherdc").addClass("disabled");
          }
          $("#inputdcurl").val(appURL);
        }
      } catch (err) {
        console.error("Error in getting org valiable" + err);
      }
    });

    ZOHO.BIGIN.API.getBiginVariable({ nameSpace: phoneFieldAPIName }).then(function (data) {
      console.log("ZOHO.BIGIN.API.getOrgVariable: " + JSON.stringify(data, null, 2));
      phoneFieldLabel = data.Success.Content;
      $("#inputPhoneField").val(phoneFieldLabel.replace("_", " "));
    });

    ZOHO.BIGIN.API.getBiginVariable({ nameSpace: accountDetailsAPIName}).then(function (data) {
      console.log("ZOHO.BIGIN.API.getOrgVariable: " + JSON.stringify(data, null, 2));
      accountDetails = JSON.parse(data.Success.Content);
      let accountid = accountDetails.Account;
      let apiKey = accountDetails.APIKey;
      console.log("Request response Account ==> " + accountid + " API Key ==> " + apiKey);
      if (apiKey != undefined && apiKey.trim() !== "" && apiKey != null) {
        console.log("Request response ==> success");
        $("#accountid").val(accountid);
        $("#apikey").val(apiKey);
      } else {
        $("#accountstatus").removeClass("text-success");
        $("#accountstatus").addClass("text-warning");
        $("#accountstatus").html("&#xe002;").trigger("change");
      }
    });
  });
  ZOHO.embeddedApp.init();
});
