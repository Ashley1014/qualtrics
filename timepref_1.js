//for timepref_1
Qualtrics.SurveyEngine.addOnload(function()
{
    /*Place your JavaScript here to run when the page loads*/


});

Qualtrics.SurveyEngine.addOnReady(function()
{
    /*Place your JavaScript here to run when the page is fully displayed*/
    const qid = this.questionId;
    let len;
    let sp;
    let switch_row;

    let radio1 = document.getElementsByTagName("input");
    const first_id = radio1[0].id;
    //console.log("first button id is ", first_id);
    const arr = first_id.split("~");
    let basenum = Number(arr[arr.length-2]);

    add_button_events();

    let nextbutton = document.getElementById("NextButton");

    nextbutton.onclick = function() {
        //alert("next button was clicked");
        findSwitchPoint(qid);
        calculate_wtp(qid, 1, -1, 0);
    };

    function add_button_events(){
        // let radio1 = document.getElementsByTagName("input");
        // const first_id = radio1[0].id;
        // //console.log("first button id is ", first_id);
        // const arr = first_id.split("~");
        // basenum = Number(arr[arr.length-2]);
        //console.log("base num is ", basenum);
        for(radio in radio1) {
            radio1[radio].onclick = function() {
                //console.log("button pressed");
                update_table(qid, this.value, this.id);
            }
        }
    }

    function update_table(qid, button_value, button_id) {
        //const rows = document.getElementsByClassName("ChoiceRow");
        //const len = rows.length;
        const value = Number(button_value);
        const arr = button_id.split("~");
        //const qid = arr[1];
        //console.log("cached?");
        //console.log(qid);
        const num = arr[arr.length-1];
        let row = Number(arr[arr.length-2])-basenum;
        //console.log(button_id);
        if (num === 1) {
            row = row+1;
        }
        //console.log(row);
        fill_in_table(qid, row, value);
    }

    // function fill_in_table(QID, row_number, value) {
    //     const rows = document.getElementsByClassName("ChoiceRow");
    //     console.log("len is ", rows.length);
    //     for (let i = 0; i < rows.length; i++) {
    //         const choice_a = "QR~" + QID + "~"+(i+basenum).toString()+"~1";
    //         const choice_b = "QR~" + QID + "~"+(i+basenum).toString()+"~2";
    //         //console.log("choice a id is ", choice_a);
    //         //console.log("choice b id is ", choice_b);
    //         if (i >= Number(row_number) && value === 2) {
    //             document.getElementById(choice_a).checked = false;
    //             document.getElementById(choice_b).checked = true;
    //         }
    //         if (i < Number(row_number) && value === 1) {
    //             document.getElementById(choice_a).checked = true;
    //             document.getElementById(choice_b).checked = false;
    //         }
    //     }
    // }

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
        const rows = document.getElementsByClassName("ChoiceRow");
        //console.log("len is ", rows.length);
        for (let i = 0; i < rows.length; i++) {
           const row = rows[i];
           const inputs = row.getElementsByTagName("input");
           const choice_a = getInputByValue(inputs, 1);
           const choice_b = getInputByValue(inputs, 2);
            //console.log("choice a id is ", choice_a);
            //console.log("choice b id is ", choice_b);
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
            // set switch_point to 1 if all LED choices have been selected;
            // set switch_point to 2 if all halogen choices have been selected;
            switch_point = curr_val;
            switch_row = len-1;
        }
        //console.log("your switch point is ", switch_point);
        sp = switch_point;
        //console.log("your switch row is ", switch_row);
        //Qualtrics.SurveyEngine.setEmbeddedData("switchpoint", switch_point);
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

    function findLabelForControl(el) {
        const idVal = el.id;
        let labels = document.getElementsByTagName('label');
        for(let i = 0; i < labels.length; i++ ) {
            if (labels[i].htmlFor === idVal)
                return labels[i];
        }
    }

    /**
     * get the bound by specified value and row number.
     * @param QID the question number
     * @param row_num the intended row number
     * @param value the value of the intended cell
     * @param field{string} the intended field to be accessed
     * @returns {string} the content string in [row] with [value]
     */
    function getBoundByRow(QID, row_num, value, field) {
        const rows = document.getElementsByClassName("ChoiceRow");
        const row = rows[row_num];
        const inputs = row.getElementsByTagName("input");
        const input = getInputByValue(inputs, value);
        const label = findLabelForControl(input);
        let text = label.textContent;
        return text.substring(text.lastIndexOf('$') + 1, text.indexOf(field));
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

        if (Number(sp) === 3) {
            //console.log("there is a switch point");
            lower_eff = switch_row;
            lower_trad = switch_row;
            upper_eff = switch_row + 1;
            upper_trad = switch_row + 1;
            lower_bound_eff = getBoundByRow(QID, lower_eff, value, ' today');
            lower_bound_trad = getBoundByRow(QID, lower_trad, 3-value, ' in');
            upper_bound_eff = getBoundByRow(QID, upper_eff, value, ' today');
            upper_bound_trad = getBoundByRow(QID, upper_trad, 3-value, ' in');
        } else if (Number(sp) === 1) {
            //console.log("all eff chosen, eff is left.");
            lower_eff = len - 1;
            lower_trad = len - 1;
            lower_bound_eff = getBoundByRow(QID, lower_eff, value, ' today');
            lower_bound_trad = getBoundByRow(QID, lower_trad, 3-value, ' in');
            upper_bound_eff = Number(lower_bound_eff) + eff_incr;
            upper_bound_trad = Number(lower_bound_trad) + trad_incr;
            //console.log("lower eff bound is ", lower_eff);
        } else {
            //console.log("inside else");
            upper_eff = 0;
            upper_trad = 0;
            upper_bound_eff = getBoundByRow(QID, upper_eff, value, ' today');
            upper_bound_trad = getBoundByRow(QID, upper_trad, 3-value, ' in');
            lower_bound_eff = Number(upper_bound_eff) - eff_incr;
            lower_bound_trad = Number(upper_bound_trad) - trad_incr;
        }
        console.log("testing timepref1");
        console.log("lower bound sooner is ", lower_bound_eff);
        console.log("lower bound later is ", lower_bound_trad);
        console.log("upper bound sooner is ", upper_bound_eff);
        console.log("upper bound later is ", upper_bound_trad);
        Qualtrics.SurveyEngine.setEmbeddedData("lower_bound_sooner_timepref1", lower_bound_eff);
        Qualtrics.SurveyEngine.setEmbeddedData("lower_bound_later_timepref1", lower_bound_trad);
        Qualtrics.SurveyEngine.setEmbeddedData("upper_bound_sooner_timepref1", upper_bound_eff);
        Qualtrics.SurveyEngine.setEmbeddedData("upper_bound_later_timepref1", upper_bound_trad);
    }

});

Qualtrics.SurveyEngine.addOnUnload(function()
{

});