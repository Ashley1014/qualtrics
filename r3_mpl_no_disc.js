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
    let qid = arr[1];
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
            let r1_main = parseInt("${e://Field/switchpoint_main_r2}");
            let r1_row = parseInt("${e://Field/switch_row_main_r2}");
            sp_main = parseInt(r3_main);
            row_main = parseInt(r3_row);
            let r3_no_revised = (r1_main!==sp_main) || (r1_main===sp_main && r1_row!==row_main);
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
        const rows = document.getElementsByClassName("ChoiceRow");
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
        //console.log("switch point is ", row);
        for (let i = 0; i < rows.length; i++) {
            if (i <= row) {
                const choice_a = "QR~" +qid+"~" + (i + basenum).toString() + "~1";
                const choice_b = "QR~" +qid+"~" + (i + basenum).toString() + "~2";
                document.getElementById(choice_a).checked = true;
                document.getElementById(choice_b).checked = false;
            } else {
                // rows[i].style.backgroundColor = color_orange;
                const choice_a = "QR~" +qid+"~" + (i + basenum).toString() + "~1";
                const choice_b = "QR~" +qid+"~" + (i + basenum).toString() + "~2";
                document.getElementById(choice_a).checked = false;
                document.getElementById(choice_b).checked = true;
            }
        }
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
        const question = document.getElementById(qid);
        const rows = question.getElementsByClassName("ChoiceRow");
        //const rows = document.getElementsByClassName("ChoiceRow");
        const len = rows.length;

        let eff_caps = "${e://Field/efficient_allcaps}";
        let trad_caps = "${e://Field/traditional_allcaps}";

        let num = parseInt("${e://Field/display_order}");
        //console.log(num);
        for (let i = 0; i < rows.length; i++) {
            const ida = QID+"-"+(i+basenum).toString()+"-1-label";
            const idb = QID+"-"+(i+basenum).toString()+"-2-label";
            if (num === 0) {
                if (i === 0) {
                    document.getElementById(ida).innerHTML="<u>Choice A:&nbsp;<em>" + eff_caps + "</em></u><br /><strong><s>$"+(eff_init+i*eff_incr).toString()+"</s><span style=\"color:red\"> $" + ((eff_init+i*eff_incr)* disc_rate).toString()+"</span></strong>";
                    document.getElementById(idb).innerHTML="<u>Choice B:&nbsp;<em>" + trad_caps + "</em></u><br /><strong>$"+(trad_init+i*trad_incr).toString()+"</strong>";
                }
                else {
                    document.getElementById(ida).innerHTML="<strong><s>$"+(eff_init+i*eff_incr).toString()+"</s><span style=\"color:red\"> $" + ((eff_init+i*eff_incr)* disc_rate).toString()+"</span></strong>";
                    document.getElementById(idb).innerHTML="<strong>$"+(trad_init+i*trad_incr).toString()+"</strong>";
                }
            } else {
                if (i === 0) {
                    document.getElementById(idb).innerHTML="<u>Choice B:&nbsp;<em>" + eff_caps + "</em></u><br /><strong><s>$"+(eff_init+i*eff_incr).toString()+"</s><span style=\"color:red\"> $" + ((eff_init+i*eff_incr)* disc_rate).toString()+"</span></strong>";
                    document.getElementById(ida).innerHTML="<u>Choice A:&nbsp;<em>" + trad_caps + "</em></u><br /><strong>$"+(trad_init+i*trad_incr).toString()+"</strong>";
                }
                else {
                    document.getElementById(idb).innerHTML="<strong><s>$"+(eff_init+i*eff_incr).toString()+"</s><span style=\"color:red\"> $" + ((eff_init+i*eff_incr)* disc_rate).toString()+"</span></strong>";
                    document.getElementById(ida).innerHTML="<strong>$"+(trad_init+i*trad_incr).toString()+"</strong>";
                }
            }
        }
    }

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

    /***
     *
     * @param QID
     * @param value the value of eff choices
     */
    function calculate_wtp(QID, value) {
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
        const ida_lower = QID+"-"+(lower_eff+basenum).toString()+"-"+value.toString()+"-label";
        const idb_lower = QID+"-"+(lower_trad+basenum).toString()+"-"+(3-value).toString()+"-label";
        // console.log("lower bound for eff is ", ida_lower);
        //console.log("lower bound for tradogen is ", idb_lower);
        var lower_bound_eff;
        var lower_bound_trad;
        const text_eff = document.getElementById(ida_lower).textContent;
        lower_bound_eff = text_eff.substring(text_eff.lastIndexOf('$') + 1);
        const text_trad = document.getElementById(idb_lower).textContent;
        lower_bound_trad = text_trad.substring(text_trad.lastIndexOf('$') + 1);
        Qualtrics.SurveyEngine.setEmbeddedData("lower_bound_eff_main_r3", lower_bound_eff);
        Qualtrics.SurveyEngine.setEmbeddedData("lower_bound_trad_main_r3", lower_bound_trad);
        //console.log("it's just a dummy test for r3 mpl no");
        console.log("testing r3 mpl no disc");
        console.log("lower bound eff is ", lower_bound_eff);
        console.log("lower bound trad is ", lower_bound_trad);
    }
});

Qualtrics.SurveyEngine.addOnUnload(function()
{

});