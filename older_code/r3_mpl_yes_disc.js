//for R3_mpl_yes_disc
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
    let qid = this.questionId;
    let question = document.getElementById(qid);
    let display_order = parseInt("${e://Field/display_order}");
    let eff_value = 1 + display_order;
    let trad_value = 3 - eff_value;

    let value;

    let len;
    let sp;
    let switch_row;

    let price_init = parseInt("${e://Field/price_init}");
    let price_incr = parseInt("${e://Field/price_incr}");

    let trad_init = parseInt("${e://Field/trad_init}");
    let trad_incr = parseInt("${e://Field/trad_incr}");
    let disc_rate = parseFloat("${e://Field/disc_rate}");
    let eff_init_ori = parseInt("${e://Field/eff_init_ori}");
    let eff_incr_ori = parseInt("${e://Field/eff_incr_ori}");

    let prepopulated_switch_row;

    editLabels(qid, eff_init_ori, eff_incr_ori, trad_init, trad_incr, disc_rate);
    checkRevised();
    add_button_events();

    let nextbutton = document.getElementById("NextButton");

    nextbutton.onclick = function() {
        //alert("next button was clicked");
        findSwitchPoint(qid);
        if (iseffLeft()) {
            value = 1;
        } else {
            value = 2;
        }
        //checkRevised();
        calculate_wtp(qid, value);
        setBackRevise();
        setNotRevise();
    };

    /**
     *
     */
    function setNotRevise() {
        //debugger;
        let not_revised;
        if (sp === 3) {
            not_revised = switch_row === prepopulated_switch_row ? 1 : 0;
        } else if (sp === 1) {
            if (iseffLeft()) {
                not_revised = prepopulated_switch_row === len - 1 ? 1 : 0;
            } else {
                not_revised = prepopulated_switch_row === -1 ? 1 : 0;
            }
        } else {
            if (iseffLeft()) {
                not_revised = prepopulated_switch_row === -1 ? 1 : 0;
            } else {
                not_revised = prepopulated_switch_row === len - 1 ? 1 : 0;
            }
        }
        Qualtrics.SurveyEngine.setEmbeddedData("r3_yes_keep", not_revised);
    }

    function setBackRevise() {
        console.log("testing setBackRevise...");
        console.log("the current sp is ", sp);
        let back_rvise;
        const stored_sp = "${e://Field/switchpoint_main_r3_yes}";
        let stored_sr = "${e://Field/switch_row_main_r3_yes}";
        let stored_sp_num;
        let stored_sr_num;
        if (stored_sp === "") {
            back_rvise = 0;
        } else {
            stored_sp_num = parseInt(stored_sp);
            if (sp !== stored_sp_num) {
                back_rvise = 1;
            } else {
                if (sp === 3) {
                    stored_sr_num = parseInt(stored_sr);
                    if (switch_row === stored_sr_num) {
                        back_rvise = 0;
                    } else {
                        back_rvise = 1;
                    }
                } else {
                    back_rvise = 0;
                }
            }
        }
        console.log("back_revise is ", back_rvise);
        Qualtrics.SurveyEngine.setEmbeddedData("back_revise_r3", back_rvise);
    }

    /**
     *
     * checks whether the page has been initialized for the first time,
     * if not, check whether the round3 choices have been revised.
     */
    function checkRevised() {
        let r3_main = "${e://Field/switchpoint_main_r3_yes}";
        let r3_row = "${e://Field/switch_row_main_r3_yes}";
        let row_num;
        //console.log("r3_main is ", r3_main);
        //console.log("r3_row is ", r3_row);
        if (r3_main !== "") {
            // let r1_main = parseInt("${e://Field/switchpoint}");
            // let r1_row = parseInt("${e://Field/switch_row_main}");
            sp = parseInt(r3_main);
            if (sp === 3) {
                row_num = parseInt(r3_row);
            } else if (sp === 2) {
                row_num = len - 1;
            } else {
                row_num = -1;
            }
            prepopulated_switch_row = row_num;
            fill_in_table(qid, row_num, value);
        } else {
            prepopulate();
        }
    }

    function prepopulate() {
        let wtp_upper;
        let wtp_lower;
        let wtp_incr;

        wtp_lower = parseInt("${e://Field/wtp_revise}");
        wtp_incr = parseFloat("${e://Field/fmpl_eff_incr_swi}") * 2;

        findWTPbounds();

        function findWTPbounds() {
            if (wtp_lower < 0) {
                wtp_upper = wtp_lower;
                wtp_lower = wtp_upper - wtp_incr;
            } else if (wtp_lower > 0) {
                wtp_upper = wtp_lower + wtp_incr;
            } else {
                const r2_wtp_upper = parseFloat("${e://Field/upper_bound_wtp_r2_num}");
                const r2_wtp_lower = parseFloat("${e://Field/lower_bound_wtp_r2_num}");
                const r2_wtp_avg = (r2_wtp_upper + r2_wtp_lower) / 2;
                if (r2_wtp_avg < 0) {
                    wtp_upper = wtp_lower;
                    wtp_lower = wtp_upper - wtp_incr;
                } else if (r2_wtp_avg > 0) {
                    wtp_upper = wtp_lower + wtp_incr;
                } // FOR FUTURE REFERENCE: RANDOMIZE IF R2_WTP_AVG === 0!
            }
        }

        let row_num = -1;
        const rows = question.getElementsByClassName("ChoiceRow");
        let len = rows.length;
        let lower_bound;
        let upper_bound;

        let upper_bound_wtp_min = parseFloat("${e://Field/upper_bound_wtp_min}");
        let lower_bound_wtp_max = parseFloat("${e://Field/lower_bound_wtp_max}")

        if (wtp_lower >= lower_bound_wtp_max) {
            if (iseffLeft()) {
                row_num = len - 1;
            } else {
                row_num = -1;
            }
        } else if (wtp_upper <= upper_bound_wtp_min) {
            if (iseffLeft()) {
                row_num = -1;
            } else {
                row_num = len - 1;
            }
        }

        else {
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
        }

        prepopulated_switch_row = row_num;

        populateChoices_h(rows, row_num);
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

    function getInputByValue(inputs, value) {
        for (let i in inputs) {
            let input = inputs[i];
            //console.log(input.value);
            if (Number(input.value) === value) {
                return input;
            }
        }
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

    /**
     * Randomizes the header label position and generates choice values according to the main mpl switch
     point, with eff prices being discounted.
     * @param QID - the question id
     * @param eff_init - the initial value of eff ** original ** price
     * @param eff_incr - the increment value of eff ** original ** price
     * @param trad_init - the initial value of tradogen price
     * @param trad_incr - the increment value of tradogen price
     * @param disc_rate - the rate of discount = final eff price / original eff price
     */
    function editLabels(QID, eff_init, eff_incr, trad_init, trad_incr, disc_rate) {
        addHeader(QID);
        const rows = question.getElementsByClassName("ChoiceRow");

        let eff_value = (iseffLeft()) ? 1 : 2;


        if (iseffLeft()) {
            eff_init_ori = parseFloat("${e://Field/mpl_eff_init}")/disc_rate;
            trad_init = parseFloat("${e://Field/mpl_trad_init}");
            eff_incr_ori = parseFloat("${e://Field/mpl_eff_incr}")/disc_rate;
            trad_incr = parseFloat("${e://Field/mpl_trad_incr}");
            eff_init = parseFloat("${e://Field/mpl_eff_init}");
            eff_incr = parseFloat("${e://Field/mpl_eff_incr}");
        } else {
            eff_init_ori = parseFloat("${e://Field/mpl_trad_init}")/disc_rate;
            trad_init = parseFloat("${e://Field/mpl_eff_init}");
            eff_incr_ori = parseFloat("${e://Field/mpl_trad_incr}")/disc_rate;
            trad_incr = parseFloat("${e://Field/mpl_eff_incr}");
            eff_init = parseFloat("${e://Field/mpl_trad_init}");
            eff_incr = parseFloat("${e://Field/mpl_trad_incr}");
        }

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const inputs = row.getElementsByTagName("input");
            const input_eff = getInputByValue(inputs, eff_value);
            const input_trad = getInputByValue(inputs, 3-eff_value);
            const label_eff = input_eff.labels[0];
            const label_trad = input_trad.labels[0];

            let eff_ori = (eff_init_ori + i * eff_incr_ori).toFixed(2).replace(/\.00$/, '');
            let eff = (eff_init + i * eff_incr).toFixed(2).replace(/\.00$/, '');
            let trad = (trad_init + i * trad_incr).toFixed(2).replace(/\.00$/, '');

            label_eff.innerHTML = "<strong><s>$"+eff_ori+"</s><span style=\"color:red\"> $" + eff +"</span></strong>";
            label_trad.innerHTML = "<strong>$"+trad+"</strong>";
        }
    }

    function add_button_events(){
        const rows = question.getElementsByClassName("ChoiceRow");
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const row_header = row.getElementsByClassName("c1")[0];
            const header_id = row_header.id;
            const char_arr = header_id.split("~");
            const id_num = Number(char_arr[char_arr.length-1]);
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
        Qualtrics.SurveyEngine.setEmbeddedData("switchpoint_main_r3_yes", switch_point);
        Qualtrics.SurveyEngine.setEmbeddedData("switch_row_main_r3_yes", switch_row);
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

    /**
     *
     * @param QID
     * @param row
     * @param sp
     */
    function getDecNum(QID, row, sp) {
        sp = Number(sp);
        const rows = question.getElementsByClassName("ChoiceRow");
        const row_ele = rows[row];
        const header = row_ele.getElementsByClassName("c1")[0];
        const label = header.getElementsByTagName("label")[0].textContent;
        const matches = label.match(/(\d+)/);
        let dec_num;
        if (matches) {
            dec_num = matches[0];
        }
        //all a selected
        if ((sp === 1 && iseffLeft()) || (sp === 2 && !iseffLeft())) {
            dec_num = parseInt("${e://Field/num_totaldecisions_1r}") + 1;
        }
        //all b selected
        if ((sp === 1 && !iseffLeft()) || (sp === 2 && iseffLeft())) {
            dec_num = Number(dec_num) - 1;
        }
        return Number(dec_num);
    }

    /***
     *
     * @param QID
     * @param value the value of eff choices
     */
    function calculate_wtp(QID, value) {
        let eff_incr;
        let trad_incr;

        if (iseffLeft()) {
            eff_incr = parseFloat("${e://Field/fmpl_eff_incr_swi}");
            trad_incr = parseFloat("${e://Field/fmpl_trad_incr_swi}");
        } else {
            eff_incr = parseFloat("${e://Field/fmpl_trad_incr_swi}");
            trad_incr = parseFloat("${e://Field/fmpl_eff_incr_swi}");
        }

        let lower_eff;
        let lower_trad;
        let upper_eff;
        let upper_trad;

        let lower_bound_eff;
        let lower_bound_trad;
        let upper_bound_eff;
        let upper_bound_trad;

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
        // lower_bound_eff = getBoundByRow(QID, lower_eff, value);
        // let lower_bound_trad = getBoundByRow(QID, lower_trad, 3-value);
        if (Number(sp) !== 3) {
            lower_eff = lower_eff ? lower_eff : upper_eff;
        }
        let dec_num = getDecNum(QID, lower_eff, sp);
        Qualtrics.SurveyEngine.setEmbeddedData("lower_bound_main_decno_r3", dec_num);
        Qualtrics.SurveyEngine.setEmbeddedData("lower_bound_eff_main_r3", lower_bound_eff);
        Qualtrics.SurveyEngine.setEmbeddedData("lower_bound_trad_main_r3", lower_bound_trad);
        console.log("testing r3 mpl no");
        console.log("lower bound eff is ", lower_bound_eff);
        console.log("lower bound trad is ", lower_bound_trad);
        console.log("upper bound eff is ", upper_bound_eff);
        console.log("upper bound trad is ", upper_bound_trad);
        if (Number(sp) !== 3) {
            Qualtrics.SurveyEngine.setEmbeddedData("lower_bound_eff_r3", lower_bound_eff);
            Qualtrics.SurveyEngine.setEmbeddedData("upper_bound_eff_r3", upper_bound_eff);
            Qualtrics.SurveyEngine.setEmbeddedData("lower_bound_trad_r3", lower_bound_trad);
            Qualtrics.SurveyEngine.setEmbeddedData("upper_bound_trad_r3", upper_bound_trad);
            let lower_bound = Number(lower_bound_eff - lower_bound_trad);
            let upper_bound = Number(upper_bound_eff - upper_bound_trad);
            let lower_bound_cp = transNum(Math.min(lower_bound, upper_bound));
            let upper_bound_cp = transNum(Math.max(lower_bound, upper_bound));
            Qualtrics.SurveyEngine.setEmbeddedData("lower_bound_wtp_r3", lower_bound_cp);
            Qualtrics.SurveyEngine.setEmbeddedData("upper_bound_wtp_r3", upper_bound_cp);
            let lower_bound_num = Math.min(lower_bound, upper_bound);
            let upper_bound_num = Math.max(lower_bound, upper_bound);
            Qualtrics.SurveyEngine.setEmbeddedData("lower_bound_wtp_r3_num", lower_bound_num);
            Qualtrics.SurveyEngine.setEmbeddedData("upper_bound_wtp_r3_num", upper_bound_num);
            console.log("lower bound wtp is ", lower_bound_num);
            console.log("upper bound wtp is ", upper_bound_num);
        }
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
