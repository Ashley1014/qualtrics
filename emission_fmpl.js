// for emissions_fmpl
Qualtrics.SurveyEngine.addOnload(function()
{
    /*Place your JavaScript here to run when the page loads*/


});

Qualtrics.SurveyEngine.addOnReady(function()
{
    /*Place your JavaScript here to run when the page is fully displayed*/
    const qid = this.questionId;
    const question = document.getElementById(qid);
    const switchpoint = parseInt("${e://Field/switchpoint_emissions_main}");
    const init = parseInt("${e://Field/lower_bound_emissions}");
    let radio1 = document.getElementsByTagName("input");
    const first_id = radio1[0].id;
    //console.log("first button id is ", first_id);
    const arr = first_id.split("~");
    let basenum = Number(arr[arr.length-2]);

    editLabels(qid, switchpoint, init);
    add_button_events();
    clearSelection();

    let len;
    let sp;
    let switch_row;

    let nextbutton = document.getElementById("NextButton");
    nextbutton.onclick = function() {
        //alert("next button was clicked");
        findSwitchPoint(qid);
        calculate_wtp(qid);
    };

    function clearSelection() {
        //debugger;
        const back_revise = parseInt("${e://Field/back_revise_emissions}");
        console.log("back_revise is ", back_revise);
        if (back_revise === 1) {
            console.log("clear respondents' selections!");
            // console.log("Qualtrics.SurveyEngine.registry[qid].getChoices is ", Qualtrics.SurveyEngine.registry[qid].getChoices())
            // console.log("Qualtrics.SurveyEngine.registry[qid].getChoiceValue(495) is ", Qualtrics.SurveyEngine.registry[qid].getChoiceValue(495))
            // console.log("Qualtrics.SurveyEngine.registry[qid].getChoiceValue(496) is ", Qualtrics.SurveyEngine.registry[qid].getChoiceValue(496))
            // console.log("Qualtrics.SurveyEngine.registry[qid].getChoiceAnswerValue(496) is ", Qualtrics.SurveyEngine.registry[qid].getChoiceAnswerValue(496))
            //Qualtrics.SurveyEngine.registry[qid].setChoiceValue(496, 2, false);
            Qualtrics.SurveyEngine.registry[qid].getChoices().map(function(rowId) {
                //console.log('setting rowId to false: ', rowId)
                Qualtrics.SurveyEngine.registry[qid].setChoiceValue(rowId, 1, false);
                Qualtrics.SurveyEngine.registry[qid].setChoiceValue(rowId, 2, false);
            })
        }
    }

    function add_button_events() {
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


    /**
     * return a dictionary of the initial fmpl prices of two products.
     * @param sp{int}
     * @return res result dictionary
     */
    function findInfo(sp) {
        let res = {
            "init": null,
            "incr": null
        };

        //@TODO: ** change the eff fmpl init price variable when there's a switchpoint and when choice_a is eff **
        let init_swi = parseFloat("$e{ ( e://Field/lower_bound_emissions + e://Field/emissions_fmpl_incr_swi ) }");
        //@TODO: ** change the eff fmpl init price variable when there's a switchpoint and when choice_b is eff **
        let init_ally = parseFloat("$e{ ( e://Field/lower_bound_emissions + e://Field/emissions_fmpl_incr_ally ) }");
        //@TODO: ** change the trad fmpl init price variable when there's a switchpoint and when choice_a is trad **
        let init_alln = parseFloat("$e{e://Field/emissions_fmpl_init_alln}");
        let incr_swi = parseFloat("${e://Field/emissions_fmpl_incr_swi}");
        let incr_ally = parseFloat("${e://Field/emissions_fmpl_incr_ally}");
        let incr_alln = parseFloat("${e://Field/emissions_fmpl_incr_alln}");

        //all yes selected
        if (sp === 1) {
            res["init"] = init_ally;
            res["incr"] = incr_ally;
        }
        //alltrad_ea(tb)
        else if (sp === 2) {
            res["init"] = init_alln;
            res["incr"] = incr_alln;
        } else {
            res["init"] = init_swi;
            res["incr"] = incr_swi;
        }
        return res;
    }


    /**
     * Randomizes the header label position and generates choice values according to the main mpl switch
     point.
     * @param QID - the question id
     * @param switchpoint - the switch point of the main mpl question if there's any
     * @param init
     */
    function editLabels(QID, switchpoint, init) {
        const rows = question.getElementsByClassName("ChoiceRow");
        const len = rows.length;
        let sp = switchpoint;
        init = findInfo(sp)["init"];
        let incr = findInfo(sp)["incr"];
        for (let i = 0; i < len; i++) {
            let price = (init + incr * i).toFixed(2).replace(/\.00$/, '');
            const row = rows[i];
            const row_header = row.getElementsByClassName("c1")[0];
            const num = convertToRoman(i+1).toString();
            row_header.innerHTML = num+")&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; <strong> $" + price + "</strong>";
        }
    }

    function convertToRoman(num) {
        var roman = {
            m: 1000,
            cm: 900,
            d: 500,
            cd: 400,
            c: 100,
            xc: 90,
            l: 50,
            xl: 40,
            x: 10,
            ix: 9,
            v: 5,
            iv: 4,
            i: 1
        };
        var str = '';

        for (var i of Object.keys(roman)) {
            var q = Math.floor(num / roman[i]);
            num -= q * roman[i];
            str += i.repeat(q);
        }

        return str;
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
        //console.log("your emissions fmpl switch point is ", switch_point);
        sp = switch_point;
        //console.log("your switch row is ", switch_row);
        // Qualtrics.SurveyEngine.setEmbeddedData("switchpoint_emissions_main", switch_point);
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
     * @returns {int} the content number in [row] with [value]
     */
    function getBoundByRow(QID, row) {
        const rows = question.getElementsByClassName("ChoiceRow");
        const row_ele = rows[row];
        const row_header = row_ele.getElementsByClassName("c1")[0];
        const text = row_header.innerText;
        return Number(text.substring(text.lastIndexOf('$') + 1));
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

        let main_sp = parseInt("${e://Field/switchpoint_emissions_main}");

        let incr = findInfo(main_sp)["incr"];

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
        Qualtrics.SurveyEngine.setEmbeddedData("lower_bound_wtp_emissions", lower_bound);
        Qualtrics.SurveyEngine.setEmbeddedData("upper_bound_wtp_emissions", upper_bound);
    }

});

Qualtrics.SurveyEngine.addOnUnload(function()
{
    /*Place your JavaScript here to run when the page is unloaded*/

});
