// for R1_mpl_v2
Qualtrics.SurveyEngine.addOnload(function()
{
    /*Place your JavaScript here to run when the page loads*/


});

Qualtrics.SurveyEngine.addOnReady(function()
{
    /*Place your JavaScript here to run when the page is fully displayed*/
    let condition = "${e://Field/Condition}";
    console.log("condition is ", condition);

    let price_init = parseInt("${e://Field/price_init}");
    let price_incr = parseInt("${e://Field/price_incr}");

    const qid = this.questionId;
    let question = document.getElementById(qid);
    //console.log(qid);
    let basenum;
    let radio1 = document.getElementsByTagName("input");
    const first_id = radio1[0].id;
    //console.log("first button id is ", first_id);
    const arr = first_id.split("~");
    basenum = Number(arr[arr.length-2]);

    let assignment = parseInt("${e://Field/condition_no}");

    if (assignment === 7) {
        editLabels_v2(qid);
    } else {
        editLabels(qid, price_init, price_incr);
    }
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
        calculate_wtp(qid, value);
    };

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

    function getInputByValue(inputs, value) {
        for (let i in inputs) {
            let input = inputs[i];
            //console.log(input.value);
            if (Number(input.value) === value) {
                return input;
            }
        }
    }

    function editLabels(QID, inita, incra) {
        addHeader(QID);
        let initb;
        let incrb;
        inita = parseInt("${e://Field/mpl_eff_init}");
        initb = parseInt("${e://Field/mpl_trad_init}");
        incra = parseInt("${e://Field/mpl_eff_incr}");
        incrb = parseInt("${e://Field/mpl_trad_incr}");
        const rows = question.getElementsByClassName("ChoiceRow");
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const inputs = row.getElementsByTagName("input");
            const input_a = getInputByValue(inputs, 1);
            const input_b = getInputByValue(inputs, 2);
            const label_a = input_a.labels[0];
            const label_b = input_b.labels[0];
            label_a.innerHTML = "<strong>$"+(inita+i*incra).toString()+"</strong>";
            label_b.innerHTML = "<strong>$"+(initb+i*incrb).toString()+"</strong>";
        }
    }

    /**
     * Randomizes the header label position and generates choice values according to the main mpl switch
     point, with eff prices being discounted.
     * @param QID - the question id
     */
    function editLabels_v2(QID) {
        const question = document.getElementById(qid);
        const rows = question.getElementsByClassName("ChoiceRow");

        let eff_caps = "${e://Field/efficient_allcaps}";
        let trad_caps = "${e://Field/traditional_allcaps}";
        let num = parseInt("${e://Field/display_order}");
        reduc_rate = parseFloat("${e://Field/reduc_rate}");

        let eff_init_ori;
        let eff_incr_ori;
        if (iseffLeft()) {
            eff_init_ori = parseFloat("${e://Field/mpl_eff_init}") / reduc_rate;
            trad_init = parseFloat("${e://Field/mpl_trad_init}");
            eff_incr_ori = parseFloat("${e://Field/mpl_eff_incr}") / reduc_rate;
            trad_incr = parseFloat("${e://Field/mpl_trad_incr}");
            eff_init = parseFloat("${e://Field/mpl_eff_init}");
            eff_incr = parseFloat("${e://Field/mpl_eff_incr}");
        } else {
            eff_init_ori = parseFloat("${e://Field/mpl_trad_init}") / reduc_rate;
            trad_init = parseFloat("${e://Field/mpl_eff_init}");
            eff_incr_ori = parseFloat("${e://Field/mpl_trad_incr}") / reduc_rate;
            trad_incr = parseFloat("${e://Field/mpl_eff_incr}");
            eff_init = parseFloat("${e://Field/mpl_trad_init}");
            eff_incr = parseFloat("${e://Field/mpl_trad_incr}");
        }

        for (let i = 0; i < rows.length; i++) {
            const ida = QID+"-"+(i+basenum).toString()+"-1-label";
            const idb = QID+"-"+(i+basenum).toString()+"-2-label";

            let eff_ori = (eff_init_ori + i * eff_incr_ori).toFixed(2).replace(/\.00$/, '');
            let eff = (eff_init + i * eff_incr).toFixed(2).replace(/\.00$/, '');
            let trad = (trad_init + i * trad_incr).toFixed(2).replace(/\.00$/, '');

            if (num === 0) {
                if (i === 0) {
                    document.getElementById(ida).innerHTML="<u>Choice A</u>:&nbsp;<br /><strong>" + eff_caps + "</strong><br /><img alt='eff' height=\"77\" src=\"https://cornell.ca1.qualtrics.com/CP/Graphic.php?IM=IM_3eM0Z9xS5Nz4GXk\" style=\"width: 175px; height: 77px;\" width=\"175\" /><br /><br /><strong>$"+(eff_ori)+"</strong>";
                    document.getElementById(idb).innerHTML="<u>Choice B</u>:&nbsp;<br /><strong>" + trad_caps + "</strong><br /><img alt='trad' height=\"80\" src=\"https://cornell.ca1.qualtrics.com/CP/Graphic.php?IM=IM_bOy1igCnrZLIX4y\" style=\"width: 150px; height: 80px;\" width=\"150\" /><br /><br /><strong>$"+trad+"</strong>";
                }
                else {
                    document.getElementById(ida).innerHTML="<strong>$"+(eff_ori)+"</strong>";
                    document.getElementById(idb).innerHTML="<strong>$"+trad+"</strong>";
                }
            } else {
                if (i === 0) {
                    document.getElementById(idb).innerHTML="<u>Choice B</u>:&nbsp;<br /><strong>" + eff_caps + "</strong><br /><img alt='eff' height=\"77\" src=\"https://cornell.ca1.qualtrics.com/CP/Graphic.php?IM=IM_3eM0Z9xS5Nz4GXk\" style=\"width: 175px; height: 77px;\" width=\"175\" /><br /><br /><strong>$"+(eff_ori)+"</strong>";
                    document.getElementById(ida).innerHTML="<u>Choice A</u>:&nbsp;<br /><strong>" + trad_caps + "</strong><br /><img alt='trad' height=\"80\" src=\"https://cornell.ca1.qualtrics.com/CP/Graphic.php?IM=IM_bOy1igCnrZLIX4y\" style=\"width: 150px; height: 80px;\" width=\"150\" /><br /><br /><strong>$"+trad+"</strong>";
                }
                else {
                    document.getElementById(idb).innerHTML="<strong>$"+(eff_ori)+"</strong>";
                    document.getElementById(ida).innerHTML="<strong>$"+trad+"</strong>";
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
        Qualtrics.SurveyEngine.setEmbeddedData("switchpoint_main_r1", switch_point);
        if (Number(sp) === 3) {
            Qualtrics.SurveyEngine.setEmbeddedData("switch_row_main_r1", switch_row);
        }
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
     */
    function calculate_wtp(QID, value) {
        let lower_bound;
        let upper_bound;
        let eff_fmpl_incr = parseFloat("${e://Field/eff_fmpl_incr}");
        let trad_fmpl_incr = parseFloat("${e://Field/trad_fmpl_incr}");

        //const rows = document.getElementsByClassName("ChoiceRow");

        let lower_eff;
        let lower_trad;

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
        // const ida_lower = QID+"-"+(lower_eff+basenum).toString()+"-"+value.toString()+"-label";
        // const idb_lower = QID+"-"+(lower_trad+basenum).toString()+"-"+(3-value).toString()+"-label";
        // //console.log("lower bound for eff is ", ida_lower);
        // //console.log("lower bound for tradogen is ", idb_lower);
        // // const ida_upper = QID+"-"+(bound_b+480).toString()+"-1-label";
        // // const idb_upper = QID+"-"+(bound_b+480).toString()+"-2-label";
        // var lower_bound_eff;
        // var lower_bound_trad;
        // if (lower_eff === 0) {
        //     const text_eff = document.getElementById(ida_lower).textContent;
        //     lower_bound_eff = text_eff.substring(text_eff.indexOf('$') + 1);
        // } if (lower_trad === 0) {
        //     const text_trad = document.getElementById(idb_lower).textContent;
        //     lower_bound_trad = text_trad.substring(text_trad.indexOf('$')+1);
        // }
        // else {
        //     lower_bound_eff = document.getElementById(ida_lower).textContent.substring(1);
        //     lower_bound_trad = document.getElementById(idb_lower).textContent.substring(1);
        // }
        let lower_bound_eff = getBoundByRow(QID, lower_eff, value);
        let lower_bound_trad = getBoundByRow(QID, lower_trad, 3-value);
        // const upper_bound_eff = document.getElementById(ida_upper).textContent.substring(1);
        // const upper_bound_trad = document.getElementById(idb_upper).textContent.substring(1);
        // lower_bound = Number(lower_bound_eff) - Number(lower_bound_trad);
        // upper_bound = Number(upper_bound_eff) - Number(upper_bound_trad);
        Qualtrics.SurveyEngine.setEmbeddedData("lower_bound_eff_main_r1", lower_bound_eff);
        Qualtrics.SurveyEngine.setEmbeddedData("lower_bound_trad_main_r1", lower_bound_trad);
        Qualtrics.SurveyEngine.setEmbeddedData("fmpl_eff_init_r1", Number(lower_bound_eff) + eff_fmpl_incr);
        Qualtrics.SurveyEngine.setEmbeddedData("fmpl_trad_init_r1", Number(lower_bound_trad) + trad_fmpl_incr);
        console.log("testing r1_mpl");
        console.log("lower bound eff is ", lower_bound_eff);
        console.log("lower bound trad is ", lower_bound_trad);
    }
});

Qualtrics.SurveyEngine.addOnUnload(function()
{

});