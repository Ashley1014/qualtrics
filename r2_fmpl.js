// for r2_fmpl
Qualtrics.SurveyEngine.addOnload(function()
{
    /*Place your JavaScript here to run when the page loads*/


});

Qualtrics.SurveyEngine.addOnReady(function()
{
    console.log("testing r2_fmpl");
    /*Place your JavaScript here to run when the page is fully displayed*/
    const qid = this.questionId;
    //console.log(qid);
    const switchpoint = parseInt("${e://Field/switchpoint_main_r2}");
    const eff = parseInt("${e://Field/lower_bound_eff_main_r2}");
    const trad = parseInt("${e://Field/lower_bound_trad_main_r2}");
    let basenum;
    let radio1 = document.getElementsByTagName("input");
    const first_id = radio1[0].id;
    //console.log("first button id is ", first_id);
    const arr = first_id.split("~");
    basenum = Number(arr[arr.length-2]);
    //console.log("switch point is ", switchpoint);
    //console.log("eff price is ", eff);
    //console.log("trad price is ", trad);
    editLabels(qid, switchpoint, eff, trad);
    add_button_events();

    let len;
    let sp;
    let switch_row;
    let value;

    let nextbutton = document.getElementById("NextButton");
    nextbutton.onclick = function() {
        //alert("next button was clicked");
        findSwitchPoint(qid);
        if (iseffLeft()) {
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
     * @param eff - the initial value of choice A options
     * @param trad - the initial value of choice B options
     */
    function editLabels(QID, switchpoint, eff, trad) {
        let eff_caps = "${e://Field/efficient_allcaps}";
        let trad_caps = "${e://Field/traditional_allcaps}";
        const rows = document.getElementsByClassName("ChoiceRow");
        const len = rows.length;
        let sp = parseInt("${e://Field/switchpoint_main_r2}");
        let effLeft = iseffLeft();
        let init_eff;
        let init_trad;
        let incr_eff;
        let incr_trad;
        if (sp === 3) {
            init_eff = parseInt("${e://Field/lower_bound_eff_main_r2}");
            init_trad = parseInt("${e://Field/lower_bound_trad_main_r2}");
            if (effLeft) {
                incr_eff = 1;
                incr_trad = -1;
            } else {
                incr_eff = -1;
                incr_trad = 1;
            }
        }
        // all eff being chosen
        else if (sp === 1) {
            init_eff = parseInt("${e://Field/lower_bound_eff_main_r2}");
            init_trad = 1;
            // all choice a has been chosen
            if (effLeft) {
                incr_eff = 5;
                incr_trad = 0;
            }
            // all choice b has been chosen
            else {
                incr_eff = -5;
                incr_trad = 0;
            }
        }
        // all trad being chosen
        else {
            init_eff = 1;
            init_trad = parseInt("${e://Field/lower_bound_trad_main_r2}");
            // all choice b has been chosen
            if (effLeft) {
                incr_trad = -5;
                incr_eff = 0;
            }
            // all choice a has been chosen
            else {
                incr_trad = 5;
                incr_eff = 0;
            }
        }
        let num = parseInt("${e://Field/display_order}");
        //console.log(num);
        for (let i = 0; i < rows.length; i++) {
            const ida = QID+"-"+(i+basenum).toString()+"-1-label";
            const idb = QID+"-"+(i+basenum).toString()+"-2-label";
            if (num === 0) {
                if (i === 0) {
                    document.getElementById(ida).innerHTML="<u>Choice A:&nbsp;<em>" + eff_caps + "</em></u><br /><strong>$"+(init_eff+i*incr_eff).toString()+"</strong>";
                    document.getElementById(idb).innerHTML="<u>Choice B:&nbsp;<em>" + trad_caps + "</em></u><br /><strong>$"+(init_trad+i*incr_trad).toString()+"</strong>";
                }
                else {
                    document.getElementById(ida).innerHTML="<strong>$"+(init_eff+i*incr_eff).toString()+"</strong>";
                    document.getElementById(idb).innerHTML="<strong>$"+(init_trad+i*incr_trad).toString()+"</strong>";
                }
            } else {
                if (i === 0) {
                    document.getElementById(idb).innerHTML="<u>Choice B:&nbsp;<em>" + eff_caps + "</em></u><br /><strong>$"+(init_eff+i*incr_eff).toString()+"</strong>";
                    document.getElementById(ida).innerHTML="<u>Choice A:&nbsp;<em>" + trad_caps + "</em></u><br /><strong>$"+(init_trad+i*incr_trad).toString()+"</strong>";
                }
                else {
                    document.getElementById(idb).innerHTML="<strong>$"+(init_eff+i*incr_eff).toString()+"</strong>";
                    document.getElementById(ida).innerHTML="<strong>$"+(init_trad+i*incr_trad).toString()+"</strong>";
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
            // set switch_point to 1 if all eff choices have been selected;
            // set switch_point to 2 if all tradogen choices have been selected;
            switch_point = findSwitchPoint_h(curr_val);
            switch_row = len-1;
        }
        //console.log("your switch point is ", switch_point);
        sp = switch_point;
        //console.log("your switch row is ", switch_row);
        Qualtrics.SurveyEngine.setEmbeddedData("switchpoint_fmpl_r2", switch_point);
        Qualtrics.SurveyEngine.setEmbeddedData("switch_row_fmpl_r2", switch_row);
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
     * @returns {number} - 1 if all eff choices have been selected, 2 if all tradogen choices have been selected.
     */
    function findSwitchPoint_h(value) {
        let switch_point;
        // let num = parseInt("${e://Field/display_order}");
        if (iseffLeft()) {
            switch_point = value;
        } else {
            switch_point = 3-value;
        }
        return switch_point;
    }

    function iseffLeft() {
        let num = parseInt("${e://Field/display_order}");
        return num === 0;
    }


    /***
     *
     * @param QID
     * @param value the value of eff choices
     * @param incr the increment of price list
     */
    function calculate_wtp(QID, value, incr) {
        //const rows = document.getElementsByClassName("ChoiceRow");

        let lower_eff;
        let lower_trad;
        let upper_eff;
        let upper_trad;

        //console.log("sp is ", sp.type);

        if (Number(sp) === 3) {
            //console.log("there is a switch point");
            lower_eff = switch_row;
            lower_trad = switch_row;
            upper_eff = switch_row + 1;
            upper_trad = switch_row + 1;
        } else if (Number(sp) === 1) {
            if (iseffLeft()) {
                //console.log("all eff chosen, eff is left.");
                lower_eff = len - 1;
                lower_trad = len - 1;
                //console.log("lower eff bound is ", lower_eff);
            } else {
                //console.log("all eff chosen, eff is right.");
                lower_eff = 0;
                lower_trad = 0;
                //console.log("lower eff bound is ", lower_eff);
            }
        } else {
            //console.log("inside else");
            if (iseffLeft()) {
                lower_eff = 0;
                lower_trad = 0;
            } else {
                lower_eff = len - 1;
                lower_trad = len - 1;
            }
        }
        const ida_lower = QID+"-"+(lower_eff+basenum).toString()+"-"+value.toString()+"-label";
        const idb_lower = QID+"-"+(lower_trad+basenum).toString()+"-"+(3-value).toString()+"-label";
        //console.log("lower bound for eff is ", ida_lower);
        //console.log("lower bound for tradogen is ", idb_lower);

        let lower_bound_eff;
        let lower_bound_trad;
        let upper_bound_eff;
        let upper_bound_trad;
        // if (lower_eff === 0) {
        //     const text_eff = document.getElementById(ida_lower).textContent;
        //     lower_bound_eff = text_eff.substring(text_eff.indexOf('$') + 1);
        // } if (lower_trad === 0) {
        //     const text_trad = document.getElementById(idb_lower).textContent;
        //     lower_bound_trad = text_trad.substring(text_trad.indexOf('$')+1);
        // }
        //else {
        const text_eff = document.getElementById(ida_lower).textContent;
        const text_trad = document.getElementById(idb_lower).textContent;
        lower_bound_eff = text_eff.substring(text_eff.indexOf('$') + 1);
        lower_bound_trad = text_trad.substring(text_trad.indexOf('$') + 1);
        //}

        if (Number(sp) === 3) {
            const ida_upper = QID+"-"+(upper_eff+basenum).toString()+"-"+value.toString()+"-label";
            const idb_upper = QID+"-"+(upper_trad+basenum).toString()+"-"+(3-value).toString()+"-label";
            upper_bound_eff = document.getElementById(ida_upper).textContent.substring(1);
            upper_bound_trad = document.getElementById(idb_upper).textContent.substring(1);
        }
        else if (Number(sp) === 1) {
            upper_bound_eff = (Number(lower_bound_eff) + incr).toString();
            upper_bound_trad = (Number(lower_bound_trad) - incr).toString();
            //Qualtrics.SurveyEngine.setEmbeddedData("upper_bound_eff", upper_bound_eff);
        } else {
            upper_bound_trad = (Number(lower_bound_trad) + incr).toString();
            upper_bound_eff = (Number(lower_bound_eff) - incr).toString();
            //Qualtrics.SurveyEngine.setEmbeddedData("upper_bound_trad", upper_bound_trad);
        }
        console.log("lower bound eff is ", lower_bound_eff);
        console.log("lower bound trad is ", lower_bound_trad);
        console.log("upper bound eff is ", upper_bound_eff);
        console.log("upper bound trad is ", upper_bound_trad);
        Qualtrics.SurveyEngine.setEmbeddedData("upper_bound_eff_r2", upper_bound_eff);
        Qualtrics.SurveyEngine.setEmbeddedData("upper_bound_trad_r2", upper_bound_trad);
        Qualtrics.SurveyEngine.setEmbeddedData("lower_bound_eff_r2", lower_bound_eff);
        Qualtrics.SurveyEngine.setEmbeddedData("lower_bound_trad_r2", lower_bound_trad);
        let lower_bound = Number(lower_bound_eff - lower_bound_trad);
        let upper_bound = Number(upper_bound_eff - upper_bound_trad);
        let lower_bound_cp = transNum(Math.min(lower_bound, upper_bound));
        let upper_bound_cp = transNum(Math.max(lower_bound, upper_bound));
        console.log("upper bound wtp is ", upper_bound_cp);
        console.log("lower bound wtp is ", lower_bound_cp);
        Qualtrics.SurveyEngine.setEmbeddedData("lower_bound_wtp_r2", lower_bound_cp);
        Qualtrics.SurveyEngine.setEmbeddedData("upper_bound_wtp_r2", upper_bound_cp);
        // Qualtrics.SurveyEngine.setEmbeddedData("initial_list_value_eff", lower_bound_eff);
        // Qualtrics.SurveyEngine.setEmbeddedData("initial_list_value_trad", lower_bound_trad);
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