// for R1_emission_mpl
Qualtrics.SurveyEngine.addOnload(function()
{
    /*Place your JavaScript here to run when the page loads*/


});

Qualtrics.SurveyEngine.addOnReady(function()
{
    /*Place your JavaScript here to run when the page is fully displayed*/
    const qid = this.questionId;
    let basenum;
    let len;
    let sp;
    let switch_row;
    let value;

    add_button_events();
    editLabels(qid, 5, 5);

    let nextbutton = document.getElementById("NextButton");

    nextbutton.onclick = function() {
        alert("next button was clicked");
        findSwitchPoint(qid);
        if (isLedLeft()) {
            value = 1;
        } else {
            value = 2;
        }
        calculate_wtp(qid);
    };


    function add_button_events(){
        let radio1 = document.getElementsByTagName("input");
        const first_id = radio1[0].id;
        //console.log("first button id is ", first_id);
        const arr = first_id.split("~");
        basenum = Number(arr[arr.length-2]);
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

    function fill_in_table(QID, row_number, value) {
        const rows = document.getElementsByClassName("ChoiceRow");
        for (let i = 0; i < rows.length; i++) {
            const choice_a = "QR~" + QID + "~"+(i+basenum).toString()+"~1";
            const choice_b = "QR~" + QID + "~"+(i+basenum).toString()+"~2";
            if (i >= Number(row_number) && value === 2) {
                document.getElementById(choice_a).checked = false;
                document.getElementById(choice_b).checked = true;
            }
            if (i < Number(row_number)) {
                document.getElementById(choice_a).checked = true;
                document.getElementById(choice_b).checked = false;
            }
        }
    }

    function editLabels(QID, inita, incra) {
        // let num = parseInt("${e://Field/display_order}");
        // console.log(num);
        const rows = document.getElementsByClassName("ChoiceRow");
        //const headers = rows.getElementsByClassName("c1");
        for (let i = 0; i < rows.length; i++) {
            const num = (i+1).toString();
            const id = "header~"+qid+"~"+num+"~mobile";
            //console.log("the header id is ", id);
            document.getElementById(id).innerHTML = num+")&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; $" + (inita + incra * i).toString();
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
        //console.log("your emission switch point is ", switch_point);
        sp = switch_point;
        //console.log("your switch row is ", switch_row);
        Qualtrics.SurveyEngine.setEmbeddedData("switchpoint_emission_main", switch_point);
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

    function isLedLeft() {
        let num = parseInt("${e://Field/display_order}");
        return num === 0;
    }

    /***
     *
     * @param QID
     */
    function calculate_wtp(QID) {
        let index;

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
        const id_lower = "header~"+QID+"~"+(index+basenum).toString()+"~mobile";
        //console.log("lower bound for yes is ", id_lower);
        let lower_bound;
        const text = document.getElementById(id_lower).textContent;
        lower_bound = text.substring(text.indexOf('$') + 1);
        console.log("it's just a dummy test for emission main");
        console.log("lower bound yes is ", lower_bound);
        Qualtrics.SurveyEngine.setEmbeddedData("lower_bound_emission_yes", lower_bound);
    }
});

Qualtrics.SurveyEngine.addOnUnload(function()
{

});