// for R3_fmpl_yes_revise
Qualtrics.SurveyEngine.addOnload(function()
{
    /*Place your JavaScript here to run when the page loads*/


});

Qualtrics.SurveyEngine.addOnReady(function() {
    /*Place your JavaScript here to run when the page is fully displayed*/
    console.log("testing r3_fmpl_yes_revise");
    let revised_wtp;
    let assignment = parseInt("${e://Field/condition_no}");
    if (assignment === 10) {
        revised_wtp = parseInt("${q://QID1087/ChoiceTextEntryValue}");
    } else {
        revised_wtp = parseInt("${q://QID763/ChoiceTextEntryValue}");
    }
    //console.log("revised wtp is ", revised_wtp);
    const order = parseInt("${e://Field/display_order}");
    const qid = this.questionId;
    const question = document.getElementById(qid);

    const eff = parseFloat("${e://Field/fmpl_eff_init_r3}");
    const trad = parseFloat("${e://Field/fmpl_trad_init_r3}");
    let fmpl_eff_incr = parseFloat("${e://Field/eff_fmpl_incr}");
    let fmpl_trad_incr = parseFloat("${e://Field/trad_fmpl_incr}");
    const switchpoint = parseInt("${e://Field/switchpoint_main_r3_yes}");

    let radio1 = question.getElementsByTagName("input");
    const first_id = radio1[0].id;
    //console.log("first button id is ", first_id);
    const arr = first_id.split("~");
    let basenum = Number(arr[arr.length - 2]);

    let value;
    if (iseffLeft()) {
        value = 1;
    } else {
        value = 2;
    }

    let sp;
    let switch_row;

    let not_revised;

    let price_init = parseInt("${e://Field/price_init}");
    let price_incr = parseInt("${e://Field/price_incr}");

    let trad_init = parseInt("${e://Field/trad_init}");
    let trad_incr = parseInt("${e://Field/trad_incr}");
    let disc_rate = parseFloat("${e://Field/disc_rate}");
    let eff_init_ori = parseInt("${e://Field/eff_init_ori}");
    let eff_incr_ori = parseInt("${e://Field/eff_incr_ori}");

    if (assignment === 5 || assignment === 6) {
        not_revised = notRevised_v1(price_incr, 5, price_init);
    }
    else {
        not_revised = notRevised_v1(price_incr, 5, price_init);
    }
    if (not_revised) {
        //if (r3_yes_revised === 0) {
        //console.log("has not been revised!");
        question.style.display = "none";
        // fmpls[1].style.display = "none";
    } else {
        // fmpls[0].style.display = "none";
        //let qid = arr[1];
        editLabels(qid, basenum, price_init, price_incr, fmpl_eff_incr, fmpl_trad_incr);
        add_button_events();
        //displayRevised(qid, basenum);

        let nextbutton = document.getElementById("NextButton");

        nextbutton.onclick = function() {
            //alert("next button was clicked");
            findSwitchPoint(qid);
            calculate_wtp(qid, value, fmpl_eff_incr, fmpl_trad_incr);
        };
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

    /**
     * get the bound by specified value and row number.
     * @param QID the question number
     * @param row the intended row number
     * @param value the value of the intended cell
     * @returns {string} the content string in [row] with [value]
     */
    function getBoundByRow(QID, row, value) {
        let id = QID+"-"+(row+basenum).toString()+"-"+value.toString()+"-label";
        let text = document.getElementById(id).textContent;
        return text.substring(text.lastIndexOf('$') + 1);
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

        let main_sp = parseInt("${e://Field/switchpoint_main_r3_yes}");

        eff_incr = findIncr(main_sp)["incr_e"];
        trad_incr = findIncr(main_sp)["incr_t"];

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
        console.log("lower bound eff is ", lower_bound_eff);
        console.log("lower bound trad is ", lower_bound_trad);
        console.log("upper bound eff is ", upper_bound_eff);
        console.log("upper bound trad is ", upper_bound_trad);
        Qualtrics.SurveyEngine.setEmbeddedData("upper_bound_eff_r3", upper_bound_eff);
        Qualtrics.SurveyEngine.setEmbeddedData("upper_bound_trad_r3", upper_bound_trad);
        Qualtrics.SurveyEngine.setEmbeddedData("lower_bound_eff_r3", lower_bound_eff);
        Qualtrics.SurveyEngine.setEmbeddedData("lower_bound_trad_r3", lower_bound_trad);
        let lower_bound = Number(lower_bound_eff - lower_bound_trad);
        let upper_bound = Number(upper_bound_eff - upper_bound_trad);
        let lower_bound_cp = transNum(Math.min(lower_bound, upper_bound));
        let upper_bound_cp = transNum(Math.max(lower_bound, upper_bound));
        console.log("upper bound wtp is ", upper_bound_cp);
        console.log("lower bound wtp is ", lower_bound_cp);
        Qualtrics.SurveyEngine.setEmbeddedData("lower_bound_wtp_r3", lower_bound_cp);
        Qualtrics.SurveyEngine.setEmbeddedData("upper_bound_wtp_r3", upper_bound_cp);
    }

    /**
     * check whether or not revised for non-discount versions
     * return true if not been revised, return false if has been revised.
     * @param interval the intervals of the price lists, must be a positive number
     * @param decision_num number of decisions in ** main mpl **
     * @param init_val
     */
    function notRevised_v1(interval, decision_num, init_val) {

        interval = parseInt("${e://Field/mpl_eff_incr}");
        decision_num = parseInt("${e://Field/num_maindecisions}");
        init_val = parseInt("${e://Field/mpl_eff_init}");

        // eff is on the left
        let upper_bound_wtp = interval * (decision_num - 1);
        let lower_bound_wtp = -interval * (decision_num - 1);
        let notRevised;
        let init_eff = parseInt("${e://Field/lower_bound_eff_main_r3}");
        let init_trad = parseInt("${e://Field/lower_bound_trad_main_r3}");
        let init_wtp = init_eff - init_trad;
        // want to check whether the revised_wtp is within the range
        if (revised_wtp < lower_bound_wtp) {
            if (iseffLeft()) {
                return init_eff <= init_val;
            } else {
                return init_trad >= init_val + interval * (decision_num-1);
            }
        } else if (revised_wtp > upper_bound_wtp) {
            if (iseffLeft()) {
                return init_eff >= init_val + interval * (decision_num-1);
            } else {
                return init_trad <= init_val;
            }
        } else {
            if (iseffLeft()) {
                notRevised = revised_wtp >= init_wtp && revised_wtp <= init_wtp + 2 * interval;
            } else {
                notRevised = revised_wtp >= init_wtp - 2 * interval && revised_wtp <= init_wtp;
            }
        }
        return notRevised;
    }

    /**
     * check whether or not revised for discount versions
     * return true if not been revised, return false if has been revised.
     * @param decision_num the number of decisions
     * @param eff_init_val the initial value of efficient price list
     * @param incr_eff the increment of efficient price list
     * @param trad_init_val the initial value of traditional price list
     * @param incr_trad the increment of traditional price list
     */
    function notRevised_v2(decision_num, eff_init_val, incr_eff, trad_init_val, incr_trad) {

        decision_num = parseInt("${e://Field/num_maindecisions}");
        eff_init_val = parseInt("${e://Field/mpl_eff_init}");
        trad_init_val = parseInt("${e://Field/mpl_trad_init}")
        incr_eff = parseInt("${e://Field/mpl_eff_incr}");
        incr_trad = parseInt("${e://Field/mpl_trad_incr}");

        // eff is on the left
        let upper_bound_wtp = incr_eff * (decision_num - 1);
        let lower_bound_wtp = incr_trad * (decision_num - 1);
        let notRevised;
        let init_eff = parseInt("${e://Field/lower_bound_eff_main_r3}");
        let init_trad = parseInt("${e://Field/lower_bound_trad_main_r3}");
        let init_wtp = init_eff - init_trad;
        // want to check whether the revised_wtp is within the range
        if (revised_wtp < lower_bound_wtp) {
            if (iseffLeft()) {
                return init_eff <= eff_init_val;
            } else {
                return init_trad >= init_trad + incr_trad * (decision_num-1);
            }
        } else if (revised_wtp > upper_bound_wtp) {
            if (iseffLeft()) {
                return init_eff >= eff_init_val + incr_eff * (decision_num-1);
            } else {
                return init_trad <= init_trad;
            }
        } else {
            if (iseffLeft()) {
                notRevised = revised_wtp >= init_wtp && revised_wtp <= init_wtp + incr_eff - incr_trad;
            } else {
                notRevised = revised_wtp >= (init_wtp + incr_eff - incr_trad) && revised_wtp <= init_wtp;
            }
        }
        return notRevised;
    }

    function iseffLeft() {
        let num = parseInt("${e://Field/display_order}");
        return num === 0;
    }

    function add_button_events(){
        let radio1 = question.getElementsByTagName("input");
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
        const rows = question.getElementsByClassName("ChoiceRow");
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

    function displayLabels_v1(QID, init_eff, incr_eff, init_trad, incr_trad, basenum) {
        let eff_caps = "${e://Field/efficient_allcaps}";
        let trad_caps = "${e://Field/traditional_allcaps}";
        let num = parseInt("${e://Field/display_order}");
        const rows = question.getElementsByClassName("ChoiceRow");
        //console.log(num);
        for (let i = 0; i < rows.length; i++) {
            let eff = (init_eff + i * incr_eff).toFixed(2).replace(/\.00$/, '');
            let trad = (init_trad + i * incr_trad).toFixed(2).replace(/\.00$/, '');

            const ida = QID+"-"+(i+basenum).toString()+"-1-label";
            const idb = QID+"-"+(i+basenum).toString()+"-2-label";
            if (num === 0) {
                if (i === 0) {
                    document.getElementById(ida).innerHTML="<u>Choice A</u>:&nbsp;<br /><strong>" + eff_caps + "</strong><br /><br /><strong>$"+eff+"</strong>";
                    document.getElementById(idb).innerHTML="<u>Choice B</u>:&nbsp;<br /><strong>" + trad_caps + "</strong><br /><br /><strong>$"+trad+"</strong>";
                }
                else {
                    document.getElementById(ida).innerHTML="<strong>$"+eff+"</strong>";
                    document.getElementById(idb).innerHTML="<strong>$"+trad+"</strong>";
                }
            } else {
                if (i === 0) {
                    document.getElementById(idb).innerHTML="<u>Choice B</u>:&nbsp;<br /><strong>" + eff_caps + "</strong><br /><br /><strong>$"+eff+"</strong>";
                    document.getElementById(ida).innerHTML="<u>Choice A</u>:&nbsp;<br /><strong>" + trad_caps + "</strong><br /><br /><strong>$"+trad+"</strong>";
                }
                else {
                    document.getElementById(idb).innerHTML="<strong>$"+eff+"</strong>";
                    document.getElementById(ida).innerHTML="<strong>$"+trad+"</strong>";
                }
            }
        }
    }

    function displayLabels_v2(QID, init_eff, incr_eff, init_trad, incr_trad, disc_rate, basenum) {
        let eff_caps = "${e://Field/efficient_allcaps}";
        let trad_caps = "${e://Field/traditional_allcaps}";
        let num = parseInt("${e://Field/display_order}");
        const rows = question.getElementsByClassName("ChoiceRow");
        //console.log(num);
        for (let i = 0; i < rows.length; i++) {
            const ida = QID+"-"+(i+basenum).toString()+"-1-label";
            const idb = QID+"-"+(i+basenum).toString()+"-2-label";
            const eff_disc = (init_eff + i * incr_eff).toFixed(2).replace(/\.00$/, '');
            const eff_original = (eff_disc / disc_rate).toFixed(2).replace(/\.00$/, '');
            let trad = (init_trad + i * incr_trad).toFixed(2).replace(/\.00$/, '');
            if (num === 0) {
                if (i === 0) {
                    document.getElementById(ida).innerHTML="<u>Choice A</u>:&nbsp;<br /><strong>" + eff_caps + "</strong><br /><br /><strong><s>$"+(eff_original)+"</s><span style=\"color:red\"> $" + (eff_disc)+"</span></strong>";
                    document.getElementById(idb).innerHTML="<u>Choice B</u>:&nbsp;<br /><strong>" + trad_caps + "</strong><br /><br /><strong>$"+(trad)+"</strong>";
                }
                else {
                    document.getElementById(ida).innerHTML="<strong><s>$"+eff_original+"</s><span style=\"color:red\"> $" + eff_disc +"</span></strong>";
                    document.getElementById(idb).innerHTML="<strong>$"+trad+"</strong>";
                }
            } else {
                if (i === 0) {
                    document.getElementById(idb).innerHTML="<u>Choice B</u>:&nbsp;<br /><strong>" + eff_caps + "</strong><br /><br /><strong><s>$"+(eff_original)+"</s><span style=\"color:red\"> $" + (eff_disc)+"</span></strong>";
                    document.getElementById(ida).innerHTML="<u>Choice A</u>:&nbsp;<br /><strong>" + trad_caps + "</strong><br /><br /><strong>$"+(trad)+"</strong>";
                }
                else {
                    document.getElementById(idb).innerHTML="<strong><s>$"+eff_original+"</s><span style=\"color:red\"> $" + eff_disc +"</span></strong>";
                    document.getElementById(ida).innerHTML="<strong>$"+trad+"</strong>";
                }
            }
        }
    }



    /**
     * return a dictionary of the initial fmpl prices of two products.
     * @param sp{int}
     * @return res result dictionary
     */
    function findInit(sp) {
        let res = {
            "init_e": null,
            "init_t": null
        };

        //@TODO: ** change the eff fmpl init price variable when there's a switchpoint and when choice_a is eff **
        let inite_sw_ea = parseFloat("$e{ ( e://Field/lower_bound_eff_main_r3 + e://Field/fmpl_eff_incr_swi ) }");
        //@TODO: ** change the eff fmpl init price variable when there's a switchpoint and when choice_b is eff **
        let inite_sw_eb = parseFloat("$e{ ( e://Field/lower_bound_eff_main_r3 - e://Field/fmpl_eff_incr_swi ) }");
        //@TODO: ** change the trad fmpl init price variable when there's a switchpoint and when choice_a is trad **
        let initt_sw_ta = parseFloat("$e{ ( e://Field/lower_bound_trad_main_r3 - e://Field/fmpl_trad_incr_swi ) }");
        //@TODO: ** change the trad fmpl init price variable when there's a switchpoint and when choice_b is trad **
        let initt_sw_tb = parseFloat("$e{ ( e://Field/lower_bound_trad_main_r3 + e://Field/fmpl_trad_incr_swi ) }");
        //@TODO: ** change the eff fmpl init price variable when all eff is selected and when choice_a is eff **
        let inite_alleff_ea = parseFloat("$e{ ( e://Field/lower_bound_eff_main_r3 + e://Field/fmpl_eff_incr_alleff ) }");
        //@TODO: ** change the eff fmpl init price variable when all eff is selected and when choice_b is eff **
        let inite_alleff_eb = parseFloat("$e{ ( e://Field/lower_bound_eff_main_r3 + ( e://Field/num_followdecisions * e://Field/fmpl_eff_incr_alleff ) ) }");
        //@TODO: ** change the trad fmpl init price variable when all trad is selected and when choice_a is trad **
        let initt_alltrad_ta = parseFloat("$e{ ( e://Field/lower_bound_trad_main_r3 - e://Field/fmpl_trad_incr_alltrad ) }");
        //@TODO: ** change the trad fmpl init price variable when all trad is selected and when choice_b is trad **
        let initt_alltrad_tb = parseFloat("$e{ ( e://Field/lower_bound_trad_main_r3 - ( e://Field/num_followdecisions * e://Field/fmpl_trad_incr_alltrad ) ) }");
        //@TODO: ** change the eff fmpl init price variable when all trad is selected **
        let inite_alltrad = parseFloat("$e{ ( e://Field/lower_bound_eff_main_r3 + e://Field/fmpl_eff_incr_alltrad ) }");
        //@TODO: ** change the trad fmpl init price variable when all eff is selected **
        let initt_alleff = parseFloat("$e{ ( e://Field/lower_bound_trad_main_r3 + e://Field/fmpl_trad_incr_alleff ) }");

        if (iseffLeft()) {
            //alleff_ea(tb)
            if (sp === 1) {
                res["init_e"] = inite_alleff_ea;
                res["init_t"] = initt_alleff;
            }
            //alltrad_ea(tb)
            else if (sp === 2) {
                res["init_e"] = inite_alltrad;
                res["init_t"] = initt_alltrad_tb;
            } else {
                res["init_e"] = inite_sw_ea;
                res["init_t"] = initt_sw_tb;
            }
        } else {
            //alleff_eb(ta)
            if (sp === 1) {
                res["init_e"] = inite_alleff_eb;
                res["init_t"] = initt_alleff;
            }
            //alltrad_eb(ta)
            else if (sp === 2) {
                res["init_e"] = inite_alltrad;
                res["init_t"] = initt_alltrad_ta;
            } else {
                res["init_e"] = inite_sw_eb;
                res["init_t"] = initt_sw_ta;
            }
        }
        return res;
    }

    /**
     * return a dictionary of the fmpl price increments of two products.
     * @param sp{int}
     * @return res result dictionary
     */
    function findIncr(sp) {
        let res = {
            "incr_e": null,
            "incr_t": null
        }

        let fmpl_incra_sw = parseFloat("${e://Field/fmpl_eff_incr_swi}");
        let fmpl_incra_alla = parseFloat("${e://Field/fmpl_eff_incr_alleff}");
        let fmpl_incra_allb = parseFloat("${e://Field/fmpl_eff_incr_alltrad}");

        if (iseffLeft()) {
            if (sp === 1) {
                res["incr_e"] = fmpl_incra_alla;
                res["incr_t"] = -fmpl_incra_allb;
            } else if (sp === 2) {
                res["incr_e"] = fmpl_incra_allb;
                res["incr_t"] = -fmpl_incra_alla;
            } else {
                res["incr_e"] = fmpl_incra_sw;
                res["incr_t"] = -fmpl_incra_sw;
            }
        } else {
            if (sp === 1) {
                res["incr_e"] = -fmpl_incra_alla;
                res["incr_t"] = fmpl_incra_allb;
            } else if (sp === 2) {
                res["incr_e"] = -fmpl_incra_allb;
                res["incr_t"] = fmpl_incra_alla;
            } else {
                res["incr_e"] = -fmpl_incra_sw;
                res["incr_t"] = fmpl_incra_sw;
            }
        }
        return res;
    }
    /**
     * Randomizes the header label position and generates choice values according to the main mpl switch
     point.
     * @param QID - the question id
     * @param basenum
     * @param price_init
     * @param price_incr
     * @param fmpl_eff_incr
     * @param fmpl_trad_incr
     */
    function editLabels(QID, basenum, price_init, price_incr, fmpl_eff_incr, fmpl_trad_incr) {
        let sp = parseInt("${e://Field/switchpoint_main_r3_yes}");
        let init_eff;
        let init_trad;
        let incr_eff;
        let incr_trad;

        init_eff = findInit(sp)["init_e"];
        init_trad = findInit(sp)["init_t"];
        incr_eff = findIncr(sp)["incr_e"];
        incr_trad = findIncr(sp)["incr_t"];

        let assignment = parseInt("${e://Field/assignment}");
        if (assignment === 6 || assignment === 16) {
            let disc_rate = parseFloat("${e://Field/disc_rate}");
            displayLabels_v2(QID, init_eff, incr_eff, init_trad, incr_trad, disc_rate, basenum);
        } else {
            displayLabels_v1(QID, init_eff, incr_eff, init_trad, incr_trad, basenum);
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
        Qualtrics.SurveyEngine.setEmbeddedData("switchpoint_fmpl_r3", switch_point);
        Qualtrics.SurveyEngine.setEmbeddedData("switch_row_fmpl_r3", switch_row);
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

});

Qualtrics.SurveyEngine.addOnUnload(function()
{
    /*Place your JavaScript here to run when the page is unloaded*/

});