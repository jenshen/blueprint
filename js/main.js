// This allows the Javascript code inside this block to only run when the page
// has finished loading in the browser.
$(function() {
    var entering_params = true;
    var layouts_current = 0;
    var layouts_total = 0;

    $('#parameterModal').modal('show');

    $("#createBlueprints").click(function(evt) {
        evt.preventDefault();

        var param_width = document.getElementById("inputWidth").value;
        var param_length = document.getElementById("inputLength").value;
        var param_bedMaster = document.getElementById("inputBedMaster").value;
        var param_bedStandard = document.getElementById("inputBedStandard").value;
        var param_bathFull = document.getElementById("inputBathFull").value;
        var param_bathHalf = document.getElementById("inputBathHalf").value;

        // creates warnings for empty fields
        if (!param_width) {
            $("#inputWidthGroup").addClass("has-error");
        }
        else {
            $("#inputWidthGroup").removeClass("has-error");
        }

        if (!param_length) {
            $("#inputLengthGroup").addClass("has-error");
        }
        else {
            $("#inputWidthGroup").removeClass("has-error");
        }

        if (!param_bedMaster) {
            $("#inputBedMasterGroup").addClass("has-error");
        }
        else {
            $("#inputBedMasterGroup").removeClass("has-error");
        }

        if (!param_bedStandard) {
            $("#inputBedStandardGroup").addClass("has-error");
        }
        else {
            $("#inputBedStandardGroup").removeClass("has-error");
        }

        if (!param_bathFull) {
            $("#inputBathFullGroup").addClass("has-error");
        }
        else {
            $("#inputBathFullGroup").removeClass("has-error");
        }

        if (!param_bathHalf) {
            $("#inputBathHalfGroup").addClass("has-error");
        }
        else {
            $("#inputBathHalfGroup").removeClass("has-error");
        }

        if (param_width && param_length && param_bedMaster && param_bedStandard && param_bathFull && param_bathHalf) {
            $('#parameterModal').modal('hide');
            entering_params = false;

            $("#inputWidthGroup").removeClass("has-error");
            $("#inputWidthGroup").removeClass("has-error");
            $("#inputBedMasterGroup").removeClass("has-error");
            $("#inputBedStandardGroup").removeClass("has-error");
            $("#inputBathFullGroup").removeClass("has-error");
            $("#inputBathHalfGroup").removeClass("has-error");

            document.getElementById("inputWidth").value = "";
            document.getElementById("inputLength").value = "";
            document.getElementById("inputBedMaster").value = "";
            document.getElementById("inputBedStandard").value = "";
            document.getElementById("inputBathFull").value = "";
            document.getElementById("inputBathHalf").value = "";

            // set params
            var params = {};
            params["param_width"] = param_width;
            params["param_length"] = param_length;
            params["param_bedMaster"] = param_bedMaster;
            params["param_bedStandard"] = param_bedStandard;
            params["param_bathFull"] = param_bathFull;
            params["param_bathHalf"] = param_bathHalf;

            if (document.getElementById("inputKitchen").checked) {
                params["param_kitchen"] = 1;
            }
            else {
                params["param_kitchen"] = 0;
            }

            if (document.getElementById("inputDining").checked) {
                params["param_dining"] = 1;
            }
            else {
                params["param_dining"] = 0;
            }

            if (document.getElementById("inputLiving").checked) {
                params["param_living"] = 1;
            }
            else {
                params["param_living"] = 0;
            }


            // call the blueprint function
            layouts_current = 1;
            layouts_total = 25;
            $("#menu-top-control-layout").empty();
            $("#menu-top-control-layout").append(" " + layouts_current + "/" + layouts_total + " ");
        }
    });
    
    //////////////////////////////////////////////////////////
    // CONTROL LAYOUT CHANGES
    //////////////////////////////////////////////////////////

    $("#swipe-left").click(function(evt) {
        layouts_current = layouts_current - 1;
        if (layouts_current <= 0) {
            layouts_current = layouts_total;
        }

        $("#menu-top-control-layout").empty();
        $("#menu-top-control-layout").append(" " + layouts_current + "/" + layouts_total + " ");
    });

    $("#swipe-right").click(function(evt) {
        layouts_current = layouts_current + 1;
        if (layouts_current > layouts_total) {
            layouts_current = 1;
        }

        $("#menu-top-control-layout").empty();
        $("#menu-top-control-layout").append(" " + layouts_current + "/" + layouts_total + " ");
    });

    $(document).keydown( function(e) {
        if (!entering_params) {
            var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
            if (key == 37) {
                e.preventDefault();
                $("#swipe-left").click();
            }
            else if (key == 39) {
                e.preventDefault();
                $("#swipe-right").click();
            }
        }
    });



    //////////////////////////////////////////////////////////
    // SAVE SCAD FILE
    //////////////////////////////////////////////////////////
    $("#btn-download-scad").click(function(evt) {
        var link = document.getElementById("blob-dump");

        var text = "";

        var blob = new Blob([text], {type: 'text/plain'});
        var url = window.URL.createObjectURL(blob);

        link.href = url;
        link.click();

        window.URL.revokeObjectURL(url);
    });

    $("#btn-download-png").click(function(evt) {
        alert("png!");
    });

});








