// for R1_fmpl
Qualtrics.SurveyEngine.addOnload(function()
{
    /*Place your JavaScript here to run when the page loads*/


});

Qualtrics.SurveyEngine.addOnReady(function()
{
    console.log("testing R1_fmpl");
    /*Place your JavaScript here to run when the page is fully displayed*/
    const qid = this.questionId;
    //console.log(qid);
    const switchpoint = parseInt("${e://Field/switchpoint}");
    const led = parseInt("${e://Field/lower_bound_main_led}");
    const hal = parseInt("${e://Field/lower_bound_main_hal}");
    let basenum;
    let radio1 = document.getElementsByTagName("input");
    const first_id = radio1[0].id;
    //console.log("first button id is ", first_id);
    const arr = first_id.split("~");
    basenum = Number(arr[arr.length-2]);
    //console.log("switch point is ", switchpoint);
    //console.log("led price is ", led);
    //console.log("hal price is ", hal);
    editLabels(qid, switchpoint, led, hal);
    add_button_events();

    let len;
    let sp;
    let switch_row;
    let value;

    let nextbutton = document.getElementById("NextButton");
    nextbutton.onclick = function() {
        //alert("next button was clicked");
        findSwitchPoint(qid);
        if (isLedLeft()) {
            value = 1;
        } else {
            value = 2;
        }
        calculate_wtp(qid, value, 1);
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
            if (i < Number(row_number) && value === 1) {
                document.getElementById(choice_a).checked = true;
                document.getElementById(choice_b).checked = false;
            }
        }
    }


    /**
     * Randomizes the header label position and generates choice values according to the main mpl switch
     point.
     * @param QID - the question id
     * @param switchpoint - the switch point of the main mpl question if there's any
     * @param led - the initial value of choice A options
     * @param hal - the initial value of choice B options
     */
    function editLabels(QID, switchpoint, led, hal) {
        const rows = document.getElementsByClassName("ChoiceRow");
        const len = rows.length;
        let sp = parseInt("${e://Field/switchpoint}");
        let ledLeft = isLedLeft();
        let init_led;
        let init_hal;
        let incr_led;
        let incr_hal;
        if (sp === 3) {
            init_led = parseInt("${e://Field/lower_bound_main_led}");
            init_hal = parseInt("${e://Field/lower_bound_main_hal}");
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
            init_led = parseInt("${e://Field/lower_bound_main_led}");
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
            init_hal = parseInt("${e://Field/lower_bound_main_hal}");
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
            if (num === 0) {
                if (i === 0) {
                    document.getElementById(ida).innerHTML="<u>Choice A:&nbsp;<em>LED 4-pack</em></u><br /><strong>$"+(init_led+i*incr_led).toString()+"</strong>";
                    document.getElementById(idb).innerHTML="<u>Choice B:&nbsp;<em>Halogen 4-pack</em></u><br /><strong>$"+(init_hal+i*incr_hal).toString()+"</strong>";
                }
                else {
                    document.getElementById(ida).innerHTML="<strong>$"+(init_led+i*incr_led).toString()+"</strong>";
                    document.getElementById(idb).innerHTML="<strong>$"+(init_hal+i*incr_hal).toString()+"</strong>";
                }
            } else {
                if (i === 0) {
                    document.getElementById(idb).innerHTML="<u>Choice B:&nbsp;<em>LED 4-pack</em></u><br /><strong>$"+(init_led+i*incr_led).toString()+"</strong>";
                    document.getElementById(ida).innerHTML="<u>Choice A:&nbsp;<em>Halogen 4-pack</em></u><br /><strong>$"+(init_hal+i*incr_hal).toString()+"</strong>";
                }
                else {
                    document.getElementById(idb).innerHTML="<strong>$"+(init_led+i*incr_led).toString()+"</strong>";
                    document.getElementById(ida).innerHTML="<strong>$"+(init_hal+i*incr_hal).toString()+"</strong>";
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
        Qualtrics.SurveyEngine.setEmbeddedData("switchpoint_fmpl", switch_point);
        Qualtrics.SurveyEngine.setEmbeddedData("switch_row_fmpl", switch_row);
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
     * @param incr the increment of price list
     */
    function calculate_wtp(QID, value, incr) {
        //const rows = document.getElementsByClassName("ChoiceRow");

        let lower_led;
        let lower_hal;
        let upper_led;
        let upper_hal;

        //console.log("sp is ", sp.type);

        if (Number(sp) === 3) {
            //console.log("there is a switch point");
            lower_led = switch_row;
            lower_hal = switch_row;
            upper_led = switch_row + 1;
            upper_hal = switch_row + 1;
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

        let lower_bound_led;
        let lower_bound_hal;
        let upper_bound_led;
        let upper_bound_hal;
        // if (lower_led === 0) {
        //     const text_led = document.getElementById(ida_lower).textContent;
        //     lower_bound_led = text_led.substring(text_led.indexOf('$') + 1);
        // } if (lower_hal === 0) {
        //     const text_hal = document.getElementById(idb_lower).textContent;
        //     lower_bound_hal = text_hal.substring(text_hal.indexOf('$')+1);
        // }
        //else {
        const text_led = document.getElementById(ida_lower).textContent;
        const text_hal = document.getElementById(idb_lower).textContent;
        lower_bound_led = text_led.substring(text_led.indexOf('$') + 1);
        lower_bound_hal = text_hal.substring(text_hal.indexOf('$') + 1);
        //}

        if (Number(sp) === 3) {
            const ida_upper = QID+"-"+(upper_led+basenum).toString()+"-"+value.toString()+"-label";
            const idb_upper = QID+"-"+(upper_hal+basenum).toString()+"-"+(3-value).toString()+"-label";
            upper_bound_led = document.getElementById(ida_upper).textContent.substring(1);
            upper_bound_hal = document.getElementById(idb_upper).textContent.substring(1);
        }
        else if (Number(sp) === 1) {
            upper_bound_led = (Number(lower_bound_led) + incr).toString();
            upper_bound_hal = (Number(lower_bound_hal) - incr).toString();
            //Qualtrics.SurveyEngine.setEmbeddedData("upper_bound_led", upper_bound_led);
        } else {
            upper_bound_hal = (Number(lower_bound_hal) + incr).toString();
            upper_bound_led = (Number(lower_bound_led) - incr).toString();
            //Qualtrics.SurveyEngine.setEmbeddedData("upper_bound_hal", upper_bound_hal);
        }
        // copy of bound fields to store the max/min value of bounds
        let lower_bound_led_cp = Math.min(Number(lower_bound_led), Number(upper_bound_led));
        let upper_bound_led_cp = Math.max(Number(lower_bound_led), Number(upper_bound_led));
        let lower_bound_hal_cp = Math.min(Number(lower_bound_hal), Number(upper_bound_hal));
        let upper_bound_hal_cp = Math.max(Number(lower_bound_hal), Number(upper_bound_hal));
        console.log("lower bound led is ", lower_bound_led);
        console.log("lower bound hal is ", lower_bound_hal);
        console.log("upper bound led is ", upper_bound_led);
        console.log("upper bound hal is ", upper_bound_hal);
        Qualtrics.SurveyEngine.setEmbeddedData("upper_bound_led", upper_bound_led);
        Qualtrics.SurveyEngine.setEmbeddedData("upper_bound_hal", upper_bound_hal);
        Qualtrics.SurveyEngine.setEmbeddedData("lower_bound_led", lower_bound_led);
        Qualtrics.SurveyEngine.setEmbeddedData("lower_bound_hal", lower_bound_hal);
        let lower_bound = Number(lower_bound_led - lower_bound_hal);
        let upper_bound = Number(upper_bound_led - upper_bound_hal);
        let lower_bound_cp = transNum(Math.min(lower_bound, upper_bound));
        let upper_bound_cp = transNum(Math.max(lower_bound, upper_bound));
        console.log("upper bound wtp is ", upper_bound_cp);
        console.log("lower bound wtp is ", lower_bound_cp);
        Qualtrics.SurveyEngine.setEmbeddedData("lower_bound_wtp", lower_bound_cp);
        Qualtrics.SurveyEngine.setEmbeddedData("upper_bound_wtp", upper_bound_cp);
        Qualtrics.SurveyEngine.setEmbeddedData("initial_list_value_led", lower_bound_led);
        Qualtrics.SurveyEngine.setEmbeddedData("initial_list_value_hal", lower_bound_hal);
    }

    /**
     * turns a number into a string with dollar sign.
     * @param num a number
     */
    function transNum(num){
        let str;
        if (num < 0) {
            num = Math.abs(num);
            str = "-$" + num.toString();
        }
        else {
            str = "$" + num.toString();
        }
        return str;
    }
});

Qualtrics.SurveyEngine.addOnUnload(function()
{
    /*Place your JavaScript here to run when the page is unloaded*/

});