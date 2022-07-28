// for R1_mpl_disc
Qualtrics.SurveyEngine.addOnload(function()
{
    /*Place your JavaScript here to run when the page loads*/

});

Qualtrics.SurveyEngine.addOnReady(function()
{
    /*Place your JavaScript here to run when the page is fully displayed*/
    console.log("testing r1_mpl_disc");

    let condition = "${e://Field/Condition}";
    console.log("condition is ", condition);

    let hal_init = parseInt("${e://Field/hal_init}");
    let hal_incr = parseInt("${e://Field/hal_incr}");
    let disc_rate = parseFloat("${e://Field/disc_rate}");
    let led_init_ori = parseInt("${e://Field/led_init_ori}");
    let led_incr_ori = parseInt("${e://Field/led_incr_ori}");

    const qid = this.questionId;
    let radio1 = document.getElementsByTagName("input");
    const first_id = radio1[0].id;
    //console.log("first button id is ", first_id);
    const arr = first_id.split("~");
    let basenum = Number(arr[arr.length-2]);

    let len;
    let sp;
    let switch_row;
    let value;

    editLabels(qid, led_init_ori, led_incr_ori, hal_init, hal_incr, disc_rate);

    add_button_events();
    let nextbutton = document.getElementById("NextButton");
    nextbutton.onclick = function() {
        //alert("next button was clicked");
        findSwitchPoint(qid);
        if (isLedLeft()) {
            value = 1;
        } else {
            value = 2;
        }
        calculate_wtp(qid, value);
    };

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
            if (i < Number(row_number) && value === 1) {
                document.getElementById(choice_a).checked = true;
                document.getElementById(choice_b).checked = false;
            }
        }
    }

    /**
     * Randomizes the header label position and generates choice values according to the main mpl switch
     point, with LED prices being discounted.
     * @param QID - the question id
     * @param led_init - the initial value of LED ** original ** price
     * @param led_incr - the increment value of LED ** original ** price
     * @param hal_init - the initial value of halogen price
     * @param hal_incr - the increment value of halogen price
     * @param disc_rate - the rate of discount = final LED price / original LED price
     */
    function editLabels(QID, led_init, led_incr, hal_init, hal_incr, disc_rate) {
        const question = document.getElementById(qid);
        const rows = question.getElementsByClassName("ChoiceRow");
        //const rows = document.getElementsByClassName("ChoiceRow");
        const len = rows.length;

        let num = parseInt("${e://Field/display_order}");
        //console.log(num);
        for (let i = 0; i < rows.length; i++) {
            const ida = QID+"-"+(i+basenum).toString()+"-1-label";
            const idb = QID+"-"+(i+basenum).toString()+"-2-label";
            if (num === 0) {
                if (i === 0) {
                    document.getElementById(ida).innerHTML="<u>Choice A:&nbsp;<em>LED 4-pack</em></u><br /><strong><s>$"+(led_init+i*led_incr).toString()+"</s><span style=\"color:red\"> $" + ((led_init+i*led_incr)* disc_rate).toString()+"</span></strong>";
                    document.getElementById(idb).innerHTML="<u>Choice B:&nbsp;<em>Halogen 4-pack</em></u><br /><strong>$"+(hal_init+i*hal_incr).toString()+"</strong>";
                }
                else {
                    document.getElementById(ida).innerHTML="<strong><s>$"+(led_init+i*led_incr).toString()+"</s><span style=\"color:red\"> $" + ((led_init+i*led_incr)* disc_rate).toString()+"</span></strong>";
                    document.getElementById(idb).innerHTML="<strong>$"+(hal_init+i*hal_incr).toString()+"</strong>";
                }
            } else {
                if (i === 0) {
                    document.getElementById(idb).innerHTML="<u>Choice B:&nbsp;<em>LED 4-pack</em></u><br /><strong><s>$"+(led_init+i*led_incr).toString()+"</s><span style=\"color:red\"> $" + ((led_init+i*led_incr)* disc_rate).toString()+"</span></strong>";
                    document.getElementById(ida).innerHTML="<u>Choice A:&nbsp;<em>Halogen 4-pack</em></u><br /><strong>$"+(hal_init+i*hal_incr).toString()+"</strong>";
                }
                else {
                    document.getElementById(idb).innerHTML="<strong><s>$"+(led_init+i*led_incr).toString()+"</s><span style=\"color:red\"> $" + ((led_init+i*led_incr)* disc_rate).toString()+"</span></strong>";
                    document.getElementById(ida).innerHTML="<strong>$"+(hal_init+i*hal_incr).toString()+"</strong>";
                }
            }
        }
    }

    function findSwitchPoint(qid) {
        const question = document.getElementById(qid);
        const rows = question.getElementsByClassName("ChoiceRow");
        len = rows.length;
        //console.log("len is ", len);
        let switch_point;
        //let switch_row;
        let prev_val;
        let curr_val;
        prev_val = findCheckedValue(0);
        //console.log("prev_value is ", prev_val);
        for (let i = 1; i < len; ++i) {
            curr_val = findCheckedValue(i);
            // console.log("when i is ", i);
            // console.log("curr_val is ", curr_val);
            if (curr_val !== prev_val) {
                switch_row = i - 1;
                // set switch_point to 3 if there exists a switch point - certain switch;
                switch_point = 3;
                break;
            }
        }
        //console.log("curr_val is ", curr_val);
        if (prev_val === curr_val) {
            // set switch_point to 1 if all LED choices have been selected;
            // set switch_point to 2 if all halogen choices have been selected;
            switch_point = findSwitchPoint_h(curr_val);
            switch_row = len-1;
        }
        //console.log("your switch point is ", switch_point);
        sp = switch_point;
        //console.log("your switch row is ", switch_row);
        Qualtrics.SurveyEngine.setEmbeddedData("switchpoint_disc", switch_point);
        //return switch_row;
    }

    function findCheckedValue(index) {
        let curr_val;
        const rows = document.getElementsByClassName("ChoiceRow");
        const row = rows[index];
        const radios = row.getElementsByTagName("input");
        for (radio in radios) {
            if (radios[radio].checked) {
                curr_val = radios[radio].value;
            }
        }
        return curr_val;
    }

    /***
     * returns the type of switch point given by the value of switch point.
     * @param value the value of selected choices.
     * @returns {number} - 1 if all LED choices have been selected, 2 if all halogen choices have been selected.
     */
    function findSwitchPoint_h(value) {
        let switch_point;
        // let num = parseInt("${e://Field/display_order}");
        if (isLedLeft()) {
            switch_point = value;
        } else {
            switch_point = 3-value;
        }
        return switch_point;
    }

    function isLedLeft() {
        let num = parseInt("${e://Field/display_order}");
        return num === 0;
    }

    /***
     *
     * @param QID
     * @param value the value of LED choices
     */
    function calculate_wtp(QID, value) {
        //const rows = document.getElementsByClassName("ChoiceRow");

        let lower_led;
        let lower_hal;

        //console.log("sp is ", sp.type);

        if (Number(sp) === 3) {
            //console.log("there is a switch point");
            lower_led = switch_row;
            lower_hal = switch_row;
        } else if (Number(sp) === 1) {
            if (isLedLeft()) {
                //console.log("all led chosen, led is left.");
                lower_led = len - 1;
                lower_hal = len - 1;
                //console.log("lower led bound is ", lower_led);
            } else {
                //console.log("all led chosen, led is right.");
                lower_led = 0;
                lower_hal = 0;
                //console.log("lower led bound is ", lower_led);
            }
        } else {
            //console.log("inside else");
            if (isLedLeft()) {
                lower_led = 0;
                lower_hal = 0;
            } else {
                lower_led = len - 1;
                lower_hal = len - 1;
            }
        }
        const ida_lower = QID+"-"+(lower_led+basenum).toString()+"-"+value.toString()+"-label";
        const idb_lower = QID+"-"+(lower_hal+basenum).toString()+"-"+(3-value).toString()+"-label";
        //console.log("lower bound for led is ", ida_lower);
        //console.log("lower bound for halogen is ", idb_lower);
        // const ida_upper = QID+"-"+(bound_b+480).toString()+"-1-label";
        // const idb_upper = QID+"-"+(bound_b+480).toString()+"-2-label";
        var lower_bound_led;
        var lower_bound_hal;
        const text_led = document.getElementById(ida_lower).textContent;
        lower_bound_led = text_led.substring(text_led.lastIndexOf('$') + 1);
        const text_hal = document.getElementById(idb_lower).textContent;
        lower_bound_hal = text_hal.substring(text_hal.lastIndexOf('$') + 1);
        // lower_bound_led = document.getElementById(ida_lower).textContent.substring(1);
        // lower_bound_hal = document.getElementById(idb_lower).textContent.substring(1);
        // const upper_bound_led = document.getElementById(ida_upper).textContent.substring(1);
        // const upper_bound_hal = document.getElementById(idb_upper).textContent.substring(1);
        // lower_bound = Number(lower_bound_led) - Number(lower_bound_hal);
        // upper_bound = Number(upper_bound_led) - Number(upper_bound_hal);
        Qualtrics.SurveyEngine.setEmbeddedData("lower_led_disc_main", lower_bound_led);
        Qualtrics.SurveyEngine.setEmbeddedData("lower_hal_disc_main", lower_bound_hal);
        console.log("lower bound led is ", lower_bound_led);
        console.log("lower bound hal is ", lower_bound_hal);
    }
});

Qualtrics.SurveyEngine.addOnUnload(function()
{
    /*Place your JavaScript here to run when the page is unloaded*/

});