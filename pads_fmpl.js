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
    // const lg = parseFloat("${e://Field/fmpl_lg_init}").toFixed(2);
    // const sm = parseFloat("${e://Field/fmpl_sm_init}").toFixed(2);
    const lg = toFloat("${e://Field/fmpl_lg_init}", 2);
    const sm = toFloat("${e://Field/fmpl_sm_init}", 2);
    // let fmpl_incr = parseFloat("${e://Field/pads_fmpl_incr}").toFixed(2);
    let fmpl_incr = toFloat("${e://Field/pads_fmpl_incr}", 2);

    let fmpl_lg_incr;
    let fmpl_sm_incr;

    if (islgLeft()) {
        fmpl_lg_incr = fmpl_incr;
        fmpl_sm_incr = -fmpl_incr;
    } else {
        fmpl_lg_incr = -fmpl_incr;
        fmpl_sm_incr = fmpl_incr;
    }

    let basenum;
    let radio1 = document.getElementsByTagName("input");
    const first_id = radio1[0].id;
    //console.log("first button id is ", first_id);
    const arr = first_id.split("~");
    basenum = Number(arr[arr.length-2]);
    //console.log("switch point is ", switchpoint);
    //console.log("lg price is ", lg);
    //console.log("sm price is ", sm);

    editLabels(qid, switchpoint, lg, sm, price_init, pads_all_incr, fmpl_lg_incr, fmpl_sm_incr, 5);
    add_button_events();

    let len;
    let sp;
    let switch_row;
    let value;

    let nextbutton = document.getElementById("NextButton");
    nextbutton.onclick = function() {
        //alert("next button was clicked");
        findSwitchPoint(qid);
        if (islgLeft()) {
            value = 1;
        } else {
            value = 2;
        }
        calculate_wtp(qid, value, fmpl_lg_incr, fmpl_sm_incr);
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

    function displayLabels_v1(QID, init_lg, incr_lg, init_sm, incr_sm) {
        let num = parseInt("${e://Field/display_order_pads}");
        const rows = document.getElementsByClassName("ChoiceRow");
        //console.log(num);
        for (let i = 0; i < rows.length; i++) {
            const ida = QID+"-"+(i+basenum).toString()+"-1-label";
            const idb = QID+"-"+(i+basenum).toString()+"-2-label";
            if (num === 0) {
                document.getElementById(ida).innerHTML="<strong>$"+(init_lg+i*incr_lg).toString()+"</strong>";
                document.getElementById(idb).innerHTML="<strong>$"+(init_sm+i*incr_sm).toString()+"</strong>";
            } else {
                document.getElementById(idb).innerHTML="<strong>$"+(init_lg+i*incr_lg).toString()+"</strong>";
                document.getElementById(ida).innerHTML="<strong>$"+(init_sm+i*incr_sm).toString()+"</strong>";
            }
        }
    }

    function displayLabels_v2(QID, init_lg, incr_lg, init_sm, incr_sm, disc_rate) {
        let lg_caps = "${e://Field/lgicient_allcaps}";
        let sm_caps = "${e://Field/smitional_allcaps}";
        let num = parseInt("${e://Field/display_order_pads}");
        const rows = document.getElementsByClassName("ChoiceRow");
        //console.log(num);
        for (let i = 0; i < rows.length; i++) {
            const ida = QID+"-"+(i+basenum).toString()+"-1-label";
            const idb = QID+"-"+(i+basenum).toString()+"-2-label";
            const lg_disc = init_lg + i * incr_lg;
            const lg_original = lg_disc / disc_rate;
            if (num === 0) {
                if (i === 0) {
                    document.getElementById(ida).innerHTML="<u>Choice A:&nbsp;<em>" + lg_caps + "</em></u><br /><strong><s>$"+(lg_original).toString()+"</s><span style=\"color:red\"> $" + (lg_disc).toString()+"</span></strong>";
                    document.getElementById(idb).innerHTML="<u>Choice B:&nbsp;<em>" + sm_caps + "</em></u><br /><strong>$"+(init_sm+i*incr_sm).toString()+"</strong>";
                }
                else {
                    document.getElementById(ida).innerHTML="<strong><s>$"+lg_original.toString()+"</s><span style=\"color:red\"> $" + lg_disc.toString()+"</span></strong>";
                    document.getElementById(idb).innerHTML="<strong>$"+(init_sm+i*incr_sm).toString()+"</strong>";
                }
            } else {
                if (i === 0) {
                    document.getElementById(idb).innerHTML="<u>Choice B:&nbsp;<em>" + lg_caps + "</em></u><br /><strong><s>$"+(lg_original).toString()+"</s><span style=\"color:red\"> $" + (lg_disc).toString()+"</span></strong>";
                    document.getElementById(ida).innerHTML="<u>Choice A:&nbsp;<em>" + sm_caps + "</em></u><br /><strong>$"+(init_sm+i*incr_sm).toString()+"</strong>";
                }
                else {
                    document.getElementById(idb).innerHTML="<strong><s>$"+lg_original.toString()+"</s><span style=\"color:red\"> $" + lg_disc.toString()+"</span></strong>";
                    document.getElementById(ida).innerHTML="<strong>$"+(init_sm+i*incr_sm).toString()+"</strong>";
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

        //@TODO: ** change the lg fmpl init price variable when there's a switchpoint and when choice_a is lg **
        let initw_sw_wa = parseFloat("$e{ ( e://Field/lower_bound_lg_main + e://Field/pads_lg_fmpl_incr_swi ) }");
        //@TODO: ** change the lg fmpl init price variable when there's a switchpoint and when choice_b is lg **
        let initw_sw_wb = parseFloat("$e{ ( e://Field/lower_bound_lg_main - e://Field/pads_lg_fmpl_incr_swi ) }");
        //@TODO: ** change the sm fmpl init price variable when there's a switchpoint and when choice_a is sm **
        let inity_sw_ya = parseFloat("$e{ ( e://Field/lower_bound_sm_main + e://Field/pads_lg_fmpl_incr_swi ) }");
        //@TODO: ** change the sm fmpl init price variable when there's a switchpoint and when choice_b is sm **
        let inity_sw_yb = parseFloat("$e{ ( e://Field/lower_bound_sm_main - e://Field/pads_lg_fmpl_incr_swi ) }");
        //@TODO: ** change the lg fmpl init price variable when all lg is selected and when choice_a is lg **
        let initw_allw_wa = parseFloat("$e{ ( e://Field/lower_bound_lg_main + e://Field/pads_lg_fmpl_incr_allw ) }");
        //@TODO: ** change the lg fmpl init price variable when all lg is selected and when choice_b is lg **
        let initw_allw_wb = parseFloat("$e{ ( e://Field/lower_bound_lg_main + ( e://Field/num_pads_followdecisions * e://Field/pads_lg_fmpl_incr_allw ) ) }");
        //@TODO: ** change the sm fmpl init price variable when all sm is selected and when choice_a is sm **
        let inity_ally_ya = parseFloat("$e{ ( e://Field/lower_bound_sm_main - e://Field/pads_sm_fmpl_incr_ally ) }");
        //@TODO: ** change the sm fmpl init price variable when all sm is selected and when choice_b is sm **
        let inity_ally_yb = parseFloat("$e{ ( e://Field/lower_bound_sm_main - ( e://Field/num_pads_followdecisions * e://Field/pads_sm_fmpl_incr_ally ) ) }");
        //@TODO: ** change the lg fmpl init price variable when all sm is selected **
        let initw_ally = parseFloat("$e{ ( e://Field/lower_bound_lg_main + e://Field/pads_lg_fmpl_incr_ally ) }");
        //@TODO: ** change the sm fmpl init price variable when all lg is selected **
        let inity_allw = parseFloat("$e{ ( e://Field/lower_bound_sm_main + e://Field/pads_sm_fmpl_incr_allw ) }");

        if (islgLeft()) {
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
        let fmpl_incra_sw = parseFloat("${e://Field/pads_lg_fmpl_incr_swi}");
        let fmpl_incra_alla = parseFloat("${e://Field/pads_lg_fmpl_incr_allw}");
        let fmpl_incra_allb = parseFloat("${e://Field/pads_lg_fmpl_incr_ally}");
        if (islgLeft()) {
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

    function addHeader(QID) {
        //let table = document.getElementsByTagName("table")[0];
        let pads_a_choice = "${e://Field/pads_header_a}";
        let pads_b_choice = "${e://Field/pads_header_b}";
        let pads_a_img = "${e://Field/image_pads_a}";
        console.log(pads_a_img);
        let pads_b_img = "${e://Field/image_pads_b}";
        console.log(pads_b_img);
        let a_caps = "<strong>" + pads_a_choice + "</strong><br /><img alt='legal' height=\"120\" src=\"" + pads_a_img + "\"/><br />";
        let b_caps = "<strong>" + pads_b_choice + "</strong><br /><img alt='small' height=\"120\" src=\"" + pads_b_img + "\"/><br />";
        let choice_a;
        let choice_b;
        choice_a = "<u>Choice A</u>:&nbsp;<br />" + a_caps;
        choice_b = "<u>Choice B</u>:&nbsp;<br />" + b_caps;
        let row_html = "<thead> <th scope=\"row\" class=\"c1\" tabindex=\"-1\" role=\"rowheader\">  <span class=\"LabelWrapper \">  <label>  <span></span> </label>   </span>  </th>  <td class=\"c2 BorderColor\"></td> <td class=\"c3 BorderColor\"></td>     <th class=\"c4   \">    <label style=\"display: block; padding-top: 0px; padding-bottom: 0px;\" >" + choice_a +"</label>  <label aria-hidden=\"true\" ></label> </th>   <th class=\"c5 last  \">    <label style=\"display: block; padding-top: 0px; padding-bottom: 0px;\" >" + choice_b + "</label> <label aria-hidden=\"true\"></label> </th>  </thead>";
        jQuery("#"+QID+" table:first").prepend(row_html);
    }


    /**
     * Randomizes the header label position and generates choice values according to the main mpl switch
     point.
     * @param QID - the question id
     * @param switchpoint - the switch point of the main mpl question if there's any
     * @param lg - the initial value of choice A options
     * @param sm - the initial value of choice B options
     * @param price_init
     * @param price_incr
     * @param fmpl_lg_incr
     * @param fmpl_sm_incr
     * @param num_dec
     */
    function editLabels(QID, switchpoint, lg, sm, price_init, price_incr, fmpl_lg_incr, fmpl_sm_incr, num_dec) {
        addHeader(QID);
        let sp = parseInt("${e://Field/switchpoint_main_pads}");
        let init_lg;
        let init_sm;
        let incr_lg;
        let incr_sm;

        init_lg = findInit(sp)["init_w"];
        init_sm = findInit(sp)["init_y"];
        incr_lg = findIncr(sp)["incr_w"];
        incr_sm = findIncr(sp)["incr_y"];
        displayLabels_v1(QID, init_lg, incr_lg, init_sm, incr_sm);
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
            // set switch_point to 1 if all lg choices have been selected;
            // set switch_point to 2 if all smogen choices have been selected;
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
     * @returns {number} - 1 if all lg choices have been selected, 2 if all smogen choices have been selected.
     */
    function findSwitchPoint_h(value) {
        let switch_point;
        // let num = parseInt("${e://Field/display_order_pads}");
        if (islgLeft()) {
            switch_point = value;
        } else {
            switch_point = 3-value;
        }
        return switch_point;
    }

    function islgLeft() {
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
     * @param value the value of lg choices
     * @param lg_incr the increment of price list
     * @param sm_incr
     */
    function calculate_wtp(QID, value, lg_incr, sm_incr) {
        let lower_lg;
        let lower_sm;
        let upper_lg;
        let upper_sm;

        let lower_bound_lg;
        let lower_bound_sm;
        let upper_bound_lg;
        let upper_bound_sm;

        let main_sp = parseInt("${e://Field/switchpoint_main_pads}");

        lg_incr = findIncr(main_sp)["incr_w"];
        sm_incr = findIncr(main_sp)["incr_y"];

        if (Number(sp) === 3) {
            //console.log("there is a switch point");
            lower_lg = switch_row;
            lower_sm = switch_row;
            upper_lg = switch_row + 1;
            upper_sm = switch_row + 1;
            lower_bound_lg = getBoundByRow(QID, lower_lg, value);
            lower_bound_sm = getBoundByRow(QID, lower_sm, 3-value);
            upper_bound_lg = getBoundByRow(QID, upper_lg, value);
            upper_bound_sm = getBoundByRow(QID, upper_sm, 3-value);
        } else if (Number(sp) === 1) {
            if (islgLeft()) {
                //console.log("all lg chosen, lg is left.");
                lower_lg = len - 1;
                lower_sm = len - 1;
                lower_bound_lg = getBoundByRow(QID, lower_lg, value);
                lower_bound_sm = getBoundByRow(QID, lower_sm, 3-value);
                upper_bound_lg = Number(lower_bound_lg) + lg_incr;
                upper_bound_sm = Number(lower_bound_sm) + sm_incr;
                //console.log("lower lg bound is ", lower_lg);
            } else {
                //console.log("all lg chosen, lg is right.");
                upper_lg = 0;
                upper_sm = 0;
                upper_bound_lg = getBoundByRow(QID, upper_lg, value);
                upper_bound_sm = getBoundByRow(QID, upper_sm, 3-value);
                lower_bound_lg = Number(upper_bound_lg) - lg_incr;
                lower_bound_sm = Number(upper_bound_sm) - sm_incr;
                //console.log("lower lg bound is ", lower_lg);
            }
        } else {
            //console.log("inside else");
            if (islgLeft()) {
                upper_lg = 0;
                upper_sm = 0;
                upper_bound_lg = getBoundByRow(QID, upper_lg, value);
                upper_bound_sm = getBoundByRow(QID, upper_sm, 3-value);
                lower_bound_lg = Number(upper_bound_lg) - lg_incr;
                lower_bound_sm = Number(upper_bound_sm) - sm_incr;
            } else {
                lower_lg = len - 1;
                lower_sm = len - 1;
                lower_bound_lg = getBoundByRow(QID, lower_lg, value);
                lower_bound_sm = getBoundByRow(QID, lower_sm, 3-value);
                upper_bound_lg = Number(lower_bound_lg) + lg_incr;
                upper_bound_sm = Number(lower_bound_sm) + sm_incr;
            }
        }
        console.log("lower bound lg is ", lower_bound_lg);
        console.log("lower bound sm is ", lower_bound_sm);
        console.log("upper bound lg is ", upper_bound_lg);
        console.log("upper bound sm is ", upper_bound_sm);
        Qualtrics.SurveyEngine.setEmbeddedData("upper_bound_lg", upper_bound_lg);
        Qualtrics.SurveyEngine.setEmbeddedData("upper_bound_sm", upper_bound_sm);
        Qualtrics.SurveyEngine.setEmbeddedData("lower_bound_lg", lower_bound_lg);
        Qualtrics.SurveyEngine.setEmbeddedData("lower_bound_sm", lower_bound_sm);
        let lower_bound = Number(lower_bound_lg - lower_bound_sm);
        let upper_bound = Number(upper_bound_lg - upper_bound_sm);
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