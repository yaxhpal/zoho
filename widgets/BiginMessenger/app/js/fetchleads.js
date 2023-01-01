var table = $('#leads').DataTable({
    data: [],
    columnDefs: [{
        'targets': 0,
        'searchable': false,
        'orderable': false,
        'className': 'dt-body-center',
        'render': function (data, type, full, meta) {
            return '<input type="checkbox" name="id[]" value="' + $('<div/>').text(data).html() + '">';
        }
    }]
});
$(document).ready(function () {
    ZOHO.embeddedApp.on("PageLoad", function (onloadData) {
        function fetchRecords(page_number) {
            console.log("Page number: " + page_number);
            $('#module_name').val('Leads');
            ZOHO.CRM.API.getRelatedRecords({
                Entity: "Campaigns",
                RecordID: "4028966000000269058",
                RelatedList: "Leads",
                page: page_number,
                per_page: 200
            }).then(function (data) {
                allLeads = [];
                data.data.forEach(element => {
                    lead = [
                        element["id"],
                        element["First_Name"],
                        element["Last_Name"],
                        element["Phone"],
                        element["Email"],
                        element["City"],
                        element["State"],
                        element["Campaign_Code"]

                    ];
                    allLeads.push(lead);
                });
                table.rows.add(allLeads).draw();
                if (allLeads.length == 200) {
                    fetchRecords(page_number + 1)
                } else {
                    console.log("Got all Leads");
                }
            });
        }
        fetchRecords(1);
    });

    // ZOHO.CRM.API.getRelatedRecords({
    //     Entity:"Campaigns",
    //     RecordID:"4028966000000269058",
    //     RelatedList:"Leads",
    //     page:1,
    //     per_page:200
    // }).then(function(data){
    //     console.log(data)
    // });

    $('#select-all').on('click', function () {
        var rows = table.rows({
            'search': 'applied'
        }).nodes();
        if (this.checked) {
            $(rows).addClass('selected');
        } else {
            $(rows).removeClass('selected');
        }
        $('input[type="checkbox"]', rows).prop('checked', this.checked);
    });

    $('#submit-campaign').submit(function() {
        var rows = table.rows('.selected')
        $("#all_records").val(JSON.stringify(rows.data().toArray()));    
        $("#record_count").val(rows.count());     
        return true;
    });

    ZOHO.embeddedApp.init();
});

