//for timepref_2
Qualtrics.SurveyEngine.addOnload(function()
{
    /*Place your JavaScript here to run when the page loads*/


});

Qualtrics.SurveyEngine.addOnReady(function()
{
    /*Place your JavaScript here to run when the page is fully displayed*/
    const qid = this.questionId;
    let len;
    let sp;
    let switch_row;
    let value;

    let radio1 = document.getElementsByTagName("input");
    const first_id = radio1[0].id;
    //console.log("first button id is ", first_id);
    const arr = first_id.split("~");
    let basenum = Number(arr[arr.length-2]);

    if (isLedLeft()) {
        value = 1;
    } else {
        value = 2;
    }

    add_button_events();

    let nextbutton = document.getElementById("NextButton");

    nextbutton.onclick = function() {
        //alert("next button was clicked");
        findSwitchPoint(qid);
        calculate_wtp(qid, value, 6, 0);
    };

    function add_button_events(){
        let radio1 = document.getElementsByTagName("input");
        const first_id = radio1[0].id;
        //console.log("first button id is ", first_id);
        const arr = first_id.split("~");
        basenum = Number(arr[arr.length-2]);
        //console.log("base num is ", basenum);
        for(radio in radio1) {
            radio1[radio].onclick = function() {
                //console.log("button pressed");
                update_table(qid, this.value, this.id);
            }
        }
    }

    function update_table(qid, button_value, button_id) {
        //const rows = document.getElementsByClassName("ChoiceRow");
        //const len = rows.length;
        const value = Number(button_value);
        const arr = button_id.split("~");
        //const qid = arr[1];
        //console.log("cached?");
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
            switch_point = curr_val;
            switch_row = len-1;
        }
        //console.log("your switch point is ", switch_point);
        sp = switch_point;
        //console.log("your switch row is ", switch_row);
        //Qualtrics.SurveyEngine.setEmbeddedData("switchpoint", switch_point);
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
     * @param value
     * @param incra
     * @param incrb
     */
    function calculate_wtp(QID, value, incra, incrb) {
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
            // if (isLedLeft()) {
            //     //console.log("all led chosen, led is left.");
            //     lower_led = len - 1;
            //     lower_hal = len - 1;
            //     //console.log("lower led bound is ", lower_led);
            // } else {
            //     //console.log("all led chosen, led is right.");
            //     lower_led = 0;
            //     lower_hal = 0;
            //     //console.log("lower led bound is ", lower_led);
            lower_led = len - 1;
            lower_hal = len - 1;
        } else {
            //console.log("inside else");
            // if (isLedLeft()) {
            //     lower_led = 0;
            //     lower_hal = 0;
            // } else {
            //     lower_led = len - 1;
            //     lower_hal = len - 1;
            // }
            lower_led = 0;
            lower_hal = 0;
        }
        const ida_lower = QID+"-"+(lower_led+basenum).toString()+"-1-label";
        const idb_lower = QID+"-"+(lower_hal+basenum).toString()+"-2-label";
        //console.log("lower bound for today is ", ida_lower);
        //console.log("lower bound for one year is ", idb_lower);
        // const ida_upper = QID+"-"+(bound_b+480).toString()+"-1-label";
        // const idb_upper = QID+"-"+(bound_b+480).toString()+"-2-label";
        let lower_bound_led;
        let lower_bound_hal;
        let upper_bound_led;
        let upper_bound_hal;
        let text_led;
        let text_hal;
        text_led = document.getElementById(ida_lower).textContent;
        lower_bound_led = text_led.substring(text_led.indexOf('$') + 1, text_led.indexOf(' in'));
        text_hal = document.getElementById(idb_lower).textContent;
        lower_bound_hal = text_hal.substring(text_hal.indexOf('$')+1, text_hal.indexOf(' in'));
        if (Number(sp) === 3) {
            const ida_upper = QID+"-"+(upper_led+basenum).toString()+"-1-label";
            const idb_upper = QID+"-"+(upper_hal+basenum).toString()+"-2-label";
            text_led = document.getElementById(ida_upper).textContent;
            text_hal = document.getElementById(idb_upper).textContent;
            upper_bound_led = text_led.substring(text_led.indexOf('$') + 1, text_led.indexOf(' in'));
            upper_bound_hal = text_hal.substring(text_hal.indexOf('$') + 1, text_hal.indexOf(' in'));
        } else if (Number(sp) === 1) {
            upper_bound_led = (Number(lower_bound_led) + incra).toString();
            upper_bound_hal = (Number(lower_bound_hal) - incrb).toString();
        } else {
            upper_bound_hal = (Number(lower_bound_hal) + incrb).toString();
            upper_bound_led = (Number(lower_bound_led) - incra).toString();
        }
        console.log("testing timepref2");
        console.log("lower bound in one year is ", lower_bound_led);
        console.log("lower bound in 14 years is ", lower_bound_hal);
        console.log("upper bound in one year is ", upper_bound_led);
        console.log("upper bound in 14 years is ", upper_bound_hal);
        Qualtrics.SurveyEngine.setEmbeddedData("lower_bound_1yr_timepref2", lower_bound_led);
        Qualtrics.SurveyEngine.setEmbeddedData("lower_bound_15yr_timepref2", lower_bound_hal);
        Qualtrics.SurveyEngine.setEmbeddedData("upper_bound_1yr_timepref2", upper_bound_led);
        Qualtrics.SurveyEngine.setEmbeddedData("upper_bound_15yr_timepref2", upper_bound_hal);
    }
});

Qualtrics.SurveyEngine.addOnUnload(function()
{
    /*Place your JavaScript here to run when the page is unloaded*/

});