// for cost_mpl
Qualtrics.SurveyEngine.addOnload(function()
{
    /*Place your JavaScript here to run when the page loads*/


});

Qualtrics.SurveyEngine.addOnReady(function()
{
    /*Place your JavaScript here to run when the page is fully displayed*/
    const qid = this.questionId;
    const question = document.getElementById(qid);
    let basenum;
    add_button_events();
    editLabels(qid, 5, 5);

    let len;
    let sp;
    let switch_row;
    let value;

    let nextbutton = document.getElementById("NextButton");

    nextbutton.onclick = function() {
        //alert("next button was clicked");
        findSwitchPoint(qid);
        if (isLedLeft()) {
            value = 1;
        } else {
            value = 2;
        }
        calculate_wtp(qid);
    };

    function isLedLeft() {
        let num = parseInt("${e://Field/display_order}");
        return num === 0;
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

    function getInputByValue(inputs, value) {
        for (let i in inputs) {
            let input = inputs[i];
            //console.log(input.value);
            if (Number(input.value) === value) {
                return input;
            }
        }
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

    function editLabels(QID, inita, incra) {
        inita = parseInt("${e://Field/cost_mpl_init}");
        incra = parseInt("${e://Field/cost_mpl_incr}");
        const rows = question.getElementsByClassName("ChoiceRow");
        //const headers = rows.getElementsByClassName("c1");
        for (let i = 0; i < rows.length; i++) {
            let price = (inita + incra * i).toFixed(2).replace(/\.00$/, '');
            const row = rows[i];
            const row_header = row.getElementsByClassName("c1")[0];
            const num = (i+1).toString();
            row_header.innerHTML = num+")&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <strong> $" + price + "</strong>";
        }
    }

    function findSwitchPoint(qid) {
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
            switch_point = curr_val;
            switch_row = len-1;
        }
        //console.log("your cost switch point is ", switch_point);
        sp = switch_point;
        //console.log("your switch row is ", switch_row);
        Qualtrics.SurveyEngine.setEmbeddedData("switchpoint_cost_main", switch_point);
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

    /**
     * get the bound by specified value and row number.
     * @param QID the question number
     * @param row the intended row number
     * @returns {string} the content string in [row] with [value]
     */
    function getBoundByRow(QID, row) {
        const rows = question.getElementsByClassName("ChoiceRow");
        const row_ele = rows[row];
        const row_header = row_ele.getElementsByClassName("c1")[0];
        const text = row_header.innerText;
        return text.substring(text.lastIndexOf('$') + 1);
    }

    /***
     *
     * @param QID
     */
    function calculate_wtp(QID) {
        let lower_idx;
        let upper_idx;

        let lower_bound;
        let upper_bound;

        let incr = parseFloat("${e://Field/cost_mpl_incr}");

        if (Number(sp) === 3) {
            //console.log("there is a switch point");
            lower_idx = Number(switch_row);
            upper_idx = lower_idx + 1;
            lower_bound = getBoundByRow(QID, lower_idx);
            upper_bound = getBoundByRow(QID, upper_idx);
        } else if (Number(sp) === 1) {
            lower_idx = len - 1;
            lower_bound = getBoundByRow(QID, lower_idx);
            upper_bound = Number(lower_bound) + incr;
        } else {
            //console.log("inside else");
            upper_idx = 0;
            upper_bound = getBoundByRow(QID, upper_idx);
            lower_bound = Number(upper_bound) - incr;
        }
        console.log("testing cost mpl");
        lower_bound = Number(lower_bound);
        upper_bound = Number(upper_bound);
        console.log("lower bound cost is ", lower_bound);
        console.log("upper bound cost is ", upper_bound);
        Qualtrics.SurveyEngine.setEmbeddedData("lower_bound_cost", lower_bound);
        if (Number(sp) !== 3) {
            console.log("lower bound wtp is ", lower_bound);
            console.log("upper bound wtp is ", upper_bound);
            Qualtrics.SurveyEngine.setEmbeddedData("lower_bound_wtp_cost", lower_bound);
            Qualtrics.SurveyEngine.setEmbeddedData("upper_bound_wtp_cost", upper_bound);
        }
    }
});

Qualtrics.SurveyEngine.addOnUnload(function()
{

});