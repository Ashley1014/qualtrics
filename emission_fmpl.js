// for emission_fmpl
Qualtrics.SurveyEngine.addOnload(function()
{
    /*Place your JavaScript here to run when the page loads*/


});

Qualtrics.SurveyEngine.addOnReady(function()
{
    /*Place your JavaScript here to run when the page is fully displayed*/
    console.log("testing emission fmpl");
    const qid = this.questionId;
    //console.log(qid);
    const switchpoint = parseInt("${e://Field/switchpoint_emission_main}");
    const init = parseInt("${e://Field/lower_bound_emission_yes}");
    //console.log("switch point is ", switchpoint);
    //console.log("init price is ", init);

    let radio1 = document.getElementsByTagName("input");
    const first_id = radio1[0].id;
    //console.log("first button id is ", first_id);
    const arr = first_id.split("~");
    let basenum = Number(arr[arr.length-2]);

    editLabels(qid, switchpoint, init);
    add_button_events();
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


    /**
     * Randomizes the header label position and generates choice values according to the main mpl switch
     point.
     * @param QID - the question id
     * @param switchpoint - the switch point of the main mpl question if there's any
     * @param init
     */
    function editLabels(QID, switchpoint, init) {
        const rows = document.getElementsByClassName("ChoiceRow");
        const len = rows.length;
        let sp = switchpoint;
        let incr;
        if (sp === 3) {
            incr = 1;
        }
        // all led being chosen
        else if (sp === 1) {
            incr = 5;
        }
        // all hal being chosen
        else {
            init = 0;
            incr = 1;
        }
        for (let i = 0; i < rows.length; i++) {
            let num = (i + 1).toString();
            const id_lower = "header~" + QID + "~" + num.toString() + "~mobile";
            document.getElementById(id_lower).innerHTML = num + ")&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; $" + (init + incr * i).toString();
        }
    }
});

Qualtrics.SurveyEngine.addOnUnload(function()
{
    /*Place your JavaScript here to run when the page is unloaded*/
    const qid = this.questionId;
    let len;
    let sp;
    let switch_row;
    // let value;

    let radio1 = document.getElementsByTagName("input");
    const first_id = radio1[0].id;
    //console.log("first button id is ", first_id);
    const arr = first_id.split("~");
    let basenum = Number(arr[arr.length-2]);

    findSwitchPoint(qid);
    calculate_wtp(qid);

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
        //console.log("your emission fmpl switch point is ", switch_point);
        sp = switch_point;
        //console.log("your switch row is ", switch_row);
        // Qualtrics.SurveyEngine.setEmbeddedData("switchpoint_emission_main", switch_point);
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
     *
     * @param QID
     */
    function calculate_wtp(QID) {
        let index;
        let upper_idx;

        if (Number(sp) === 3) {
            //console.log("there is a switch point");
            index = Number(switch_row);
        } else if (Number(sp) === 1) {
            index = len - 1;
            //console.log("lower led bound is ", index);
        } else {
            //console.log("inside else");
            index = 0;
        }
        upper_idx = index + 1;
        const id_lower = "header~"+QID+"~"+(index+basenum).toString()+"~mobile";
        //console.log("lower bound for yes is ", id_lower);
        let lower_bound;
        let upper_bound;
        const text = document.getElementById(id_lower).textContent;
        lower_bound = text.substring(text.indexOf('$') + 1);
        console.log("lower bound is ", lower_bound);
        Qualtrics.SurveyEngine.setEmbeddedData("lower_bound_wtp_emissions", lower_bound);
        if (Number(sp) === 1) {
            upper_bound = (Number(lower_bound) + 5).toString();
        } else {
            const id_upper = "header~"+QID+"~"+(upper_idx+basenum).toString()+"~mobile";
            const text_upper = document.getElementById(id_upper).textContent;
            upper_bound = text_upper.substring(text.indexOf('$') + 1);
        }
        console.log("upper bound is ", upper_bound);
        Qualtrics.SurveyEngine.setEmbeddedData("upper_bound_wtp_emissions", upper_bound);
    }
});