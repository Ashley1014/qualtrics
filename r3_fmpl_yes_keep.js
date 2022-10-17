//for R3_fmpl_yes_keep
Qualtrics.SurveyEngine.addOnload(function()
{
    /*Place your JavaScript here to run when the page loads*/


});

Qualtrics.SurveyEngine.addOnReady(function() {
    /*Place your JavaScript here to run when the page is fully displayed*/
    console.log("testing r3_fmpl_yes_keep");
    let revised_wtp;
    let assignment = parseInt("${e://Field/condition_no}");
    if (assignment === 10) {
        revised_wtp = parseInt("${q://QID1087/ChoiceTextEntryValue}");
    } else {
        revised_wtp = parseInt("${q://QID763/ChoiceTextEntryValue}");
    }
    //console.log("revised wtp is ", revised_wtp);
    //const order = parseInt("${e://Field/display_order}");
    const qid = this.questionId;
    const question = document.getElementById(qid);
    //const questions = document.getElementById("Questions");
    //const fmpls = questions.getElementsByClassName("QuestionOuter");
    let sp;
    let switch_row;
    let display_order = parseInt("${e://Field/display_order}");
    let eff_value = 1 + display_order;
    let trad_value = 3 - eff_value;

    let fmpl_eff_incr = parseFloat("${e://Field/eff_fmpl_incr}");
    let fmpl_trad_incr = parseFloat("${e://Field/trad_fmpl_incr}");

    const eff = parseFloat("${e://Field/fmpl_eff_init_r3}");
    const trad = parseFloat("${e://Field/fmpl_trad_init_r3}");

    let value;
    if (iseffLeft()) {
        value = 1;
    } else {
        value = 2;
    }

    let not_revised;

    let price_init = parseInt("${e://Field/price_init}");
    let price_incr = parseInt("${e://Field/price_incr}");

    let trad_init = parseInt("${e://Field/trad_init}");
    let trad_incr = parseInt("${e://Field/trad_incr}");
    let disc_rate = parseFloat("${e://Field/disc_rate}");
    let eff_init_ori = parseInt("${e://Field/eff_init_ori}");
    let eff_incr_ori = parseInt("${e://Field/eff_incr_ori}");

    if (assignment === 7) {
        not_revised = notRevised_v2();
    }
    else {
        not_revised = notRevised_v1(price_incr, 5, price_init);
    }

    if (!not_revised) {
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

        editLabels(qid, basenum, price_init, price_incr, fmpl_eff_incr, fmpl_trad_incr);
        displayRevised(qid, basenum);
        add_button_events();

        let nextbutton = document.getElementById("NextButton");

        nextbutton.onclick = function() {
            //alert("next button was clicked");
            findSwitchPoint(qid);
            calculate_wtp(qid, value, fmpl_eff_incr, fmpl_trad_incr, basenum);
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

    function getInputByValue(inputs, value) {
        for (let i in inputs) {
            let input = inputs[i];
            //console.log(input.value);
            if (Number(input.value) === value) {
                return input;
            }
        }
    }

    /***
     *
     * @param QID
     * @param value the value of eff choices
     * @param eff_incr the increment of price list
     * @param trad_incr
     * @param basenum
     */
    function calculate_wtp(QID, value, eff_incr, trad_incr, basenum) {
        let lower_eff;
        let lower_trad;
        let upper_eff;
        let upper_trad;

        let lower_bound_eff;
        let lower_bound_trad;
        let upper_bound_eff;
        let upper_bound_trad;

        let main_sp = parseInt("${e://Field/switchpoint_main_r3_yes}");

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
        Qualtrics.SurveyEngine.setEmbeddedData("upper_bound_eff_r3", upper_bound_eff);
        Qualtrics.SurveyEngine.setEmbeddedData("upper_bound_trad_r3", upper_bound_trad);
        Qualtrics.SurveyEngine.setEmbeddedData("lower_bound_eff_r3", lower_bound_eff);
        Qualtrics.SurveyEngine.setEmbeddedData("lower_bound_trad_r3", lower_bound_trad);
        let lower_bound = Number(lower_bound_eff - lower_bound_trad);
        let upper_bound = Number(upper_bound_eff - upper_bound_trad);
        let lower_bound_cp = transNum(Math.min(lower_bound, upper_bound));
        let upper_bound_cp = transNum(Math.max(lower_bound, upper_bound));
        console.log("upper bound wtp is ", upper_bound_cp);
        console.log("lower bound wtp is ", lower_bound_cp);
        Qualtrics.SurveyEngine.setEmbeddedData("lower_bound_wtp_r3", lower_bound_cp);
        Qualtrics.SurveyEngine.setEmbeddedData("upper_bound_wtp_r3", upper_bound_cp);
    }

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

    /**
     * check whether or not revised for non-discount versions
     * return true if not been revised, return false if has been revised.
     * @param interval the intervals of the price lists, must be a positive number
     * @param decision_num number of decisions in ** main mpl **
     * @param init_val
     */
    function notRevised_v1(interval, decision_num, init_val) {

        interval = parseInt("${e://Field/mpl_eff_incr}");
        decision_num = parseInt("${e://Field/num_maindecisions}");
        init_val = parseInt("${e://Field/mpl_eff_init}");

        let upper_bound_wtp = interval * (decision_num - 1);
        let lower_bound_wtp = -interval * (decision_num - 1);
        let notRevised;
        let init_eff = parseInt("${e://Field/lower_bound_eff_main_r3}");
        let init_trad = parseInt("${e://Field/lower_bound_trad_main_r3}");
        let init_wtp = init_eff - init_trad;
        // want to check whether the revised_wtp is within the range
        if (revised_wtp < lower_bound_wtp) {
            if (iseffLeft()) {
                return init_eff <= init_val;
            } else {
                return init_trad >= init_val + interval * (decision_num-1);
            }
        } else if (revised_wtp > upper_bound_wtp) {
            if (iseffLeft()) {
                return init_eff >= init_val + interval * (decision_num-1);
            } else {
                return init_trad <= init_val;
            }
        } else {
            if (iseffLeft()) {
                notRevised = revised_wtp >= init_wtp && revised_wtp <= init_wtp + 2 * interval;
            } else {
                notRevised = revised_wtp >= init_wtp - 2 * interval && revised_wtp <= init_wtp;
            }
        }
        return notRevised;
    }

    /**
     * check whether or not revised for discount versions
     * return true if not been revised, return false if has been revised.
     */
    function notRevised_v2() {

        let decision_num = parseInt("${e://Field/num_maindecisions}");
        let eff_init_val = parseInt("${e://Field/mpl_eff_init}");
        let incr_eff = parseInt("${e://Field/mpl_eff_incr}");
        let incr_trad = parseInt("${e://Field/mpl_trad_incr}")
        let reduc_rate = parseFloat("${e://Field/reduc_rate}");

        let max_trad = eff_init_val + incr_eff * (decision_num - 1);
        let max_eff = max_trad / reduc_rate;
        let min_trad = eff_init_val;
        let min_eff = eff_init_val/reduc_rate;

        if (iseffLeft()) {
            incr_eff = incr_eff/reduc_rate;
        } else {
            incr_eff = -incr_eff/reduc_rate;
            incr_trad = -incr_trad;
        }
        // eff is on the left
        let upper_bound_wtp = max_eff - min_trad;
        let lower_bound_wtp = min_eff - max_trad;
        let notRevised;
        let init_eff = parseInt("${e://Field/lower_bound_eff_main_r3}");
        let init_trad = parseInt("${e://Field/lower_bound_trad_main_r3}");
        let init_wtp = init_eff - init_trad;
        // want to check whether the revised_wtp is within the range
        if (revised_wtp < lower_bound_wtp) {
            if (iseffLeft()) {
                return init_eff <= eff_init_val;
            } else {
                return init_trad >= init_trad + incr_trad * (decision_num-1);
            }
        } else if (revised_wtp > upper_bound_wtp) {
            if (iseffLeft()) {
                return init_eff >= eff_init_val + incr_eff * (decision_num-1);
            } else {
                return init_trad <= init_trad;
            }
        } else {
            if (iseffLeft()) {
                notRevised = revised_wtp >= init_wtp && revised_wtp <= init_wtp + incr_eff - incr_trad;
            } else {
                notRevised = revised_wtp >= (init_wtp + incr_eff - incr_trad) && revised_wtp <= init_wtp;
            }
        }
        return notRevised;
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

    function displayLabels_v2(QID, init_eff, incr_eff, init_trad, incr_trad, disc_rate, basenum) {
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
        let inite_sw_ea = parseFloat("$e{ ( e://Field/lower_bound_eff_main_r3 + e://Field/fmpl_eff_incr_swi / e://Field/reduc_rate ) }");
        //@TODO: ** change the eff fmpl init price variable when there's a switchpoint and when choice_b is eff **
        let inite_sw_eb = parseFloat("$e{ ( e://Field/lower_bound_eff_main_r3 - e://Field/fmpl_eff_incr_swi / e://Field/reduc_rate ) }");
        //@TODO: ** change the trad fmpl init price variable when there's a switchpoint and when choice_a is trad **
        let initt_sw_ta = parseFloat("$e{ ( e://Field/lower_bound_trad_main_r3 - e://Field/fmpl_trad_incr_swi ) }");
        //@TODO: ** change the trad fmpl init price variable when there's a switchpoint and when choice_b is trad **
        let initt_sw_tb = parseFloat("$e{ ( e://Field/lower_bound_trad_main_r3 + e://Field/fmpl_trad_incr_swi ) }");
        //@TODO: ** change the eff fmpl init price variable when all eff is selected and when choice_a is eff **
        let inite_alleff_ea = parseFloat("$e{ ( e://Field/lower_bound_eff_main_r3 + e://Field/fmpl_eff_incr_alleff / e://Field/reduc_rate ) }");
        //@TODO: ** change the eff fmpl init price variable when all eff is selected and when choice_b is eff **
        let inite_alleff_eb = parseFloat("$e{ ( e://Field/lower_bound_eff_main_r3 + ( e://Field/num_followdecisions * e://Field/fmpl_eff_incr_alleff / e://Field/reduc_rate ) ) }");
        //@TODO: ** change the trad fmpl init price variable when all trad is selected and when choice_a is trad **
        let initt_alltrad_ta = parseFloat("$e{ ( e://Field/lower_bound_trad_main_r3 - e://Field/fmpl_trad_incr_alltrad ) }");
        //@TODO: ** change the trad fmpl init price variable when all trad is selected and when choice_b is trad **
        let initt_alltrad_tb = parseFloat("$e{ ( e://Field/lower_bound_trad_main_r3 - ( e://Field/num_followdecisions * e://Field/fmpl_trad_incr_alltrad ) ) }");
        //@TODO: ** change the eff fmpl init price variable when all trad is selected **
        let inite_alltrad = parseFloat("$e{ ( e://Field/lower_bound_eff_main_r3 + e://Field/fmpl_eff_incr_alltrad / e://Field/reduc_rate ) }");
        //@TODO: ** change the trad fmpl init price variable when all eff is selected **
        let initt_alleff = parseFloat("$e{ ( e://Field/lower_bound_trad_main_r3 + e://Field/fmpl_trad_incr_alleff ) }");

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
     * @param basenum
     * @param price_init
     * @param price_incr
     * @param fmpl_eff_incr
     * @param fmpl_trad_incr
     */
    function editLabels(QID, basenum, price_init, price_incr, fmpl_eff_incr, fmpl_trad_incr) {
        let sp = parseInt("${e://Field/switchpoint_main_r3_yes}");
        let init_eff;
        let init_trad;
        let incr_eff;
        let incr_trad;

        init_eff = findInit(sp)["init_e"];
        init_trad = findInit(sp)["init_t"];
        incr_eff = findIncr(sp)["incr_e"];
        incr_trad = findIncr(sp)["incr_t"];

        let assignment = parseInt("${e://Field/assignment}");
        if (assignment === 6 || assignment === 16) {
            let disc_rate = parseFloat("${e://Field/disc_rate}");
            displayLabels_v2(QID, init_eff, incr_eff, init_trad, incr_trad, disc_rate, basenum);
        } else {
            displayLabels_v1(QID, init_eff, incr_eff, init_trad, incr_trad, basenum);
        }
    }

    function iseffLeft() {
        let num = parseInt("${e://Field/display_order}");
        return num === 0;
    }

    function displayRevised(qid, basenum) {
        let wtp_upper;
        let assignment = parseInt("${e://Field/condition_no}");
        if (assignment === 10) {
            wtp_upper = parseInt("${q://QID1087/ChoiceTextEntryValue}");
        } else {
            wtp_upper = parseInt("${q://QID763/ChoiceTextEntryValue}");
        }
        let wtp_lower = wtp_upper - 1;

        let row_num = -1;
        const rows = question.getElementsByClassName("ChoiceRow");
        let len = rows.length;
        let lower_bound;
        let upper_bound;

        for (let i = 0; i < len - 1; i++) {
            let num_eff_lower = Number(getBoundByRow(qid, i, eff_value));
            let num_trad_lower = Number(getBoundByRow(qid, i, trad_value));
            let num_eff_upper = Number(getBoundByRow(qid, i+1, eff_value));
            let num_trad_upper = Number(getBoundByRow(qid, i+1, trad_value));
            lower_bound = Math.min((num_eff_lower - num_trad_lower), (num_eff_upper - num_trad_upper));
            upper_bound = Math.max((num_eff_lower - num_trad_lower), (num_eff_upper - num_trad_upper));
            if (wtp_upper <= upper_bound && wtp_lower >= lower_bound) {
                row_num = i;
                break;
            }
        }

        if (row_num === -1) {
            if (iseffLeft()) {
                row_num = len - 1;
            }

            else if (!iseffLeft()) {
                let min_eff = Number(getBoundByRow(qid, len - 1, eff_value));
                let min_trad = Number(getBoundByRow(qid, len - 1, trad_value));
                let min_wtp = min_eff - min_trad;
                if (wtp_lower < min_wtp) {
                    row_num = len - 1;
                }
            }
        }

        populateChoices_h(rows, row_num);
    }

    function populateChoices_h(rows, row_num) {
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const inputs = row.getElementsByTagName("input");
            const choice_a = getInputByValue(inputs, 1);
            const choice_b = getInputByValue(inputs, 2);
            if (i <= row_num) {
                choice_a.checked = true;
                choice_b.checked = false;
            } else {
                choice_a.checked = false;
                choice_b.checked = true;
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
});

Qualtrics.SurveyEngine.addOnUnload(function()
{
    /*Place your JavaScript here to run when the page is unloaded*/

});