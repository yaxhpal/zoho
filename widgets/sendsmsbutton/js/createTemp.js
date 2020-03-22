var mobNum;
var str;
var s;
var i = 0;
var j;
var variable = 0;
var resp;
var txt;
var tab;
var templateSelected = 0;
recepients = [];
updates = [];
names = [];
utils={};

$(document).ready(function() {
    ZOHO.embeddedApp.on("PageLoad", function(data) {
        $('#loading').show();
var count=0;
utils.n=0;
        tab = "";
        for (var id in data.EntityId) {
            ZOHO.CRM.API.getRecord({
                    Entity: "Contacts",
                    RecordID: data.EntityId[id]
                })
                .then(function(data) {
                   utils.n++;
                    names.push(data.Full_Name);
                    recepients.push({
                        "data": data
                    });

                    if(utils.n<=6)
                    {
                        tab='<li class="conlist" id="'+data.id+'"><span style="color:#222;">'+data.Full_Name+'</span><span class="ConText" onclick="deleteRow(this.id,this.parentNode.id)" id="'+count+'"></span></li>';
                        count++;
                        return tab;
                    }
                    else
                    {
                        
                        tab='<li class="hidden" style="display: none;" id="'+data.id+'"><span style="color:#222;">'+data.Full_Name+'</span><span class="ConText" onclick="deleteRow(this.id,this.parentNode.id)" id="'+count+'"></span></li>'
                        count++;
                        return tab;

                    }
                    
                }).then(function(tab) {
                    if(id>=9)
                    {
                        tab+="</div>"
                    }
                    document.getElementById("recipientsList").innerHTML += tab;
                })
        }
        
    })

    ZOHO.embeddedApp.init().then(function() {}).then(function() {
        var action=1;
$('a').click(function(){
    if(action==1)
    {
    $(this).text('-View Less')
    $(".hidden").toggle('slow');
    action=2;
}
else if(action==2){
    $(this).text('+View More')
    $(".hidden").toggle('slow');
    action=1;
}
})
        ZOHO.CRM.META.API.getFields({
            "Entity": "Contacts"
        }).then(function(data) {
            var fieldsrc = $("#fieldsList").html(); //get contents of field
            var fieldTemplate = Handlebars.compile(fieldsrc); //convert to template using Handlebars.compile()
            var html = fieldTemplate(data); //getting the html
            $("#fieldnames").html(html); //rendering it
        });
    }).then(function() {
        ZOHO.CRM.CONFIG.getOrgVariable("accSID").then(function(data) {
            utils.accntSID = data.Success.Content;
        }).then(function() {
            ZOHO.CRM.CONFIG.getOrgVariable("authToken").then(function(data) {
                utils.auth = data.Success.Content;
                str = utils.accntSID + ":" + utils.auth;
                utils.encodedAuth = btoa(str);

            }).then(function() {

                request = {
                    url: "https://api.message360.com/api/v3/incomingphone/listnumber.json",
                    params: {
                        AccountSid: utils.accntSID,
                        returnType: "json",
                        NumberType: "sms",
                        page: "1",
                        pagesize: "20",
                    },
                    headers: {
                        Authorization: "Basic " + utils.encodedAuth,
                    }
                }
                ZOHO.CRM.HTTP.get(request)
                    .then(function(data) {
                        var list = JSON.parse(data);
                        console.log("list : "+list);
                        if(list.Message360.hasOwnProperty("Errors"))
                        {
                            $('#getTemp').hide();
                            $('#wrongOrgVar').show();
                        }
                        var numbers = $('#fromNum').html();
                        var numbersTemplate = Handlebars.compile(numbers);
                        $("#listNumbers").html(numbersTemplate(list.Message360.Phones));
                    });
            }).then(function() {
                ZOHO.CRM.API.getAllRecords({
                        Entity: "SMSTemplates",
                        sort_order: "desc"
                    })
                    .then(function(data) {
                            s = {
                                "obj": data
                            };
                           if(data.status==204){
                            document.getElementById("templist").innerHTML=' <select id="temp" class="fldtype1"><option id="none">--None--</option></select>'
                            $('#loading').hide();  
                           }
                           else
                           {
                            var tempSrc = $('#templates').html();
                            var tempTemplate = Handlebars.compile(tempSrc);
                            var temphtml = tempTemplate(s);
                            $("#templist").html(temphtml);
                          $('#loading').hide();
                          }  
                    })
            })
        })
    })

});
function back()
{
    $('#loading').show();
    $('#create').hide();
    $('#getTemp').show();
    ZOHO.CRM.API.getAllRecords({
                        Entity: "SMSTemplates",
                        sort_order: "desc"
                    })
                    .then(function(data) {
                        if (data.status == 204) {
                            $('#listTemplatesDiv').hide();
                        } else {
                            s = {
                                "obj": data
                            };
                            var tempSrc = $('#templates').html();
                            var tempTemplate = Handlebars.compile(tempSrc);
                            var temphtml = tempTemplate(s);
                            $("#templist").html(temphtml);
                            ZOHO.CRM.API.getRecord({
            Entity: "SMSTemplates",
            RecordID: data[0].id
        })
        .then(function(data) {
            document.getElementById("temp").options[1].selected=true;
           txt = (data["Template_Content"]);
            document.getElementById("msgTxt").innerHTML = txt;
            templateSelected = 1;
            $('#loading').hide();
        })
                        }
                    })

}

