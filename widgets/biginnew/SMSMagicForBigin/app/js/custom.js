var magicToast = null;
var magicInputToast = null;
var baseURLAPIName = "smsmagic4bigin__Base_URL";
var phoneFieldAPIName = "smsmagic4bigin__Phone_Field";

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

$(document).ready(function () {
  magicToast = bootstrap.Toast.getOrCreateInstance(document.getElementById("magictoast"));
  magicInputToast = bootstrap.Toast.getOrCreateInstance(document.getElementById("magicinputtoast"));
  console.log("Document is ready " + magicToast);
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
    /*
     * Verify if EntityInformation is Passed
     */
    // if (data && data.Entity) {
    //   /*
    //    * Fetch Information of Record passed in PageLoad
    //    * and insert the response into the dom
    //    */
    //   console.log("Fetching data: " + JSON.stringify(ZOHO, null, 2));
    //   ZOHO.BIGIN.API.getRecord({
    //     Entity: data.Entity,
    //     RecordID: data.EntityId,
    //   }).then(function (response) {
    //     console.log(
    //       "ZOHO.BIGIN.API.getRecord: " + JSON.stringify(response, null, 2)
    //     );
    //     $("#recordInfo").html(JSON.stringify(response));
    //   });
    // }

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

    /*
     * Fetch Current User Information from CRM
     * and insert the response into the dom
     */
    // ZOHO.BIGIN.CONFIG.getCurrentUser().then(function (response) {
    //   console.log(
    //     "ZOHO.BIGIN.CONFIG.getCurrentUser: " + JSON.stringify(response, null, 2)
    //   );
    //   $("#userInfo").html(JSON.stringify(response));
    // });

    /*
     * Fetch Current User Information from CRM
     * and insert the response into the dom
     */
    // ZOHO.BIGIN.CONFIG.getCurrentUser().then(function (response) {
    //   console.log(
    //     "ZOHO.BIGIN.CONFIG.getCurrentUser: " + JSON.stringify(response, null, 2)
    //   );
    //   $("#userInfo").html(JSON.stringify(response));
    // });

    // ZOHO.BIGIN.CONFIG.getOrgInfo().then(function (response) {
    //   console.log(
    //     "ZOHO.BIGIN.CONFIG.getOrgInfo: " + JSON.stringify(response, null, 2)
    //   );
    //   $("#orgInfo").html(JSON.stringify(response));
    // });

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

  });
  ZOHO.embeddedApp.init();
});
