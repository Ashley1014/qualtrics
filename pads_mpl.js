// for pads_mpl
Qualtrics.SurveyEngine.addOnload(function()
{
    /*Place your JavaScript here to run when the page loads*/


});

Qualtrics.SurveyEngine.addOnReady(function()
{
    /*Place your JavaScript here to run when the page is fully displayed*/
    //test embedded variables
    console.log("num pads decisions is ", parseInt("${e://Field/num_pads_maindecisions}"));
    console.log("pads lg mpl incr is ", parseInt("${e://Field/pads_lg_mpl_incr}"));
    console.log("pads lg mpl init is ", parseInt("${e://Field/pads_lg_mpl_init}"));

    let condition = "${e://Field/Condition}";
    console.log("condition is ", condition);

    let price_init = parseInt("${e://Field/pads_init}");
    let price_incr = parseInt("${e://Field/pads_incr}");

    const qid = this.questionId;
    const question = document.getElementById(qid);
    //console.log(qid);
    let basenum;
    let radio1 = document.getElementsByTagName("input");
    const first_id = radio1[0].id;
    //console.log("first button id is ", first_id);
    const arr = first_id.split("~");
    basenum = Number(arr[arr.length-2]);
    editLabels(qid, price_init, price_incr);
    add_button_events();
    let len;
    let sp;
    let switch_row;
    let value;
    let pads_fmpl_incr = parseFloat("${e://Field/pads_fmpl_incr}");

    let lg_fmpl_incr;
    let sm_fmpl_incr;

    if (islgLeft()) {
        lg_fmpl_incr = pads_fmpl_incr;
        sm_fmpl_incr = -pads_fmpl_incr;
    } else {
        lg_fmpl_incr = -pads_fmpl_incr;
        sm_fmpl_incr = pads_fmpl_incr;
    }

    let nextbutton = document.getElementById("NextButton");
    nextbutton.onclick = function() {
        //alert("next button was clicked");
        findSwitchPoint(qid);
        if (islgLeft()) {
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

    function editLabels(QID, inita, incra) {
        addHeader(QID);
        let initb;
        let incrb;
        inita = parseInt("${e://Field/pads_lg_mpl_init}");
        initb = parseInt("${e://Field/pads_sm_mpl_init}")
        incra = parseInt("${e://Field/pads_lg_mpl_incr}");
        incrb = parseInt("${e://Field/pads_sm_mpl_incr}");
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
        Qualtrics.SurveyEngine.setEmbeddedData("switchpoint_main_pads", switch_point);
        if (Number(sp) === 3) {
            Qualtrics.SurveyEngine.setEmbeddedData("switch_row_main_pads", switch_row);
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

    function getInputByValue(inputs, value) {
        for (let i in inputs) {
            let input = inputs[i];
            //console.log(input.value);
            if (Number(input.value) === value) {
                return input;
            }
        }
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
     * @param value the value of lg choices
     */
    function calculate_wtp(QID, value) {
        //const rows = document.getElementsByClassName("ChoiceRow");

        let lower_lg;
        let lower_sm;

        //console.log("sp is ", sp.type);

        if (Number(sp) === 3) {
            //console.log("there is a switch point");
            lower_lg = switch_row;
            lower_sm = switch_row;
        } else if (Number(sp) === 1) {
            if (islgLeft()) {
                //console.log("all lg chosen, lg is left.");
                lower_lg = len - 1;
                lower_sm = len - 1;
                //console.log("lower lg bound is ", lower_lg);
            } else {
                //console.log("all lg chosen, lg is right.");
                lower_lg = 0;
                lower_sm = 0;
                //console.log("lower lg bound is ", lower_lg);
            }
        } else {
            //console.log("inside else");
            if (islgLeft()) {
                lower_lg = 0;
                lower_sm = 0;
            } else {
                lower_lg = len - 1;
                lower_sm = len - 1;
            }
        }
        let lower_bound_lg = getBoundByRow(QID, lower_lg, value);
        let lower_bound_sm = getBoundByRow(QID, lower_sm, 3-value);
        let dec_num = getDecNum(QID, lower_lg);
        Qualtrics.SurveyEngine.setEmbeddedData("lower_bound_main_decno_pads", dec_num);
        Qualtrics.SurveyEngine.setEmbeddedData("lower_bound_lg_main", Number(lower_bound_lg));
        Qualtrics.SurveyEngine.setEmbeddedData("lower_bound_sm_main", Number(lower_bound_sm));
        console.log("testing pads_mpl");
        console.log("lower bound lg is ", lower_bound_lg);
        console.log("lower bound sm is ", lower_bound_sm);
    }
});

Qualtrics.SurveyEngine.addOnUnload(function()
{

});