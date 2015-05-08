// This allows the Javascript code inside this block to only run when the page
// has finished loading in the browser.
$(function() {
    var entering_params = true;
    var layouts_current = 1;
    var layouts_total = 0;
    var layout_width = 0;
    var layout_length = 0;

    var data_all_layout = {};

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

            data_all_layout = createBlueprints(params);
            console.log(data_all_layout);

            layouts_current = 1;
            layouts_total = data_all_layout["layoutCount"];
            $("#menu-top-control-layout").empty();
            $("#menu-top-control-layout").append(" " + layouts_current + "/" + layouts_total + " ");

            layout_width = param_width;
            layout_length = param_length;
            create_2D(data_all_layout[layouts_current - 1][0]);
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
        create_2D(data_all_layout[layouts_current - 1][0]);
    });

    $("#swipe-right").click(function(evt) {
        layouts_current = layouts_current + 1;
        if (layouts_current > layouts_total) {
            layouts_current = 1;
        }

        $("#menu-top-control-layout").empty();
        $("#menu-top-control-layout").append(" " + layouts_current + "/" + layouts_total + " ");
        create_2D(data_all_layout[layouts_current - 1][0]);
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
    // SAVE SCAD FILE & PNG FILE
    //////////////////////////////////////////////////////////
    $("#btn-download-scad").click(function(evt) {
        var link = document.getElementById("blob-dump");

        var text = create_3D(data_all_layout[layouts_current - 1][0]);

        var blob = new Blob([text], {type: 'text/plain'});
        var url = window.URL.createObjectURL(blob);

        link.href = url;
        link.click();

        window.URL.revokeObjectURL(url);
    });

    $("#btn-download-png").click(function(evt) {
        alert("png!");
    });


    //////////////////////////////////////////////////////////
    // DRAW 3D SCAD FILE
    //////////////////////////////////////////////////////////
    function create_3D (floor_data) {
        var data = "";
        data = "module exterior(width, length, height, thickness){union() {translate([0,0,-1.5*thickness]) {cube([width,length,1.5*thickness]);}translate([-thickness,-thickness,-0.5*thickness]) {cube([width + thickness,thickness,height + 0.5*thickness]);}translate([-thickness,-thickness,-0.5*thickness]) {cube([thickness,length + thickness,height + 0.5*thickness]);}translate([width,-thickness,-0.5*thickness]) {cube([thickness,length + 2*thickness,height + 0.5*thickness]);}translate([-thickness,length,-0.5*thickness]) {cube([width + 2*thickness,thickness,height + 0.5*thickness]);}}}module wall_x(x1, y1, x2, y2, height, thickness) {translate([x1 - 0.5*thickness,y1 - 0.5*thickness, 0]) {cube([x2 - x1 + thickness, thickness,height-thickness]);}}module wall_y(x1, y1, x2, y2, height, thickness) {translate([x1 - 0.5*thickness,y1 - 0.5 * thickness, 0]) {cube([thickness, y2 - y1 + thickness,height-thickness]);}}";
        data += "difference() {union() {exterior(" + layout_width + "," + layout_length + ",10,0.4);";

        // add walls here
        var room_count = floor_data["roomCount"];
        for (var i = 0; i < room_count; i++) {
            var room_data = floor_data["rooms"][i];
            var x1 = room_data[0];
            var y1 = room_data[1];
            var x2 = room_data[2];
            var y2 = room_data[3];

            if (x1 != 0) {
                data += "wall_y(" + x1 + "," + y1 + "," + x1 + "," + y2 + ", 10, 0.4);";
            }
            if (x2 != layout_width) {
                data += "wall_y(" + x2 + "," + y1 + "," + x2 + "," + y2 + ", 10, 0.4);";
            }
            if (y1 != 0) {
                data += "wall_x(" + x1 + "," + y1 + "," + x2 + "," + y1 + ", 10, 0.4);";
            }
            if (y2 != layout_length) {
                data += "wall_x(" + x1 + "," + y2 + "," + x2 + "," + y2 + ", 10, 0.4);";
            }
        }
        data += "}";

        // add doors here
        for (var i = 0; i < room_count; i++) {
            var door_data = floor_data["doors"][i];
            var x1 = door_data[0];
            var y1 = door_data[1];
            var x2 = door_data[2];
            var y2 = door_data[3];

            if (x1 != 0) {
                data += "wall_y(" + x1 + "," + y1 + "," + x1 + "," + y2 + ", 7, 0.6);";
            }
            if (x2 != layout_width) {
                data += "wall_y(" + x2 + "," + y1 + "," + x2 + "," + y2 + ", 7, 0.6);";
            }
            if (y1 != 0) {
                data += "wall_x(" + x1 + "," + y1 + "," + x2 + "," + y1 + ", 7, 0.6);";
            }
            if (y2 != layout_length) {
                data += "wall_x(" + x1 + "," + y2 + "," + x2 + "," + y2 + ", 7, 0.6);";
            }
        }
        data += "}";

        return data;
    }


    //////////////////////////////////////////////////////////
    // DRAW 2D CANVAS
    //////////////////////////////////////////////////////////
    function draw_wall(x1, y1, x2, y2) {
        var canvas = document.getElementById("layout-canvas");

        var ctx = canvas.getContext("2d");
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    function create_2D (floor_data) {
        var canvas = document.getElementById("layout-canvas");

        var offset_x = 20;
        var offset_y = 20;
        var draw_size_x = canvas.width - (2 * offset_x);
        var draw_size_y = canvas.height - (2 * offset_y);

        var ctx = canvas.getContext("2d");
        ctx.fillStyle = "#003366";
        ctx.fillRect(0, 0, 600, 600);


        var ratio_width = draw_size_x / layout_width;
        var ratio_length = draw_size_y / layout_length;
        var ratio_max = Math.min(ratio_width, ratio_length);

        // draw exterior
        if (ratio_width < ratio_length) {
            draw_wall(offset_x, (canvas.height / 2) - (layout_length * ratio_max / 2), canvas.width - offset_x, (canvas.height / 2) - (layout_length * ratio_max / 2));
            draw_wall(offset_x, (canvas.height / 2) + (layout_length * ratio_max / 2), canvas.width - offset_x, (canvas.height / 2) + (layout_length * ratio_max / 2));
            draw_wall(offset_x, (canvas.height / 2) - (layout_length * ratio_max / 2), offset_x, (canvas.height / 2) + (layout_length * ratio_max / 2));
            draw_wall(canvas.width - offset_x, (canvas.height / 2) - (layout_length * ratio_max / 2), canvas.width - offset_x, (canvas.height / 2) + (layout_length * ratio_max / 2)); 
        }
        else {
            draw_wall((canvas.width / 2) - (layout_width * ratio_max / 2), offset_y, (canvas.width / 2) - (layout_width * ratio_max / 2), canvas.height - offset_y);
            draw_wall((canvas.width / 2) + (layout_width * ratio_max / 2), offset_y, (canvas.width / 2) + (layout_width * ratio_max / 2), canvas.height - offset_y);
            draw_wall((canvas.width / 2) - (layout_width * ratio_max / 2), offset_y, (canvas.width / 2) + (layout_width * ratio_max / 2), offset_y);
            draw_wall((canvas.width / 2) - (layout_width * ratio_max / 2), canvas.height - offset_y, (canvas.width / 2) + (layout_width * ratio_max / 2), canvas.height - offset_y); 
        }

        // draw walls
        var room_count = floor_data["roomCount"];
        for (var i = 0; i < room_count; i++) {
            var room_data = floor_data["rooms"][i];
            var x1 = room_data[0];
            var y1 = room_data[1];
            var x2 = room_data[2];
            var y2 = room_data[3];

            if (ratio_width < ratio_length) {
                draw_wall(x1 * ratio_max + offset_x, (canvas.height / 2) - (layout_length * ratio_max / 2) + y1 * ratio_max, x2 * ratio_max + offset_x, (canvas.height / 2) - (layout_length * ratio_max / 2) + y1 * ratio_max);
                draw_wall(x1 * ratio_max + offset_x, (canvas.height / 2) - (layout_length * ratio_max / 2) + y2 * ratio_max, x2 * ratio_max + offset_x, (canvas.height / 2) - (layout_length * ratio_max / 2) + y2 * ratio_max);
                draw_wall(x1 * ratio_max + offset_x, (canvas.height / 2) - (layout_length * ratio_max / 2) + y1 * ratio_max, x1 * ratio_max + offset_x, (canvas.height / 2) - (layout_length * ratio_max / 2) + y2 * ratio_max);
                draw_wall(x2 * ratio_max + offset_x, (canvas.height / 2) - (layout_length * ratio_max / 2) + y1 * ratio_max, x2 * ratio_max + offset_x, (canvas.height / 2) - (layout_length * ratio_max / 2) + y2 * ratio_max);
            }
            else {
                draw_wall((canvas.width / 2) - (layout_width * ratio_max / 2) + x1 * ratio_max, y1 * ratio_max + offset_y, (canvas.width / 2) - (layout_width * ratio_max / 2) + x2 * ratio_max, y1 * ratio_max + offset_y);
                draw_wall((canvas.width / 2) - (layout_width * ratio_max / 2) + x1 * ratio_max, y2 * ratio_max + offset_y, (canvas.width / 2) - (layout_width * ratio_max / 2) + x2 * ratio_max, y2 * ratio_max + offset_y);
                draw_wall((canvas.width / 2) - (layout_width * ratio_max / 2) + x1 * ratio_max, y1 * ratio_max + offset_y, (canvas.width / 2) - (layout_width * ratio_max / 2) + x1 * ratio_max, y2 * ratio_max + offset_y);
                draw_wall((canvas.width / 2) - (layout_width * ratio_max / 2) + x2 * ratio_max, y1 * ratio_max + offset_y, (canvas.width / 2) - (layout_width * ratio_max / 2) + x2 * ratio_max, y2 * ratio_max + offset_y);
            }
        }

        // draw doors
    }
});








