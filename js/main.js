// This allows the Javascript code inside this block to only run when the page
// has finished loading in the browser.
$(function() {
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
            var blueprintsJSON = createBlueprints(params);

        }

    });

    
    $("#swipe-left").click(function(evt) {
        alert("left");
    });

    $("#swipe-right").click(function(evt) {
        alert("right");
    });
	

});









