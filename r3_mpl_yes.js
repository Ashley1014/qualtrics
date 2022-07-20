//for R3_mpl_yes
Qualtrics.SurveyEngine.addOnload(function()
{
    /*Place your JavaScript here to run when the page loads*/


});

Qualtrics.SurveyEngine.addOnReady(function()
{
    /*Place your JavaScript here to run when the page is fully displayed*/

    let radio1 = document.getElementsByTagName("input");
    const first_id = radio1[0].id;
    //console.log("first button id is ", first_id);
    const arr = first_id.split("~");
    let basenum = Number(arr[arr.length-2]);
    let qid = arr[1];
    let display_order = parseInt("${e://Field/display_order}");
    let led_value = 1 + display_order;
    let hal_value = 3 - led_value;

    let value;

    let len;
    let sp;
    let switch_row;

    let sp_main;
    let row_main;

    editLabels(qid, 1, 5);
    let wtp_upper = parseInt("${q://QID514/ChoiceTextEntryValue}");
    let wtp_lower = wtp_upper-1;
    // let wtp_lower = 27;
    // let wtp_upper = 34;
    // console.log("wtp_lower is", wtp_lower);
    // console.log("wtp_upper is", wtp_upper);

    //displayRevised(qid, basenum);
    checkRevised();
    add_button_events();

    let nextbutton = document.getElementById("NextButton");

    nextbutton.onclick = function() {
        alert("next button was clicked");
        findSwitchPoint(qid);
        if (isLedLeft()) {
            value = 1;
        } else {
            value = 2;
        }
        //checkRevised();
        calculate_wtp(qid, value);
    };

    /**
     *
     * checks whether the page has been initialized for the first time,
     * if not, check whether the round3 choices have been revised.
     */
    function checkRevised() {
        let r3_main = "${e://Field/switchpoint_round_3_yes}";
        let r3_row = "${e://Field/switch_row_round_3_yes}";
        //console.log("r3_main is ", r3_main);
        //console.log("r3_row is ", r3_row);
        if (r3_main !== "") {
            // let r1_main = parseInt("${e://Field/switchpoint}");
            // let r1_row = parseInt("${e://Field/switch_row_main}");
            sp = Number(r3_main);
            if (sp === 3) {
                switch_row = Number(r3_row);
            } if (sp === 2) {
                switch_row = len - 1;
            } else {
                switch_row = -1;
            }
            fill_in_table(qid, switch_row, value);
        } else {
            displayRevised(qid, basenum);
        }
    }

    function displayRevised(qid, basenum) {
        let wtp_upper = parseInt("${q://QID514/ChoiceTextEntryValue}");
        let wtp_lower = wtp_upper - 1;
        // let wtp_lower = 27;
        // let wtp_upper = 34;
        // console.log("wtp_lower is", wtp_lower);
        // console.log("wtp_upper is", wtp_upper);

        console.log("testing displayrevised");

        let row = -1;
        const rows = document.getElementsByClassName("ChoiceRow");
        let len = rows.length;
        let lower_bound;
        let upper_bound;
        for (let i = 0; i < len - 1; i++) {
            const ida_lower = qid + "-" + (i + basenum).toString() + "-" + led_value.toString() +"-label";
            //console.log("ida_lower is ", ida_lower);
            const idb_lower = qid + "-" + (i + basenum).toString() + "-" + hal_value.toString() +"-label";
            //console.log("idb_lower is ", idb_lower);
            const ida_upper = qid + "-" + (i + basenum + 1).toString() + "-" + led_value.toString() +"-label";
            //console.log("ida_upper is ", ida_upper);
            const idb_upper = qid + "-" + (i + basenum + 1).toString() + "-" + hal_value.toString() +"-label";
            //console.log("idb_upper is ", idb_upper);
            let led_text_lower = document.getElementById(ida_lower).textContent;
            let led_num_lower = Number(led_text_lower.substring(led_text_lower.indexOf("$")+1));
            let led_text_upper = document.getElementById(ida_upper).textContent;
            let led_num_upper = Number(led_text_upper.substring(led_text_upper.indexOf("$")+1));
            let hal_text_lower = document.getElementById(idb_lower).textContent;
            let hal_num_lower = Number(hal_text_lower.substring(hal_text_lower.indexOf("$")+1));
            let hal_text_upper = document.getElementById(idb_upper).textContent;
            let hal_num_upper = Number(hal_text_upper.substring(hal_text_upper.indexOf("$")+1));
            lower_bound = Math.min((led_num_lower - hal_num_lower), (led_num_upper - hal_num_upper));
            upper_bound = Math.max((led_num_lower - hal_num_lower), (led_num_upper - hal_num_upper));
            // console.log("lower bound is ", lower_bound);
            // console.log("upper bound is ", upper_bound);
            // console.log("here");
            if (wtp_upper <= upper_bound && wtp_lower >= lower_bound) {
                row = i;
                break;
            }
        }
        if (display_order === 0) {
            if (wtp_upper > upper_bound) {
                row = len - 1;
            }
        } else if (display_order === 1) {
            const ida_lower = qid + "-" + (len-1 + basenum).toString() + "-" + led_value.toString() +"-label";
            const idb_lower = qid + "-" + (len-1 + basenum).toString() + "-" + hal_value.toString() +"-label";
            let led_text_lower = document.getElementById(ida_lower).textContent;
            let led_num_lower = Number(led_text_lower.substring(led_text_lower.indexOf("$")+1));
            let hal_text_lower = document.getElementById(idb_lower).textContent;
            let hal_num_lower = Number(hal_text_lower.substring(hal_text_lower.indexOf("$")+1));
            let min_wtp = led_num_lower - hal_num_lower;
            if (wtp_lower < min_wtp) {
                row = len - 1;
            }
        }
        //console.log("switch point is ", row);
        for (let i = 0; i < rows.length; i++) {
            if (i <= row) {
                const choice_a = "QR~" + qid + "~" + (i + basenum).toString() + "~1";
                const choice_b = "QR~" + qid + "~" + (i + basenum).toString() + "~2";
                document.getElementById(choice_a).checked = true;
                document.getElementById(choice_b).checked = false;
            } else {
                // rows[i].style.backgroundColor = color_orange;
                const choice_a = "QR~" + qid + "~" + (i + basenum).toString() + "~1";
                const choice_b = "QR~" + qid + "~" + (i + basenum).toString() + "~2";
                document.getElementById(choice_a).checked = false;
                document.getElementById(choice_b).checked = true;
            }
        }
    }

    function editLabels(QID, inita, incra) {
        let num = parseInt("${e://Field/display_order}");
        //let num = 0;
        //console.log(num);
        const rows = document.getElementsByClassName("ChoiceRow");
        for (let i = 0; i < rows.length; i++) {
            const ida = QID+"-"+(i+basenum).toString()+"-1-label";
            const idb = QID+"-"+(i+basenum).toString()+"-2-label";
            if (num === 0) {
                if (i === 0) {
                    document.getElementById(ida).innerHTML="<u>Choice A:&nbsp;<em>LED 4-pack</em></u><br /><strong>$"+(inita+i*incra).toString()+"</strong>";
                    document.getElementById(idb).innerHTML="<u>Choice B:&nbsp;<em>Halogen 4-pack</em></u><br /><strong>$"+(inita+(rows.length-i-1)*incra).toString()+"</strong>";
                }
                else {
                    document.getElementById(ida).innerHTML="<strong>$"+(inita+i*incra).toString()+"</strong>";
                    document.getElementById(idb).innerHTML="<strong>$"+(inita+(rows.length-i-1)*incra).toString()+"</strong>";
                }
            } else {
                if (i === 0) {
                    document.getElementById(idb).innerHTML="<u>Choice B:&nbsp;<em>LED 4-pack</em></u><br /><strong>$"+(inita+(rows.length-i-1)*incra).toString()+"</strong>";
                    document.getElementById(ida).innerHTML="<u>Choice A:&nbsp;<em>Halogen 4-pack</em></u><br /><strong>$"+(inita+i*incra).toString()+"</strong>";
                }
                else {
                    document.getElementById(idb).innerHTML="<strong>$"+(inita+(rows.length-i-1)*incra).toString()+"</strong>";
                    document.getElementById(ida).innerHTML="<strong>$"+(inita+i*incra).toString()+"</strong>";
                }
            }
        }
    }

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
            if (i < Number(row_number)) {
                document.getElementById(choice_a).checked = true;
                document.getElementById(choice_b).checked = false;
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
        Qualtrics.SurveyEngine.setEmbeddedData("switchpoint_round_3_yes", switch_point);
        Qualtrics.SurveyEngine.setEmbeddedData("switch_row_round_3_yes", switch_row);
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
        // console.log("lower bound for led is ", ida_lower);
        // console.log("lower bound for halogen is ", idb_lower);
        var lower_bound_led;
        var lower_bound_hal;
        if (lower_led === 0) {
            const text_led = document.getElementById(ida_lower).textContent;
            lower_bound_led = text_led.substring(text_led.indexOf('$') + 1);
        } if (lower_hal === 0) {
            const text_hal = document.getElementById(idb_lower).textContent;
            lower_bound_hal = text_hal.substring(text_hal.indexOf('$')+1);
        }
        else {
            lower_bound_led = document.getElementById(ida_lower).textContent.substring(1);
            lower_bound_hal = document.getElementById(idb_lower).textContent.substring(1);
        }

        Qualtrics.SurveyEngine.setEmbeddedData("initial_list_value_led_r3_yes", lower_bound_led);
        Qualtrics.SurveyEngine.setEmbeddedData("initial_list_value_hal_r3_yes", lower_bound_hal);
        console.log("it's just a dummy test for r3 mpl yes");
        console.log("lower bound led is ", lower_bound_led);
        console.log("lower bound hal is ", lower_bound_hal);
    }
});

Qualtrics.SurveyEngine.addOnUnload(function()
{
    /*Place your JavaScript here to run when the page is unloaded*/

});