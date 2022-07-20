// for R1_fmpl_disc
Qualtrics.SurveyEngine.addOnload(function()
{
    /*Place your JavaScript here to run when the page loads*/


});

Qualtrics.SurveyEngine.addOnReady(function()
{
    /*Place your JavaScript here to run when the page is fully displayed*/
    const qid = this.questionId;
    //console.log(qid);
    const switchpoint = parseInt("${e://Field/switchpoint_disc}");
    const init_led = parseInt("${e://Field/lower_led_disc_main}");
    const init_hal = parseInt("${e://Field/lower_hal_disc_main}");
    //console.log("switch point is ", switchpoint);
    //console.log("init led price is ", init_led);
    //console.log("init hal price is ", init_hal);

    let radio1 = document.getElementsByTagName("input");
    const first_id = radio1[0].id;
    //console.log("first button id is ", first_id);
    const arr = first_id.split("~");
    let basenum = Number(arr[arr.length-2]);

    editLabels(qid, 0.5);
    add_button_events();
    function add_button_events(){
        let radio1 = document.getElementsByTagName("input");
        for(radio in radio1) {
            radio1[radio].onclick = function() {
                //console.log("button pressed");
                update_table(this.value, this.id);
            }
        }
    }

    function update_table(button_value, button_id) {
        const value = Number(button_value);
        const arr = button_id.split("~");
        const qid = arr[1];
        //console.log(qid);
        const num = arr[arr.length-1];
        let row = Number(arr[arr.length-2])-basenum;
        //console.log(button_id);
        if (num === 1) {
            row = row+1;
        }
        //console.log(row);
        fill_in_table(qid, row, value);
        //calculate_wtp(qid, row);
    }

    function fill_in_table(QID, row_number, value) {
        const rows = document.getElementsByClassName("ChoiceRow");
        for (let i = 0; i < rows.length; i++) {
            const choice_a = "QR~" + QID + "~"+(i+basenum).toString()+"~1";
            const choice_b = "QR~" + QID + "~"+(i+basenum).toString()+"~2";
            if (i >= Number(row_number) && value === 2) {
                document.getElementById(choice_a).checked = false;
                document.getElementById(choice_b).checked = true;
            }
            if (i < Number(row_number)) {
                document.getElementById(choice_a).checked = true;
                document.getElementById(choice_b).checked = false;
            }
        }
    }

    /**
     * Randomizes the header label position and generates choice values according to the main mpl switch
     point.
     * @param QID - the question id
     * @param disc_rate
     */
    function editLabels(QID, disc_rate) {
        const rows = document.getElementsByClassName("ChoiceRow");
        const len = rows.length;
        let sp = parseInt("${e://Field/switchpoint_disc}");
        let ledLeft = isLedLeft();
        let init_led;
        let init_hal;
        let incr_led;
        let incr_hal;
        if (sp === 3) {
            init_led = parseInt("${e://Field/lower_led_disc_main}");
            init_hal = parseInt("${e://Field/lower_hal_disc_main}");
            if (ledLeft) {
                incr_led = 1;
                incr_hal = -1;
            } else {
                incr_led = -1;
                incr_hal = 1;
            }
        }
        // all led being chosen
        else if (sp === 1) {
            init_led = parseInt("${e://Field/lower_led_disc_main}");
            init_hal = 1;
            // all choice a has been chosen
            if (ledLeft) {
                incr_led = 5;
                incr_hal = 0;
            }
            // all choice b has been chosen
            else {
                incr_led = -5;
                incr_hal = 0;
            }
        }
        // all hal being chosen
        else {
            init_led = 1;
            init_hal = parseInt("${e://Field/lower_hal_disc_main}");
            // all choice b has been chosen
            if (ledLeft) {
                incr_hal = -5;
                incr_led = 0;
            }
            // all choice a has been chosen
            else {
                incr_hal = 5;
                incr_led = 0;
            }
        }
        let num = parseInt("${e://Field/display_order}");
        //console.log(num);
        for (let i = 0; i < rows.length; i++) {
            const ida = QID+"-"+(i+basenum).toString()+"-1-label";
            const idb = QID+"-"+(i+basenum).toString()+"-2-label";
            const led_original = init_led + i * incr_led;
            const led_disc = disc_rate * led_original;
            if (num === 0) {
                if (i === 0) {
                    document.getElementById(ida).innerHTML="<u>Choice A:&nbsp;<em>LED 4-pack</em></u><br /><strong><s>$"+(led_original).toString()+"</s><span style=\"color:red\"> $" + (led_disc).toString()+"</span></strong>";
                    document.getElementById(idb).innerHTML="<u>Choice B:&nbsp;<em>Halogen 4-pack</em></u><br /><strong>$"+(init_hal+i*incr_hal).toString()+"</strong>";
                }
                else {
                    document.getElementById(ida).innerHTML="<strong><s>$"+led_original.toString()+"</s><span style=\"color:red\"> $" + led_disc.toString()+"</span></strong>";
                    document.getElementById(idb).innerHTML="<strong>$"+(init_hal+i*incr_hal).toString()+"</strong>";
                }
            } else {
                if (i === 0) {
                    document.getElementById(idb).innerHTML="<u>Choice B:&nbsp;<em>LED 4-pack</em></u><br /><strong><s>$"+(led_original).toString()+"</s><span style=\"color:red\"> $" + (led_disc).toString()+"</span></strong>";
                    document.getElementById(ida).innerHTML="<u>Choice A:&nbsp;<em>Halogen 4-pack</em></u><br /><strong>$"+(init_hal+i*incr_hal).toString()+"</strong>";
                }
                else {
                    document.getElementById(idb).innerHTML="<strong><s>$"+led_original.toString()+"</s><span style=\"color:red\"> $" + led_disc.toString()+"</span></strong>";
                    document.getElementById(ida).innerHTML="<strong>$"+(init_hal+i*incr_hal).toString()+"</strong>";
                }
            }
        }
    }

    function isLedLeft() {
        let num = parseInt("${e://Field/display_order}");
        return num === 0;
    }
});