function deleteRow(i,id) {
    var x=parseInt(i)
    if(recepients.length==1){
        document.getElementsByClassName("viewmore-div")[0].style.borderTopColor="#ff0000";
        $("#recp").show();
    }
    else
    {
for(var k in recepients)
{
    if(recepients[k].data.id==id)
    {
        console.log(recepients[k].data.Full_Name)
    recepients.splice(k, 1);
    $('#'+id).remove();
}
}
if(recepients.length>=6){
    document.getElementById(recepients[5].data.id).style.display="block";
     $("#"+recepients[5].data.id).removeClass('hidden').addClass('conlist');
}
}
}
function addField() {
    document.getElementById("templateTxt").value += "$(" + document.getElementById("selectOption").value + ")";
}

function update() {
   
    template = {};
    template.name = document.getElementById("templateName").value
    template.content = document.getElementById("templateTxt").value
    if(template.name==""){
        document.getElementById("templateName").style.borderBottomColor="#ff0000";
        $("#tempNameEmptyDiv").show();
    }
    else if (template.content=="")
{
   document.getElementById("templateTxt").style.borderColor="#ff0000"; 
   $("#templateEmptyAlert").show();
}

    if(template.name!=""&&template.content!="")
    {
         $('#loading').show();
        var recordData = {
            "CustomModule2_Name": template.name,
            "Template_Content": template.content
        }
        ZOHO.CRM.API.insertRecord({
                Entity: "SMSTemplates",
                APIData: recordData
            })
            .then(function(data) {
                $('#loading').hide();
                $('#successMsg').show();
    setTimeout('$("#successMsg").hide()',2000);
                return back();
                 
            });
    }
}

function addTemp() {
    $('#getTemp').hide();
    $('#create').show();
     document.getElementById("templateName").value = "";
                document.getElementById("templateTxt").value = "";
               document.getElementById("selectOption").options[0].selected=true;
               document.getElementById("templateName").style.borderBottomColor="#444";
               $("#tempNameEmptyDiv").hide();
                  document.getElementById("templateTxt").style.borderColor="rgb(206, 206, 206)"; 
$("#templateEmptyAlert").hide();
}

function listTemplates() {
    
    $('#loading').show();
    var selectedTemplate = document.getElementById("temp").value;
    var ind = document.getElementById("temp").selectedIndex;
    utils.id = document.getElementById("temp").getElementsByTagName("option")[ind].value;
    console.log("utils.id: "+utils.id);
    var b;
    if (selectedTemplate == "--None--") {
        document.getElementById("msgTxt").innerHTML = "";
    }else{
      
    ZOHO.CRM.API.getRecord({
            Entity: "SMSTemplates",
            RecordID: utils.id
        })
        .then(function(data) {
            $('#loading').hide();
            console.log("Inside listTemplates "+data["Template_Content"]);
            txt = (data["Template_Content"]);
            document.getElementById("msgTxt").innerHTML = txt;
            templateSelected = 1;
        })

    }
}

function skip() {
    $("#create").hide();
    $("#getTemp").show();
}

