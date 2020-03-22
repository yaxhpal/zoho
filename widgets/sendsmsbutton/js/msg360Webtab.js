values={};
$(document).ready(function() {
    //debugger;
    ZOHO.embeddedApp.init().then(function() {
        // $('#loading').show();
       $('#newLoad').show();
        
        ZOHO.CRM.CONFIG.getOrgVariable("accSID").then(function(data) {
            accntSID = data.Success.Content;
        }).then(function() {
            
            ZOHO.CRM.CONFIG.getOrgVariable("authToken").then(function(data) {
                auth = data.Success.Content;
                if(accntSID!=""&&auth!="")
                {
                    //debugger;
                    $("#edit").show();
                    $("#saveNcancel").hide();
                    document.getElementById("accntSidDefult").innerHTML="<p>"+accntSID+"</p>";
                    document.getElementById("authTokenDefult").innerHTML="<p>"+auth+"</p>";
                }
                else
                {
                    $("#saveNcancel").show();
                    document.getElementById("accntSidDefult").innerHTML='<input class="fldtype" type="text" name="" id="modifiedAccntSid" /> ';
                    document.getElementById("authTokenDefult").innerHTML='<input class="fldtype" type="text" name="" id="modifiedAuth"/> ';
                }
                str = accntSID + ":" + auth;
                encodedAuth = btoa(str);

            }).then(function() {
                var today = new Date();
                var tdate = today.toISOString().substring(0, 10);
                request = {
                    url: "https://api.message360.com/api/v3/accounts/viewaccount.json",
                    params: {
                        AccountSid: accntSID,
                        returnType: "json",
                        date: tdate
                    },
                    headers: {
                        Authorization: "Basic " + encodedAuth,
                    }
                }
                ZOHO.CRM.HTTP.get(request)
                    .then(function(data) {
                        var response = JSON.parse(data);
                        console.log("viewaccount response: "+response);
                        if(response.Message360.ResponseStatus==0)
                        {
                            document.getElementById("tab2").innerHTML="<h3>Error: Account settings not configured correctly... <h3>";
                        }
                        else
                        {
                        
                        document.getElementById("accntBalance").innerHTML = response.Message360.Message.AccountBalance;
                    }
                   })
                    .then(function() {
                        request = {
                            url: "https://api.message360.com/api/v3/incomingphone/listnumber.json",
                            params: {
                                AccountSid: accntSID,
                                returnType: "json",
                                page: "1",
                                pagesize: "20",
                            },
                            headers: {
                                Authorization: "Basic " + encodedAuth,
                            }
                        }
                        ZOHO.CRM.HTTP.get(request)
                            .then(function(data) {
                                var list = JSON.parse(data);
                                if(list.Message360.ResponseStatus==0)
                        {
                            document.getElementById("tab3").innerHTML="<h3>Error: Account settings not configured correctly... <h3>";
                        }
                        else
                        {
                                return numberTemplate("phoneNumbers", "listNumbers", list.Message360.Phones);
                        }
                            })
                            .then(function() {
                                       $('#newLoad').hide();

                            })
                            })
        //             })
        //     })
        })
    })
    })
})
function showInput()
{ 

    $("#saveNcancel").show();
    var acSId= document.getElementById("accntSidDefult").getElementsByTagName("p")[0].innerHTML;
    var authTok= document.getElementById("authTokenDefult").getElementsByTagName("p")[0].innerHTML;
    document.getElementById("accntSidDefult").innerHTML='<input class="fldtype" type="text" name="" value="'+acSId+'" id="modifiedAccntSid"/>';
    document.getElementById("authTokenDefult").innerHTML='<input class="fldtype" type="text" name="" value="'+authTok+'" id="modifiedAuth"/>';
}
function saveOrgVar()
{
    $("#saveNcancel").show();
    var newAccntSid=document.getElementById("modifiedAccntSid").value;
    var newAuth=document.getElementById("modifiedAuth").value;
    if(newAuth==""||newAccntSid=="")
    {
        if(newAccntSid=="")
        {
            document.getElementById("modifiedAccntSid").style.borderBottomColor="#ff0000";
        $("#accntSIDEmpty").show();
        }
        if(newAuth=="")
        {
           document.getElementById("modifiedAuth").style.borderBottomColor="#ff0000";
        $("#authEmpty").show(); 
        }
    }
    else
    {
        $('#newLoad').show();
        parameterMap={"apiname":"accSID","value":newAccntSid};
        ZOHO.CRM.CONNECTOR.invokeAPI("crm.set",parameterMap)
.then(function(data){
}).then(function(){
   parameterMap={"apiname":"authToken","value":newAuth};
        ZOHO.CRM.CONNECTOR.invokeAPI("crm.set",parameterMap)
.then(function(data){
    return reloadWebtab();
    $('#authSuccessMsg').show();
    setTimeout('$("#authSuccessMsg").hide()',6000);
}) 
})
}
}

function numberTemplate(scriptId, divId, data) {
    Handlebars.registerHelper('if_eq', function(a, b, opts) {
        if (a == b) {
            return opts.fn(this);
        } else {
            return opts.inverse(this);
        }
    });

    var numbers = $('#' + scriptId).html();
    var numbersTemplate = Handlebars.compile(numbers);
    $("#" + divId).html(numbersTemplate(data));
}

