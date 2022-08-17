// for pads_fmpl
Qualtrics.SurveyEngine.addOnload(function()
{
    /*Place your JavaScript here to run when the page loads*/
});

Qualtrics.SurveyEngine.addOnReady(function()
{
    console.log("testing pads_fmpl");

    const toFloat = (field, decimal) => {
        return Number(parseFloat(field).toFixed(decimal));
    }


    const qid = this.questionId;
    //console.log(qid);
    const switchpoint = parseInt("${e://Field/switchpoint_main_pads}");
    let price_init = parseInt("${e://Field/pads_init}");
    let pads_all_incr = parseInt("${e://Field/pads_all_incr}");
    // const white = parseFloat("${e://Field/fmpl_white_init}").toFixed(2);
    // const yellow = parseFloat("${e://Field/fmpl_yellow_init}").toFixed(2);
    const white = toFloat("${e://Field/fmpl_white_init}", 2);
    const yellow = toFloat("${e://Field/fmpl_yellow_init}", 2);
    // let fmpl_incr = parseFloat("${e://Field/pads_fmpl_incr}").toFixed(2);
    let fmpl_incr = toFloat("${e://Field/pads_fmpl_incr}", 2);

    let fmpl_white_incr;
    let fmpl_yellow_incr;

    if (iswhiteLeft()) {
        fmpl_white_incr = fmpl_incr;
        fmpl_yellow_incr = -fmpl_incr;
    } else {
        fmpl_white_incr = -fmpl_incr;
        fmpl_yellow_incr = fmpl_incr;
    }

    let basenum;
    let radio1 = document.getElementsByTagName("input");
    const first_id = radio1[0].id;
    //console.log("first button id is ", first_id);
    const arr = first_id.split("~");
    basenum = Number(arr[arr.length-2]);
    //console.log("switch point is ", switchpoint);
    //console.log("white price is ", white);
    //console.log("yellow price is ", yellow);

    editLabels(qid, switchpoint, white, yellow, price_init, pads_all_incr, fmpl_white_incr, fmpl_yellow_incr, 5);
    add_button_events();

    let len;
    let sp;
    let switch_row;
    let value;

    let nextbutton = document.getElementById("NextButton");
    nextbutton.onclick = function() {
        //alert("next button was clicked");
        findSwitchPoint(qid);
        if (iswhiteLeft()) {
            value = 1;
        } else {
            value = 2;
        }
        calculate_wtp(qid, value, fmpl_white_incr, fmpl_yellow_incr);
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

    function displayLabels_v1(QID, init_white, incr_white, init_yellow, incr_yellow) {
        let white_caps = "WHITE WRITING PAD";
        let yellow_caps = "YELLOW WRITING PAD";
        let num = parseInt("${e://Field/display_order_pads}");
        const rows = document.getElementsByClassName("ChoiceRow");
        //console.log(num);
        for (let i = 0; i < rows.length; i++) {
            const ida = QID+"-"+(i+basenum).toString()+"-1-label";
            const idb = QID+"-"+(i+basenum).toString()+"-2-label";
            if (num === 0) {
                if (i === 0) {
                    document.getElementById(ida).innerHTML="<u>Choice A:&nbsp;</u><br />" + white_caps + "<br /><br /><strong>$"+(init_white+i*incr_white).toString()+"</strong>";
                    document.getElementById(idb).innerHTML="<u>Choice B:&nbsp;</u><br />" + yellow_caps + "<br /><br /><strong>$"+(init_yellow+i*incr_yellow).toString()+"</strong>";
                }
                else {
                    document.getElementById(ida).innerHTML="<strong>$"+(init_white+i*incr_white).toString()+"</strong>";
                    document.getElementById(idb).innerHTML="<strong>$"+(init_yellow+i*incr_yellow).toString()+"</strong>";
                }
            } else {
                if (i === 0) {
                    document.getElementById(idb).innerHTML="<u>Choice B:&nbsp;</u><br />" + white_caps + "<br /><br /><strong>$"+(init_white+i*incr_white).toString()+"</strong>";
                    document.getElementById(ida).innerHTML="<u>Choice A:&nbsp;</u><br />" + yellow_caps + "<br /><br /><strong>$"+(init_yellow+i*incr_yellow).toString()+"</strong>";
                }
                else {
                    document.getElementById(idb).innerHTML="<strong>$"+(init_white+i*incr_white).toString()+"</strong>";
                    document.getElementById(ida).innerHTML="<strong>$"+(init_yellow+i*incr_yellow).toString()+"</strong>";
                }
            }
        }
    }

    function displayLabels_v2(QID, init_white, incr_white, init_yellow, incr_yellow, disc_rate) {
        let white_caps = "${e://Field/whiteicient_allcaps}";
        let yellow_caps = "${e://Field/yellowitional_allcaps}";
        let num = parseInt("${e://Field/display_order_pads}");
        const rows = document.getElementsByClassName("ChoiceRow");
        //console.log(num);
        for (let i = 0; i < rows.length; i++) {
            const ida = QID+"-"+(i+basenum).toString()+"-1-label";
            const idb = QID+"-"+(i+basenum).toString()+"-2-label";
            const white_disc = init_white + i * incr_white;
            const white_original = white_disc / disc_rate;
            if (num === 0) {
                if (i === 0) {
                    document.getElementById(ida).innerHTML="<u>Choice A:&nbsp;<em>" + white_caps + "</em></u><br /><strong><s>$"+(white_original).toString()+"</s><span style=\"color:red\"> $" + (white_disc).toString()+"</span></strong>";
                    document.getElementById(idb).innerHTML="<u>Choice B:&nbsp;<em>" + yellow_caps + "</em></u><br /><strong>$"+(init_yellow+i*incr_yellow).toString()+"</strong>";
                }
                else {
                    document.getElementById(ida).innerHTML="<strong><s>$"+white_original.toString()+"</s><span style=\"color:red\"> $" + white_disc.toString()+"</span></strong>";
                    document.getElementById(idb).innerHTML="<strong>$"+(init_yellow+i*incr_yellow).toString()+"</strong>";
                }
            } else {
                if (i === 0) {
                    document.getElementById(idb).innerHTML="<u>Choice B:&nbsp;<em>" + white_caps + "</em></u><br /><strong><s>$"+(white_original).toString()+"</s><span style=\"color:red\"> $" + (white_disc).toString()+"</span></strong>";
                    document.getElementById(ida).innerHTML="<u>Choice A:&nbsp;<em>" + yellow_caps + "</em></u><br /><strong>$"+(init_yellow+i*incr_yellow).toString()+"</strong>";
                }
                else {
                    document.getElementById(idb).innerHTML="<strong><s>$"+white_original.toString()+"</s><span style=\"color:red\"> $" + white_disc.toString()+"</span></strong>";
                    document.getElementById(ida).innerHTML="<strong>$"+(init_yellow+i*incr_yellow).toString()+"</strong>";
                }
            }
        }
    }

    /**
     * return a dictionary of the initial fmpl prices of two products.
     * @param sp{int}
     * @return res result dictionary
     */
    function findInit(sp) {
        let res = {
            "init_w": null,
            "init_y": null
        };

        //@TODO: ** change the white fmpl init price variable when there's a switchpoint and when choice_a is white **
        let initw_sw_wa = parseFloat("$e{ ( e://Field/lower_bound_white_main + e://Field/pads_white_fmpl_incr_swi ) }");
        //@TODO: ** change the white fmpl init price variable when there's a switchpoint and when choice_b is white **
        let initw_sw_wb = parseFloat("$e{ ( e://Field/lower_bound_white_main - e://Field/pads_white_fmpl_incr_swi ) }");
        //@TODO: ** change the yellow fmpl init price variable when there's a switchpoint and when choice_a is yellow **
        let inity_sw_ya = parseFloat("$e{ ( e://Field/lower_bound_yellow_main + e://Field/pads_white_fmpl_incr_swi ) }");
        //@TODO: ** change the yellow fmpl init price variable when there's a switchpoint and when choice_b is yellow **
        let inity_sw_yb = parseFloat("$e{ ( e://Field/lower_bound_yellow_main - e://Field/pads_white_fmpl_incr_swi ) }");
        //@TODO: ** change the white fmpl init price variable when all white is selected and when choice_a is white **
        let initw_allw_wa = parseFloat("$e{ ( e://Field/lower_bound_white_main + e://Field/pads_white_fmpl_incr_allw ) }");
        //@TODO: ** change the white fmpl init price variable when all white is selected and when choice_b is white **
        let initw_allw_wb = parseFloat("$e{ ( e://Field/lower_bound_white_main + ( e://Field/num_pads_followdecisions * e://Field/pads_white_fmpl_incr_allw ) ) }");
        //@TODO: ** change the yellow fmpl init price variable when all yellow is selected and when choice_a is yellow **
        let inity_ally_ya = parseFloat("$e{ ( e://Field/lower_bound_yellow_main - e://Field/pads_yellow_fmpl_incr_ally ) }");
        //@TODO: ** change the yellow fmpl init price variable when all yellow is selected and when choice_b is yellow **
        let inity_ally_yb = parseFloat("$e{ ( e://Field/lower_bound_yellow_main - ( e://Field/num_pads_followdecisions * e://Field/pads_yellow_fmpl_incr_ally ) ) }");
        //@TODO: ** change the white fmpl init price variable when all yellow is selected **
        let initw_ally = parseFloat("$e{ ( e://Field/lower_bound_white_main + e://Field/pads_white_fmpl_incr_ally ) }");
        //@TODO: ** change the yellow fmpl init price variable when all white is selected **
        let inity_allw = parseFloat("$e{ ( e://Field/lower_bound_yellow_main + e://Field/pads_yellow_fmpl_incr_allw ) }");

        if (iswhiteLeft()) {
            //allw_wa(yb)
            if (sp === 1) {
                res["init_w"] = initw_allw_wa;
                res["init_y"] = inity_allw;
            }
            //ally_wa(yb)
            else if (sp === 2) {
                res["init_w"] = initw_ally;
                res["init_y"] = inity_ally_yb;
            } else {
                res["init_w"] = initw_sw_wa;
                res["init_y"] = inity_sw_yb;
            }
        } else {
            //allw_wb(ya)
            if (sp === 1) {
                res["init_w"] = initw_allw_wb;
                res["init_y"] = inity_allw;
            }
            //ally_wb(ya)
            else if (sp === 2) {
                res["init_w"] = initw_ally;
                res["init_y"] = inity_ally_ya;
            } else {
                res["init_w"] = initw_sw_wb;
                res["init_y"] = inity_sw_ya;
            }
        }
        return res;
    }

    /**
     * return a dictionary of the fmpl price increments of two products.
     * @param sp{int}
     * @return res result dictionary
     */
    function findIncr(sp) {
        let res = {
            "incr_w": null,
            "incr_y": null
        }
        let fmpl_incra_sw = parseFloat("${e://Field/pads_white_fmpl_incr_swi}");
        let fmpl_incra_alla = parseFloat("${e://Field/pads_white_fmpl_incr_allw}");
        let fmpl_incra_allb = parseFloat("${e://Field/pads_white_fmpl_incr_ally}");
        if (iswhiteLeft()) {
            if (sp === 1) {
                res["incr_w"] = fmpl_incra_alla;
                res["incr_y"] = -fmpl_incra_allb;
            } else if (sp === 2) {
                res["incr_w"] = fmpl_incra_allb;
                res["incr_y"] = -fmpl_incra_alla;
            } else {
                res["incr_w"] = fmpl_incra_sw;
                res["incr_y"] = -fmpl_incra_sw;
            }
            Qualtrics.SurveyEngine.setEmbeddedData("pads_white_fmpl_incr_allw", fmpl_incra_alla);
            Qualtrics.SurveyEngine.setEmbeddedData("pads_white_fmpl_incr_ally", fmpl_incra_allb);
            Qualtrics.SurveyEngine.setEmbeddedData("pads_yellow_fmpl_incr_allw", -fmpl_incra_allb);
            Qualtrics.SurveyEngine.setEmbeddedData("pads_yellow_fmpl_incr_ally", -fmpl_incra_alla);
        } else {
            if (sp === 1) {
                res["incr_w"] = -fmpl_incra_alla;
                res["incr_y"] = fmpl_incra_allb;
            } else if (sp === 2) {
                res["incr_w"] = -fmpl_incra_allb;
                res["incr_y"] = fmpl_incra_alla;
            } else {
                res["incr_w"] = -fmpl_incra_sw;
                res["incr_y"] = fmpl_incra_sw;
            }
        }
        return res;
    }


    /**
     * Randomizes the header label position and generates choice values according to the main mpl switch
     point.
     * @param QID - the question id
     * @param switchpoint - the switch point of the main mpl question if there's any
     * @param white - the initial value of choice A options
     * @param yellow - the initial value of choice B options
     * @param price_init
     * @param price_incr
     * @param fmpl_white_incr
     * @param fmpl_yellow_incr
     * @param num_dec
     */
    function editLabels(QID, switchpoint, white, yellow, price_init, price_incr, fmpl_white_incr, fmpl_yellow_incr, num_dec) {
        // let white_caps = "${e://Field/whiteicient_allcaps}";
        // let yellow_caps = "${e://Field/yellowitional_allcaps}";
        // const rows = document.getElementsByClassName("ChoiceRow");
        // const len = rows.length;
        let sp = parseInt("${e://Field/switchpoint_main_pads}");
        let init_white;
        let init_yellow;
        let incr_white;
        let incr_yellow;

        // if (sp === 3) {
        //     //@TODO: ** change the white fmpl init price variable when there's a switchpoint **
        //     init_white = parseFloat("$e{ ( e://Field/lower_bound_white_main + e://Field/pads_white_fmpl_incr_swi ) }");
        //     //@TODO: ** change the yellow fmpl init price variable when there's a switchpoint **
        //     init_yellow = parseFloat("$e{ ( e://Field/lower_bound_yellow_main + e://Field/pads_yellow_fmpl_incr_swi ) }");
        //     incr_white = parseFloat("${e://Field/pads_white_fmpl_incr_swi}");
        //     incr_yellow = parseFloat("${e://Field/pads_yellow_fmpl_incr_swi}");
        // } else {
        init_white = findInit(sp)["init_w"];
        init_yellow = findInit(sp)["init_y"];
        incr_white = findIncr(sp)["incr_w"];
        incr_yellow = findIncr(sp)["incr_y"];
        displayLabels_v1(QID, init_white, incr_white, init_yellow, incr_yellow);
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
            // set switch_point to 1 if all white choices have been selected;
            // set switch_point to 2 if all yellowogen choices have been selected;
            switch_point = findSwitchPoint_h(curr_val);
            switch_row = len-1;
        }
        //console.log("your switch point is ", switch_point);
        sp = switch_point;
        //console.log("your switch row is ", switch_row);
        Qualtrics.SurveyEngine.setEmbeddedData("switchpoint_fmpl_pads", switch_point);
        Qualtrics.SurveyEngine.setEmbeddedData("switch_row_fmpl_pads", switch_row);
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
     * @returns {number} - 1 if all white choices have been selected, 2 if all yellowogen choices have been selected.
     */
    function findSwitchPoint_h(value) {
        let switch_point;
        // let num = parseInt("${e://Field/display_order_pads}");
        if (iswhiteLeft()) {
            switch_point = value;
        } else {
            switch_point = 3-value;
        }
        return switch_point;
    }

    function iswhiteLeft() {
        let num = parseInt("${e://Field/display_order_pads}");
        return num === 0;
    }

    /**
     * get the bound by specified value and row number.
     * @param QID the question number
     * @param row the intended row number
     * @param value the value of the intended cell
     * @returns {string} the content string in [row] with [value]
     */
    function getBoundByRow(QID, row, value) {
        let id = QID+"-"+(row+basenum).toString()+"-"+value.toString()+"-label";
        let text = document.getElementById(id).textContent;
        return text.substring(text.lastIndexOf('$') + 1);
    }

    /***
     *
     * @param QID
     * @param value the value of white choices
     * @param white_incr the increment of price list
     * @param yellow_incr
     */
    function calculate_wtp(QID, value, white_incr, yellow_incr) {
        let lower_white;
        let lower_yellow;
        let upper_white;
        let upper_yellow;

        let lower_bound_white;
        let lower_bound_yellow;
        let upper_bound_white;
        let upper_bound_yellow;

        if (Number(sp) === 3) {
            //console.log("there is a switch point");
            lower_white = switch_row;
            lower_yellow = switch_row;
            upper_white = switch_row + 1;
            upper_yellow = switch_row + 1;
            lower_bound_white = getBoundByRow(QID, lower_white, value);
            lower_bound_yellow = getBoundByRow(QID, lower_yellow, 3-value);
            upper_bound_white = getBoundByRow(QID, upper_white, value);
            upper_bound_yellow = getBoundByRow(QID, upper_yellow, 3-value);
        } else if (Number(sp) === 1) {
            if (iswhiteLeft()) {
                //console.log("all white chosen, white is left.");
                lower_white = len - 1;
                lower_yellow = len - 1;
                lower_bound_white = getBoundByRow(QID, lower_white, value);
                lower_bound_yellow = getBoundByRow(QID, lower_yellow, 3-value);
                upper_bound_white = Number(lower_bound_white) + white_incr;
                upper_bound_yellow = Number(lower_bound_yellow) + yellow_incr;
                //console.log("lower white bound is ", lower_white);
            } else {
                //console.log("all white chosen, white is right.");
                upper_white = 0;
                upper_yellow = 0;
                upper_bound_white = getBoundByRow(QID, upper_white, value);
                upper_bound_yellow = getBoundByRow(QID, upper_yellow, 3-value);
                lower_bound_white = Number(upper_bound_white) - white_incr;
                lower_bound_yellow = Number(upper_bound_yellow) - yellow_incr;
                //console.log("lower white bound is ", lower_white);
            }
        } else {
            //console.log("inside else");
            if (iswhiteLeft()) {
                upper_white = 0;
                upper_yellow = 0;
                upper_bound_white = getBoundByRow(QID, upper_white, value);
                upper_bound_yellow = getBoundByRow(QID, upper_yellow, 3-value);
                lower_bound_white = Number(upper_bound_white) - white_incr;
                lower_bound_yellow = Number(upper_bound_yellow) - yellow_incr;
            } else {
                lower_white = len - 1;
                lower_yellow = len - 1;
                lower_bound_white = getBoundByRow(QID, lower_white, value);
                lower_bound_yellow = getBoundByRow(QID, lower_yellow, 3-value);
                upper_bound_white = Number(lower_bound_white) + white_incr;
                upper_bound_yellow = Number(lower_bound_yellow) + yellow_incr;
            }
        }
        console.log("lower bound white is ", lower_bound_white);
        console.log("lower bound yellow is ", lower_bound_yellow);
        console.log("upper bound white is ", upper_bound_white);
        console.log("upper bound yellow is ", upper_bound_yellow);
        Qualtrics.SurveyEngine.setEmbeddedData("upper_bound_white", upper_bound_white);
        Qualtrics.SurveyEngine.setEmbeddedData("upper_bound_yellow", upper_bound_yellow);
        Qualtrics.SurveyEngine.setEmbeddedData("lower_bound_white", lower_bound_white);
        Qualtrics.SurveyEngine.setEmbeddedData("lower_bound_yellow", lower_bound_yellow);
        let lower_bound = Number(lower_bound_white - lower_bound_yellow);
        let upper_bound = Number(upper_bound_white - upper_bound_yellow);
        let lower_bound_cp = transNum(Math.min(lower_bound, upper_bound));
        let upper_bound_cp = transNum(Math.max(lower_bound, upper_bound));
        console.log("upper bound wtp is ", upper_bound_cp);
        console.log("lower bound wtp is ", lower_bound_cp);
        Qualtrics.SurveyEngine.setEmbeddedData("lower_bound_wtp_pads", lower_bound_cp);
        Qualtrics.SurveyEngine.setEmbeddedData("upper_bound_wtp_pads", upper_bound_cp);
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