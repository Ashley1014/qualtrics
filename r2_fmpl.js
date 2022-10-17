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
    let question = document.getElementById(qid);
    //console.log(qid);
    const switchpoint = parseInt("${e://Field/switchpoint_main_r2}");
    let price_init = parseInt("${e://Field/price_init}");
    let price_incr = parseInt("${e://Field/price_incr}");
    const eff = parseFloat("${e://Field/fmpl_eff_init_r2}");
    const trad = parseFloat("${e://Field/fmpl_trad_init_r2}");
    let fmpl_eff_incr = parseFloat("${e://Field/eff_fmpl_incr}");
    let fmpl_trad_incr = parseFloat("${e://Field/trad_fmpl_incr}");
    let basenum;
    let radio1 = document.getElementsByTagName("input");
    const first_id = radio1[0].id;
    //console.log("first button id is ", first_id);
    const arr = first_id.split("~");
    basenum = Number(arr[arr.length-2]);
    //console.log("switch point is ", switchpoint);
    //console.log("eff price is ", eff);
    //console.log("trad price is ", trad);
    editLabels(qid, switchpoint, eff, trad, price_init, price_incr, fmpl_eff_incr, fmpl_trad_incr);
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
        calculate_wtp(qid, value, fmpl_eff_incr, fmpl_trad_incr);
    };

    function add_button_events(){
        const rows = question.getElementsByClassName("ChoiceRow");
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const row_header = row.getElementsByClassName("c1")[0];
            const header_id = row_header.id;
            const char_arr = header_id.split("~");
            const id_num = Number(char_arr[char_arr.length-1]);
            console.log("row number is ", id_num);
            const inputs = row.getElementsByTagName("input");
            for(let radio of inputs) {
                radio.onclick = function () {
                    //console.log("button pressed");
                    update_table(this.value, this.id, id_num);
                }
            }
        }
    }

    function update_table(button_value, button_id, row_num) {
        const value = Number(button_value);
        const arr = button_id.split("~");
        const qid = arr[1];
        //console.log(qid);
        const val = arr[arr.length-1];
        //console.log(button_id);
        if (val === 1) {
            row_num = row_num + 1;
        }
        fill_in_table(qid, row_num, value);
        //calculate_wtp(qid, row);
    }

    function fill_in_table(QID, row_number, value) {
        const rows = question.getElementsByClassName("ChoiceRow");
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const inputs = row.getElementsByTagName("input");
            const choice_a = getInputByValue(inputs, 1);
            const choice_b = getInputByValue(inputs, 2);
            if (i >= Number(row_number) && value === 2) {
                choice_a.checked = false;
                choice_b.checked = true;
            }
            if (i < Number(row_number) && value === 1) {
                choice_a.checked = true;
                choice_b.checked = false;
            }
        }
    }

    function getInputByValue(inputs, value) {
        for (let i in inputs) {
            let input = inputs[i];
            //console.log(input.value);
            if (Number(input.value) === value) {
                return input;
            }
        }
    }

    function addHeader(QID) {
        let a_header = "${e://Field/header_a}";
        let b_header = "${e://Field/header_b}";
        let a_img = "${e://Field/image_a}";
        let b_img = "${e://Field/image_b}";
        let label_a = "<u>Choice A</u>:<br /><strong>" + a_header + "</strong><br /><img alt='option_a' height=\"80\" src=\"" + a_img + "\"/><br /> <br />";
        let label_b = "<u>Choice B</u>:<br /><strong>" + b_header + "</strong><br /><img alt='option_b' height=\"80\" src=\"" + b_img + "\"/><br /> <br />";
        let row_html = "<thead> <th scope=\"row\" class=\"c1\" tabindex=\"-1\" role=\"rowheader\">  <span class=\"LabelWrapper \">  <label>  <span></span> </label>   </span>  </th>  <td class=\"c2 BorderColor\"></td> <td class=\"c3 BorderColor\"></td>     <th class=\"c4   \">    <label style=\"display: block; padding-top: 0px; padding-bottom: 0px;\" >" + label_a +"</label>  <label aria-hidden=\"true\" ></label> </th>   <th class=\"c5 last  \">    <label style=\"display: block; padding-top: 0px; padding-bottom: 0px;\" >" + label_b + "</label> <label aria-hidden=\"true\"></label> </th>  </thead>";
        jQuery("#"+QID+" table:first").prepend(row_html);
    }

    function displayLabels_v1(QID, init_eff, incr_eff, init_trad, incr_trad) {
        addHeader(QID);
        const rows = question.getElementsByClassName("ChoiceRow");
        for (let i = 0; i < rows.length; i++) {
            let eff = (init_eff + i * incr_eff).toFixed(2).replace(/\.00$/, '');
            let trad = (init_trad + i * incr_trad).toFixed(2).replace(/\.00$/, '');
            const row = rows[i];
            const inputs = row.getElementsByTagName("input");
            const input_a = getInputByValue(inputs, 1);
            const input_b = getInputByValue(inputs, 2);
            const label_a = input_a.labels[0];
            const label_b = input_b.labels[0];
            if (iseffLeft()) {
                label_a.innerHTML = "<strong>$" + eff + "</strong>";
                label_b.innerHTML = "<strong>$" + trad + "</strong>";
            } else {
                label_a.innerHTML = "<strong>$" + trad + "</strong>";
                label_b.innerHTML = "<strong>$" + eff + "</strong>";
            }
        }
    }

    function displayLabels_v2(QID, init_eff, incr_eff, init_trad, incr_trad, disc_rate) {
        addHeader(QID);
        let eff_value = (iseffLeft()) ? 1 : 2;
        const rows = question.getElementsByClassName("ChoiceRow");
        //console.log(num);
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const inputs = row.getElementsByTagName("input");
            const input_eff = getInputByValue(inputs, eff_value);
            const input_trad = getInputByValue(inputs, 3-eff_value);
            const label_eff = input_eff.labels[0];
            const label_trad = input_trad.labels[0];

            const eff_disc = (init_eff + i * incr_eff).toFixed(2).replace(/\.00$/, '');
            const eff_original = (eff_disc / disc_rate).toFixed(2).replace(/\.00$/, '');
            let trad = (init_trad + i * incr_trad).toFixed(2).replace(/\.00$/, '');

            label_eff.innerHTML = "<strong><s>$"+eff_original+"</s><span style=\"color:red\"> $" + eff_disc +"</span></strong>";
            label_trad.innerHTML = "<strong>$"+trad+"</strong>";
        }
    }


    /**
     * return a dictionary of the initial fmpl prices of two products.
     * @param sp{int}
     * @return res result dictionary
     */
    function findInit(sp) {
        let res = {
            "init_e": null,
            "init_t": null
        };

        //@TODO: ** change the eff fmpl init price variable when there's a switchpoint and when choice_a is eff **
        let inite_sw_ea = parseFloat("$e{ ( e://Field/lower_bound_eff_main_r2 + e://Field/fmpl_eff_incr_swi / e://Field/reduc_rate ) }");
        //@TODO: ** change the eff fmpl init price variable when there's a switchpoint and when choice_b is eff **
        let inite_sw_eb = parseFloat("$e{ ( e://Field/lower_bound_eff_main_r2 - e://Field/fmpl_eff_incr_swi / e://Field/reduc_rate ) }");
        //@TODO: ** change the trad fmpl init price variable when there's a switchpoint and when choice_a is trad **
        let initt_sw_ta = parseFloat("$e{ ( e://Field/lower_bound_trad_main_r2 - e://Field/fmpl_trad_incr_swi ) }");
        //@TODO: ** change the trad fmpl init price variable when there's a switchpoint and when choice_b is trad **
        let initt_sw_tb = parseFloat("$e{ ( e://Field/lower_bound_trad_main_r2 + e://Field/fmpl_trad_incr_swi ) }");
        //@TODO: ** change the eff fmpl init price variable when all eff is selected and when choice_a is eff **
        let inite_alleff_ea = parseFloat("$e{ ( e://Field/lower_bound_eff_main_r2 + e://Field/fmpl_eff_incr_alleff / e://Field/reduc_rate ) }");
        //@TODO: ** change the eff fmpl init price variable when all eff is selected and when choice_b is eff **
        let inite_alleff_eb = parseFloat("$e{ ( e://Field/lower_bound_eff_main_r2 + ( e://Field/num_followdecisions * e://Field/fmpl_eff_incr_alleff / e://Field/reduc_rate ) ) }");
        //@TODO: ** change the trad fmpl init price variable when all trad is selected and when choice_a is trad **
        let initt_alltrad_ta = parseFloat("$e{ ( e://Field/lower_bound_trad_main_r2 - e://Field/fmpl_trad_incr_alltrad ) }");
        //@TODO: ** change the trad fmpl init price variable when all trad is selected and when choice_b is trad **
        let initt_alltrad_tb = parseFloat("$e{ ( e://Field/lower_bound_trad_main_r2 - ( e://Field/num_followdecisions * e://Field/fmpl_trad_incr_alltrad ) ) }");
        //@TODO: ** change the eff fmpl init price variable when all trad is selected **
        let inite_alltrad = parseFloat("$e{ ( e://Field/lower_bound_eff_main_r2 + e://Field/fmpl_eff_incr_alltrad / e://Field/reduc_rate ) }");
        //@TODO: ** change the trad fmpl init price variable when all eff is selected **
        let initt_alleff = parseFloat("$e{ ( e://Field/lower_bound_trad_main_r2 + e://Field/fmpl_trad_incr_alleff ) }");

        if (iseffLeft()) {
            //alleff_ea(tb)
            if (sp === 1) {
                res["init_e"] = inite_alleff_ea;
                res["init_t"] = initt_alleff;
            }
            //alltrad_ea(tb)
            else if (sp === 2) {
                res["init_e"] = inite_alltrad;
                res["init_t"] = initt_alltrad_tb;
            } else {
                res["init_e"] = inite_sw_ea;
                res["init_t"] = initt_sw_tb;
            }
        } else {
            //alleff_eb(ta)
            if (sp === 1) {
                res["init_e"] = inite_alleff_eb;
                res["init_t"] = initt_alleff;
            }
            //alltrad_eb(ta)
            else if (sp === 2) {
                res["init_e"] = inite_alltrad;
                res["init_t"] = initt_alltrad_ta;
            } else {
                res["init_e"] = inite_sw_eb;
                res["init_t"] = initt_sw_ta;
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
            "incr_e": null,
            "incr_t": null
        }
        let assignment = parseInt("${e://Field/condition_no}");
        let reduc_rate = parseFloat("${e://Field/reduc_rate}");
        let fmpl_incra_sw = parseFloat("${e://Field/fmpl_eff_incr_swi}");
        let fmpl_incra_alla = parseFloat("${e://Field/fmpl_eff_incr_alleff}");
        let fmpl_incra_allb = parseFloat("${e://Field/fmpl_eff_incr_alltrad}");
        if (iseffLeft()) {
            if (sp === 1) {
                res["incr_e"] = fmpl_incra_alla;
                res["incr_t"] = -fmpl_incra_allb;
            } else if (sp === 2) {
                res["incr_e"] = fmpl_incra_allb;
                res["incr_t"] = -fmpl_incra_alla;
            } else {
                res["incr_e"] = fmpl_incra_sw;
                res["incr_t"] = -fmpl_incra_sw;
            }
        } else {
            if (sp === 1) {
                res["incr_e"] = -fmpl_incra_alla;
                res["incr_t"] = fmpl_incra_allb;
            } else if (sp === 2) {
                res["incr_e"] = -fmpl_incra_allb;
                res["incr_t"] = fmpl_incra_alla;
            } else {
                res["incr_e"] = -fmpl_incra_sw;
                res["incr_t"] = fmpl_incra_sw;
            }
        }
        if (assignment === 7) {
            res["incr_e"] = res["incr_e"]/reduc_rate;
        }
        return res;
    }



    /**
     * Randomizes the header label position and generates choice values according to the main mpl switch
     point.
     * @param QID - the question id
     * @param switchpoint - the switch point of the main mpl question if there's any
     * @param eff - the initial value of choice A options
     * @param trad - the initial value of choice B options
     * @param price_init
     * @param price_incr
     * @param fmpl_eff_incr
     * @param fmpl_trad_incr
     */
    function editLabels(QID, switchpoint, eff, trad, price_init, price_incr, fmpl_eff_incr, fmpl_trad_incr) {
        // let eff_caps = "${e://Field/efficient_allcaps}";
        // let trad_caps = "${e://Field/traditional_allcaps}";
        // const rows = document.getElementsByClassName("ChoiceRow");
        // const len = rows.length;
        let sp = parseInt("${e://Field/switchpoint_main_r2}");
        let init_eff;
        let init_trad;
        let incr_eff;
        let incr_trad;
        
        init_eff = findInit(sp)["init_e"];
        init_trad = findInit(sp)["init_t"];
        incr_eff = findIncr(sp)["incr_e"];
        incr_trad = findIncr(sp)["incr_t"];
        
        let assignment = parseInt("${e://Field/condition_no}");
        if (assignment === 5 || assignment === 6) {
            let disc_rate = parseFloat("${e://Field/disc_rate}");
            displayLabels_v2(QID, init_eff, incr_eff, init_trad, incr_trad, disc_rate);
        } else {
            displayLabels_v1(QID, init_eff, incr_eff, init_trad, incr_trad);
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

    /**
     * get the bound by specified value and row number.
     * @param QID the question number
     * @param row the intended row number
     * @param value the value of the intended cell
     * @returns {string} the content string in [row] with [value]
     */
    function getBoundByRow(QID, row, value) {
        const rows = question.getElementsByClassName("ChoiceRow");
        const row_ele = rows[row];
        const inputs = row_ele.getElementsByTagName("input");
        const input =  getInputByValue(inputs, value);
        const text = input.labels[0].textContent;
        return text.substring(text.lastIndexOf('$') + 1);
    }
    
    /***
     *
     * @param QID
     * @param value the value of eff choices
     * @param eff_incr the increment of price list
     * @param trad_incr
     */
    function calculate_wtp(QID, value, eff_incr, trad_incr) {
        let lower_eff;
        let lower_trad;
        let upper_eff;
        let upper_trad;

        let lower_bound_eff;
        let lower_bound_trad;
        let upper_bound_eff;
        let upper_bound_trad;

        let main_sp = parseInt("${e://Field/switchpoint_main_r2}");

        eff_incr = findIncr(main_sp)["incr_e"];
        trad_incr = findIncr(main_sp)["incr_t"];

        if (Number(sp) === 3) {
            //console.log("there is a switch point");
            lower_eff = switch_row;
            lower_trad = switch_row;
            upper_eff = switch_row + 1;
            upper_trad = switch_row + 1;
            lower_bound_eff = getBoundByRow(QID, lower_eff, value);
            lower_bound_trad = getBoundByRow(QID, lower_trad, 3-value);
            upper_bound_eff = getBoundByRow(QID, upper_eff, value);
            upper_bound_trad = getBoundByRow(QID, upper_trad, 3-value);
        } else if (Number(sp) === 1) {
            if (iseffLeft()) {
                //console.log("all eff chosen, eff is left.");
                lower_eff = len - 1;
                lower_trad = len - 1;
                lower_bound_eff = getBoundByRow(QID, lower_eff, value);
                lower_bound_trad = getBoundByRow(QID, lower_trad, 3-value);
                upper_bound_eff = Number(lower_bound_eff) + eff_incr;
                upper_bound_trad = Number(lower_bound_trad) + trad_incr;
                //console.log("lower eff bound is ", lower_eff);
            } else {
                //console.log("all eff chosen, eff is right.");
                upper_eff = 0;
                upper_trad = 0;
                upper_bound_eff = getBoundByRow(QID, upper_eff, value);
                upper_bound_trad = getBoundByRow(QID, upper_trad, 3-value);
                lower_bound_eff = Number(upper_bound_eff) - eff_incr;
                lower_bound_trad = Number(upper_bound_trad) - trad_incr;
                //console.log("lower eff bound is ", lower_eff);
            }
        } else {
            //console.log("inside else");
            if (iseffLeft()) {
                upper_eff = 0;
                upper_trad = 0;
                upper_bound_eff = getBoundByRow(QID, upper_eff, value);
                upper_bound_trad = getBoundByRow(QID, upper_trad, 3-value);
                lower_bound_eff = Number(upper_bound_eff) - eff_incr;
                lower_bound_trad = Number(upper_bound_trad) - trad_incr;
            } else {
                lower_eff = len - 1;
                lower_trad = len - 1;
                lower_bound_eff = getBoundByRow(QID, lower_eff, value);
                lower_bound_trad = getBoundByRow(QID, lower_trad, 3-value);
                upper_bound_eff = Number(lower_bound_eff) + eff_incr;
                upper_bound_trad = Number(lower_bound_trad) + trad_incr;
            }
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