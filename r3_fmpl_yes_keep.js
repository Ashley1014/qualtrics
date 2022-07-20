//for R3_fmpl_yes_keep
Qualtrics.SurveyEngine.addOnload(function()
{
    /*Place your JavaScript here to run when the page loads*/


});

Qualtrics.SurveyEngine.addOnReady(function() {
    /*Place your JavaScript here to run when the page is fully displayed*/
    const revised_wtp = parseInt("${q://QID514/ChoiceTextEntryValue}");
    //console.log("revised wtp is ", revised_wtp);
    //const order = parseInt("${e://Field/display_order}");
    const qid = this.questionId;
    const question = document.getElementById(qid);
    //const questions = document.getElementById("Questions");
    //const fmpls = questions.getElementsByClassName("QuestionOuter");
    let sp;
    let switch_row;
    let display_order = parseInt("${e://Field/display_order}");
    let led_value = 1 + display_order;
    let hal_value = 3 - led_value;

    let value;
    if (isLedLeft()) {
        value = 1;
    } else {
        value = 2;
    }


    if (!notRevised(5, 7, 1)) {
        //if (r3_yes_revised === 1) {
        //console.log("has been revised!");
        question.style.display = "none";
        //fmpls[0].style.display = "none";
    } else {
        //fmpls[1].style.display = "none";
        let radio1 = question.getElementsByTagName("input");
        const first_id = radio1[0].id;
        //console.log("first button id is ", first_id);
        const arr = first_id.split("~");
        let basenum = Number(arr[arr.length - 2]);
        //let qid = arr[1];

        editLabels(qid, basenum, 1, 5);
        displayRevised(qid, basenum);

        let nextbutton = document.getElementById("NextButton");

        nextbutton.onclick = function() {
            //alert("next button was clicked");
            findSwitchPoint(qid);
            calculate_wtp(qid, value, basenum);
        };
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

    /***
     *
     * @param QID
     * @param value the value of LED choices
     * @param basenum
     */
    function calculate_wtp(QID, value, basenum) {
        //const rows = document.getElementsByClassName("ChoiceRow");
        console.log("testing fmpl_yes_keep");

        let lower_led;
        let lower_hal;
        let upper_led;
        let upper_hal;

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
        // console.log("lower bound for led is ", ida_lower);
        // console.log("lower bound for halogen is ", idb_lower);

        let lower_bound_led;
        let lower_bound_hal;
        let upper_bound_led;
        let upper_bound_hal;
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

        if (Number(sp) === 3) {
            const ida_upper = QID+"-"+(upper_led+basenum).toString()+"-"+value.toString()+"-label";
            const idb_upper = QID+"-"+(upper_hal+basenum).toString()+"-"+(3-value).toString()+"-label";
            upper_bound_led = document.getElementById(ida_upper).textContent.substring(1);
            upper_bound_hal = document.getElementById(idb_upper).textContent.substring(1);
        }
        else if (Number(sp) === 1) {
            lower_bound_hal = "1";
            upper_bound_hal = "1";
            upper_bound_led = (Number(lower_bound_led) + 5).toString();
            //Qualtrics.SurveyEngine.setEmbeddedData("upper_bound_led", upper_bound_led);
        } else {
            lower_bound_led = "1";
            upper_bound_led = "1";
            upper_bound_hal = (Number(lower_bound_hal) + 5).toString();
            //Qualtrics.SurveyEngine.setEmbeddedData("upper_bound_hal", upper_bound_hal);
        }
        // copy of bound fields to store the max/min value of bounds
        let lower_bound_led_cp = Math.min(Number(lower_bound_led), Number(upper_bound_led));
        let upper_bound_led_cp = Math.max(Number(lower_bound_led), Number(upper_bound_led));
        let lower_bound_hal_cp = Math.min(Number(lower_bound_hal), Number(upper_bound_hal));
        let upper_bound_hal_cp = Math.max(Number(lower_bound_hal), Number(upper_bound_hal));
        console.log("lower bound led is ", lower_bound_led_cp);
        console.log("lower bound hal is ", lower_bound_hal_cp);
        console.log("upper bound led is ", upper_bound_led_cp);
        console.log("upper bound hal is ", upper_bound_hal_cp);
        Qualtrics.SurveyEngine.setEmbeddedData("upper_bound_led_r3", upper_bound_led_cp);
        Qualtrics.SurveyEngine.setEmbeddedData("upper_bound_hal_r3", upper_bound_hal_cp);
        Qualtrics.SurveyEngine.setEmbeddedData("lower_bound_led_r3", lower_bound_led_cp);
        Qualtrics.SurveyEngine.setEmbeddedData("lower_bound_hal_r3", lower_bound_hal_cp);
        let lower_bound = Number(lower_bound_led - lower_bound_hal);
        let upper_bound = Number(upper_bound_led - upper_bound_hal);
        let lower_bound_cp = transNum(Math.min(lower_bound, upper_bound));
        let upper_bound_cp = transNum(Math.max(lower_bound, upper_bound));
        console.log("upper bound wtp is ", upper_bound_cp);
        console.log("lower bound wtp is ", lower_bound_cp);
        Qualtrics.SurveyEngine.setEmbeddedData("lower_bound_wtp_r3", lower_bound_cp);
        Qualtrics.SurveyEngine.setEmbeddedData("upper_bound_wtp_r3", upper_bound_cp);
    }

    /**
     * return true if not been revised, return false if has been revised.
     * @param interval the intervals of the price lists, must be a positive number
     * @param decision_num number of decisions in ** main mpl **
     * @param init_val
     */
    function notRevised(interval, decision_num, init_val) {
        // led is on the left
        let upper_bound_wtp = interval * (decision_num - 1);
        let lower_bound_wtp = -interval * (decision_num - 1);
        let notRevised;
        let init_led = parseInt("${e://Field/initial_list_value_led_r3_yes}");
        let init_hal = parseInt("${e://Field/initial_list_value_hal_r3_yes}");
        let init_wtp = init_led - init_hal;
        // want to check whether the revised_wtp is within the range
        if (revised_wtp < lower_bound_wtp) {
            if (isLedLeft()) {
                return init_led <= init_val;
            } else {
                return init_hal >= init_val + interval * (decision_num-1);
            }
        } else if (revised_wtp > upper_bound_wtp) {
            if (isLedLeft()) {
                return init_led >= init_val + interval * (decision_num-1);
            } else {
                return init_hal <= init_val;
            }
        } else {
            if (isLedLeft()) {
                notRevised = revised_wtp >= init_wtp && revised_wtp <= init_wtp + 2 * interval;
            } else {
                notRevised = revised_wtp >= init_wtp - 2 * interval && revised_wtp <= init_wtp;
            }
        }
        return notRevised;
    }


    /**
     * Randomizes the header label position and generates choice values according to the main mpl switch
     point.
     * @param QID - the question id
     * @param basenum
     */
    function editLabels(QID, basenum) {
        const rows = question.getElementsByClassName("ChoiceRow");
        const len = rows.length;
        let sp = parseInt("${e://Field/switchpoint_round_3_yes}");
        let ledLeft = isLedLeft();
        let init_led;
        let init_hal;
        let incr_led;
        let incr_hal;
        if (sp === 3) {
            init_led = parseInt("${e://Field/initial_list_value_led_r3_yes}");
            init_hal = parseInt("${e://Field/initial_list_value_hal_r3_yes}");
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
            init_led = parseInt("${e://Field/initial_list_value_led_r3_yes}");
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
            init_hal = parseInt("${e://Field/initial_list_value_hal_r3_yes}");
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

    function isLedLeft() {
        let num = parseInt("${e://Field/display_order}");
        return num === 0;
    }

    function displayRevised(qid, basenum) {
        //let display_order = parseInt("${e://Field/display_order}");
        let wtp_upper = parseInt("${q://QID514/ChoiceTextEntryValue}");
        let wtp_lower = wtp_upper - 1;
        // let wtp_lower = 27;
        // let wtp_upper = 34;
        //console.log("wtp_lower is", wtp_lower);
        //console.log("wtp_upper is", wtp_upper);

        let radios = document.getElementsByTagName("input");
        let row = -1;
        const rows = question.getElementsByClassName("ChoiceRow");
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
            //console.log("lower bound is ", lower_bound);
            //console.log("upper bound is ", upper_bound);
            //console.log("here");
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
        Qualtrics.SurveyEngine.setEmbeddedData("switchpoint_fmpl_r3", switch_point);
        Qualtrics.SurveyEngine.setEmbeddedData("switch_row_fmpl_r3", switch_row);
        //return switch_row;
    }

    function findCheckedValue(index) {
        let curr_val;
        const rows = question.getElementsByClassName("ChoiceRow");
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
});

Qualtrics.SurveyEngine.addOnUnload(function()
{
    /*Place your JavaScript here to run when the page is unloaded*/

});