function releaseNum(num,node) {
    $('#newLoad').show();
    request = {
        url: "https://api.message360.com/api/v3/incomingphone/releasenumber.json",
        params: {
            AccountSid: accntSID,
            returnType: "json",
            phonenumber: num
        },
        headers: {
            Authorization: "Basic " + encodedAuth,
        }
    }
    ZOHO.CRM.HTTP.get(request)
        .then(function(data) {
            $('#newLoad').hide();
            deleteRowfromTable(node);
        })
}
function deleteRowfromTable(node) {
    document.getElementById("phTable").deleteRow($(node).closest('tr').rowIndex);
    $('#NumDelsuccessMsg').show();
    setTimeout('$("#NumDelsuccessMsg").hide()',2000);
}
function listAvailableNumbers() {
        $('#newLoad').show();
    request = {
        url: "https://api.message360.com/api/v3/incomingphone/availablenumber.json",
        params: {
            AccountSid: accntSID,
            returnType: "json",
            numbertype: "sms",
            areacode: "all",
            pagesize: "100"
        },
        headers: {
            Authorization: "Basic " + encodedAuth,
        }
    }
    ZOHO.CRM.HTTP.get(request)
        .then(function(data) {
            var list = JSON.parse(data);
            values.numlist=[];
            values.tempList=[];
            for(var i in list.Message360.Phones.Phone)
            {
               values.numlist.push(list.Message360.Phones.Phone[i]) 
            }
            
            for(var i=0;i<20;i++)
            {
                values.tempList.push(values.numlist[i])
            }
            return numberTemplate("availableNumbers", "showAvailableNumbers", {Phone:values.tempList});
        }).then(function() {
                $('#newLoad').hide();
            $("#num").hide();
            $("#availNum").show();
        })
}

function buyNumbers(index) {
    $('#newLoad').show();
    request = {
        url: "https://api.message360.com/api/v3/incomingphone/buynumber.json",
        params: {
            AccountSid: accntSID,
            returnType: "json",
            phonenumber: document.getElementById("availableNumbersTable").rows[index].cells[0].innerHTML
        },
        headers: {
            Authorization: "Basic " + encodedAuth,
        }
    }
    ZOHO.CRM.HTTP.get(request)
        .then(function(data) {
            $('#NumBuysuccessMsg').show();
    setTimeout('$("#NumBuysuccessMsg").hide()',2000);
            document.getElementById("availableNumbersTable").deleteRow(index);
            $('#newLoad').hide();
        });
    $('#NumBuysuccessMsg').show();
    setTimeout('$("#NumBuysuccessMsg").hide()',2000);
}
function updateName(index)
{
    values.oldVal=document.getElementById("fName").innerHTML;
       var ip="<input type=\"text\"  class=\"fldtype\" id=\"friendlyName\" style=\"width: 200px;\" />"
    ip+='   <input class="btn Bluebtn"  style="margin-top:0px;" type="button" name="Edit" value="Save" onclick="updateFriendlyName()" />'
    ip+="<button class=\"cancel FR\" onclick=\"revert()\">Cancel</button>";
    document.getElementById("fNameSpan").innerHTML=ip;
}
function revert(node)
{
    node.innerHTML=values.oldVal;
    $('#editButton').show();
}
function showModal(node)
{
    $('#editButton').hide();
    values.oldVal=document.getElementById("fName").innerHTML;
    ip="<input type=\"text\" id=\"newFriendlyName\" style=\"border: solid 1px #ddd !important;width: 200px;height:28px;margin-right: 10px;padding-left:10px;font-size: 13px;\" value='"+values.oldVal+"'/>"
    ip+="<button style=\"cursor:pointer;padding: 5px 10px;margin-top: 6px;\" class=\"save FR mL10\" onclick=\"updateFriendlyName(this.parentNode.parentNode.parentNode.parentNode.parentNode.getElementsByTagName('p')[0].innerHTML,this.parentNode)\">Save</button><button style=\"cursor:pointer;float:none;padding: 5px 10px;margin-top: 6px;\" class=\"cancel FR\" onclick=\"revert(this.parentNode)\">Cancel</button>";
    node.innerHTML=ip;
}
function updateFriendlyName(phNo,node){
    $('#newLoad').show();
    var newFriendlyName=document.getElementById("newFriendlyName").value;
    request = {
        url: "https://api.message360.com/api/v3/incomingphone/updatenumber.json",
        params: {
            AccountSid: accntSID,
            returnType: "json",
            phonenumber: phNo,
            friendlyname:newFriendlyName
        },
        headers: {
            Authorization: "Basic " + encodedAuth,
        }
    }
    ZOHO.CRM.HTTP.get(request)
        .then(function(data) {
           node.innerHTML=newFriendlyName;
           $('#editButton').show();
            $('#newLoad').hide();
       });
}
function nextPage(page)
{
    var templatelList=[];
    if(page==1)
    {
        for(var k=0;k<20;k++)
            {
                templatelList.push(values.numlist[k])
            }
    }
    else if(page==2)
    {
        for(var i=20;i<40;i++)
            {
                templatelList.push(values.numlist[i])
            }
    }
    else if(page==3)
    {
        for(var i=40;i<60;i++)
            {
                templatelList.push(values.numlist[i])
            }
    }
    else if(page==4)
    {
        for(var i=60;i<80;i++)
            {
                templatelList.push(values.numlist[i])
            }
    }
    else
    {
        for(var i=80;i<100;i++)
            {
                templatelList.push(values.numlist[i])
            }
            document.getElementById("message").innerHTML="<br>Don\'t want any of these numbers? Chooose from a bigger list <a href='https://portal.message360.com/docs/v2/numbers/buyphonenumber' target='_blank' style='color: #2C7BD0;'>here</a>";
    }
    return numberTemplate("availableNumbers", "showAvailableNumbers", {Phone:templatelList});
}
function reloadWebtab() {
    location.reload();
}