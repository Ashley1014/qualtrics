//for R3_mpl_no_disc
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

    let value;

    let len;
    let sp;
    let switch_row;

    let sp_main;
    let row_main;

    //let num = parseInt("${e://Field/display_order}");

    let price_init = parseInt("${e://Field/price_init}");
    let price_incr = parseInt("${e://Field/price_incr}");

    let trad_init = parseInt("${e://Field/trad_init}");
    let trad_incr = parseInt("${e://Field/trad_incr}");
    let disc_rate = parseFloat("${e://Field/disc_rate}");
    let eff_init_ori = parseInt("${e://Field/eff_init_ori}");
    let eff_incr_ori = parseInt("${e://Field/eff_incr_ori}");

    editLabels(qid, eff_init_ori, eff_incr_ori, trad_init, trad_incr, disc_rate);
    populateChoices();
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
        checkRevised();
        calculate_wtp(qid, value);
    };


    /**
     *
     * checks whether the page has been initialized for the first time,
     * if not, check whether the round3 choices have been revised.
     */
    function checkRevised() {
        let r3_main = "${e://Field/switchpoint_main_r3}";
        let r3_row = "${e://Field/switch_row_main_r3}";
        //console.log("r3_main is ", r3_main);
        //console.log("r3_row is ", r3_row);
        if (r3_main !== "") {
            let r2_main = parseInt("${e://Field/switchpoint_main_r2}");
            let r2_row = parseInt("${e://Field/switch_row_main_r2}");
            sp_main = parseInt(r3_main);
            row_main = parseInt(r3_row);
            let r3_no_revised = (r2_main!==sp_main) || (r2_main===sp_main && r2_row!==row_main);
            if (r3_no_revised) {
                //console.log("round 3 has been revised");
            } else {
                //console.log("round 3 has not been revised");
            }
            Qualtrics.SurveyEngine.setEmbeddedData("r3_no_revised", r3_no_revised);
        } else {
            sp_main = parseInt("${e://Field/switchpoint_main_r2}");
            row_main = parseInt("${e://Field/switch_row_main_r2}");
        }
    }

    function populateChoices() {
        //let wtp_upper = parseInt("${q://QID763/ChoiceTextEntryValue}");
        //let wtp_lower = wtp_upper-1;

        checkRevised();

        //console.log("wtp_lower is", wtp_lower);
        //console.log("wtp_upper is", wtp_upper);

        //let radios = document.getElementsByTagName("input");
        let row;
        const rows = question.getElementsByClassName("ChoiceRow");
        const len = rows.length;

        let order = parseInt("${e://Field/display_order}");

        if (sp_main === 3) {
            row = row_main;
        } else if (sp_main === 1) {
            if (order === 0) {
                row = len - 1;
            } else {
                row = -1;
            }
        } else {
            if (order === 0) {
                row = -1;
            } else {
                row = len - 1;
            }
        }
        populateChoices_h(rows, row);
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
        Qualtrics.SurveyEngine.setEmbeddedData("switchpoint_main_r3", switch_point);
        Qualtrics.SurveyEngine.setEmbeddedData("switch_row_main_r3", switch_row);
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
     */
    function getDecNum(QID, row) {
        const rows = question.getElementsByClassName("ChoiceRow");
        const row_ele = rows[row];
        const header = row_ele.getElementsByClassName("c1")[0];
        const label = header.getElementsByTagName("label")[0].textContent;
        const matches = label.match(/(\d+)/);
        let dec_num;
        if (matches) {
            dec_num = matches[0];
        }
        console.log("dec_num is ", dec_num);
        return Number(dec_num);
    }

    /***
     *
     * @param QID
     * @param value the value of eff choices
     */
    function calculate_wtp(QID, value) {
        //const rows = document.getElementsByClassName("ChoiceRow");

        let lower_eff;
        let lower_trad;
        let eff_fmpl_incr = parseFloat("${e://Field/eff_fmpl_incr}");
        let trad_fmpl_incr = parseFloat("${e://Field/trad_fmpl_incr}");

        //console.log("sp is ", sp.type);

        if (Number(sp) === 3) {
            //console.log("there is a switch point");
            lower_eff = switch_row;
            lower_trad = switch_row;
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
        let lower_bound_eff = getBoundByRow(QID, lower_eff, value);
        let lower_bound_trad = getBoundByRow(QID, lower_trad, 3-value);
        let dec_num = getDecNum(QID, lower_eff);
        Qualtrics.SurveyEngine.setEmbeddedData("lower_bound_main_decno_r3", dec_num);
        Qualtrics.SurveyEngine.setEmbeddedData("lower_bound_eff_main_r3", lower_bound_eff);
        Qualtrics.SurveyEngine.setEmbeddedData("lower_bound_trad_main_r3", lower_bound_trad);
        Qualtrics.SurveyEngine.setEmbeddedData("fmpl_eff_init_r3", Number(lower_bound_eff) + eff_fmpl_incr);
        Qualtrics.SurveyEngine.setEmbeddedData("fmpl_trad_init_r3", Number(lower_bound_trad) + trad_fmpl_incr);
        console.log("testing r3_mpl_no_disc");
        console.log("lower bound eff is ", lower_bound_eff);
        console.log("lower bound trad is ", lower_bound_trad);
    }
});

Qualtrics.SurveyEngine.addOnUnload(function()
{

});