function sendsms() {
    /*
     * get all dynamic placeholders
     */
     console.log("recepients: "+recepients)
     
    var msgContent = document.getElementById("msgTxt").value;
    var fields = [];
    var promises = [];
    var messages = [];
    var fieldRegex = /\$\((\w*)\)/g;
    var frmNo = document.getElementById("toNumber").value;
    
    if(msgContent!="")
    { 
        do {
        var match = fieldRegex.exec(msgContent);
        if (match) {
            fields.push(match[1]);
        }

    } while (match);
    /*
     * loop through all message recipients and send sms
     */

    if (recepients) {
        $('#loading').show();
        for (var i in recepients) {
            var message = generatePersonalMessage(msgContent, fields, recepients[i]);
            messages.push(message);

            request = {
                url: "https://api.message360.com/api/v3/sms/sendsms.json",
                params: {
                    AccountSid: utils.accntSID,
                    fromcountrycode: "1",
                    tocountrycode: "+91",
                    from: frmNo,
                    to: recepients[i].data.Mobile,
                    body: message
                },
                headers: {
                    Authorization: "Basic " + utils.encodedAuth,
                }
            }
            promise = sendMessage(request);
            promises.push(promise);
        }
        
        Promise.all(promises)
            .then(function(data) {
                return showReport(data, messages, frmNo)
            });
    }
}
else
{
   document.getElementById("msgTxt").style.borderColor="#ff0000"; 
   $("#msgEmptyAlert").show();
}
}

function generatePersonalMessage(message, fields, record) {

    for (var index in fields) {
        var replaceStr = record.data[fields[index]];
        if (fields[index] == "Owner") {
            replaceStr = record.data[fields[index]].name;
        }
        message = message.replace("$(" + fields[index] + ")", replaceStr);
    }
    return message;
}

function sendMessage(reqBody) {
    var promise = ZOHO.CRM.HTTP.get(reqBody)
        .then(function(data) {
            return data;
        });
    return promise;
}

function showReport(data, messages, frmNo) {
    var status;
    var statusRep = [];
    for (var index in recepients) {
        response = JSON.parse(data[index])
        if (response.Message360.ResponseStatus == 0) {
            status = response.Message360.Errors.Error[0].Message;
        } else {
            status = "Success"
        }
        statusRep.push({
            Name: recepients[index].data.Full_Name,
            Mobile: recepients[index].data.Mobile,
            Status: status
        })

        var recData = {
            "CustomModule3_Name": recepients[index].data.Full_Name,
            "Message_Sent": messages[index],
            "Status": status,
            "Sent_From": frmNo,
            "Contact_Name": recepients[index].data.id,
            "Template_Used":utils.id
        }
        ZOHO.CRM.API.insertRecord({
            Entity: "Message360_SMS_History",
            APIData: recData
        }).then(function(data) {
            console.log("Inserting Records into Message360_SMS_History module "+data);
        });

    }
    var report = $('#reportScript').html();
    var reportTemplate = Handlebars.compile(report);
    $("#statusReport").html(reportTemplate({
        data: statusRep
    }));
    $("#getTemp").hide();
    $("#report").show();
    $('#loading').hide();
}
function updateOrgVariable(authVar)
{
    if(authVar=="accntSID")
    {
        var newAccntSid=document.getElementById("modifiedAccntSid").value;
        parameterMap={"apiname":"accSID","value":newAccntSid};
        ZOHO.CRM.CONNECTOR.invokeAPI("crm.set",parameterMap)
.then(function(data){
})
document.getElementById("acSID").innerHTML="<b>Account SID:</b>"+newAccntSid;
    }
    if(authVar=="auth")
    {
        var newAuth=document.getElementById("modifiedAuth").value;
        parameterMap={"apiname":"authToken","value":newAuth};
        ZOHO.CRM.CONNECTOR.invokeAPI("crm.set",parameterMap)
.then(function(data){
})
document.getElementById("authToken").innerHTML="<b>Auth Token:</b>"+newAuth;
    }
}
function closePopUp(toReload) {
    if (toReload) {
        return ZOHO.CRM.UI.Popup.closeReload();
    } else {
        return ZOHO.CRM.UI.Popup.close();
    }

}