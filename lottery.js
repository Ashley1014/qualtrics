Qualtrics.SurveyEngine.addOnload(function()
{
    /*Place your JavaScript here to run when the page loads*/

});

Qualtrics.SurveyEngine.addOnReady(function()
{
    /*Place your JavaScript here to run when the page is fully displayed*/
    let round_implement;
    let choice_implement;
    let other_implement;
    let main_sp;
    let fmpl_sp;
    let dec_selected;
    let switch_row_main;
    let switch_row_fmpl;
    const dec_mpl_implement = parseInt("${e://Field/dec_mpl_implement}");
    console.log("dec_mpl_implemented is ", dec_mpl_implement);
    let isSpSelected = checkSwitchpoint();
    if (isSpSelected) {
        console.log("switchpoint has been selected!");
        fmpl_sp = getFollowImplement()["fmpl_sp"];
        dec_selected = getFollowImplement()["dec_selected"];
        switch_row_fmpl = getFollowImplement()["switch_row"];
        backtraceSelection(fmpl_sp, switch_row_fmpl, dec_selected);
        backtracePrice(dec_selected, switch_row_fmpl);
    } else {
        console.log("switchpoint has not been selected!");
        dec_selected = findDecSelected(dec_mpl_implement);
        backtraceSelection(main_sp, switch_row_main, dec_selected);
        backtracePrice(dec_selected, switch_row_main);
    }

    function iseffLeft() {
        let num = parseInt("${e://Field/display_order}");
        return num === 0;
    }

    function findSwitchRow(sp, row) {
        let switch_row;
        if (sp === 3) {
            switch_row = row;
        }
        // eff is A, trad is B
        else if (iseffLeft()) {
            // all eff is selected (all A)
            if (sp === 1) {
                switch_row = 4;
            } else
            if (sp === 2) {
                switch_row = 0;
            }
        } else {
            // all eff is selected (all B)
            if (sp === 1) {
                switch_row = 0;
            } else if (sp === 2) {
                switch_row = 4;
            }
        }
        return switch_row;
    }

    function checkSwitchpoint() {
        let sp;
        let row;
        let switch_row;
        let switch_dec;

        // when the selected decision is in round 1
        if (dec_mpl_implement <= 5) {
            round_implement = 1;
            sp = parseInt("${e://Field/switchpoint_main_r1}");
            row = parseInt("${e://Field/switch_row_main_r1}");
            switch_row = findSwitchRow(sp, row);
            switch_dec = switch_row + 1;
        } else if (dec_mpl_implement <= 10) {
            round_implement = 2;
            sp = parseInt("${e://Field/switchpoint_main_r2}");
            row = parseInt("${e://Field/switch_row_main_r2}");
            switch_row = findSwitchRow(sp, row);
            switch_dec = switch_row + 6;
        } else {
            round_implement = 3;
            sp = parseInt("${e://Field/switchpoint_main_r3}");
            row = parseInt("${e://Field/switch_row_main_r3}");
            switch_row = findSwitchRow(sp, row);
            switch_dec = switch_row + 11;
        }
        switch_row_main = switch_row;
        main_sp = sp;
    return switch_dec === dec_mpl_implement;
    }

    function findDecSelected(dec_mpl_implement) {
        let dec_selected;
        if (dec_mpl_implement <= 5) {
            dec_selected = dec_mpl_implement - 1;
        } else if (dec_mpl_implement <= 10) {
            dec_selected = dec_mpl_implement - 6;
        } else {
            dec_selected = dec_mpl_implement - 11;
        }
        return dec_selected;
    }

    /**
     *
     * @param sp
     * @param switch_row
     * @param dec_selected
     */
    function backtraceSelection(sp, switch_row, dec_selected) {
        let choice_a;
        let choice_b;

        if (iseffLeft()) {
            choice_a = "smart";
            choice_b = "traditional";
        } else {
            choice_a = "traditional";
            choice_b = "smart";
        }

        if (sp === 1) {
            choice_implement = "smart";
            other_implement = "traditional";
        } else if (sp === 2) {
            choice_implement = "traditional";
            other_implement = "smart";
        } else {
            if (dec_selected <= switch_row)  {
                choice_implement = choice_a;
                other_implement = choice_b;
            } else {
                choice_implement = choice_b;
                other_implement = choice_a;
            }
        }
        console.log("choice_implement is ", choice_implement);
        Qualtrics.SurveyEngine.setEmbeddedData("choice_implement", choice_implement);
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
        let assignment = parseInt("${e://Field/condition_no}");
        let reduc_rate = parseFloat("${e://Field/reduc_rate}");
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
        if (assignment === 7) {
            res["incr_e"] = res["incr_e"]/reduc_rate;
        }
        return res;
    }

    function findBounds() {
        let res = {
            "bound_e": null,
            "bound_t": null
        }
        let bound_e;
        let bound_t;
        if (round_implement === 1) {
            if (isSpSelected) {
                bound_e = parseFloat("${e://Field/lower_bound_eff_r1}");
                bound_t = parseFloat("${e://Field/lower_bound_trad_r1}");
            } else {
                bound_e = parseInt("${e://Field/lower_bound_eff_main_r1}");
                bound_t = parseInt("${e://Field/lower_bound_trad_main_r1}");
            }
        } else if (round_implement === 2) {
            if (isSpSelected) {
                bound_e = parseFloat("${e://Field/lower_bound_eff_r2}");
                bound_t = parseFloat("${e://Field/lower_bound_trad_r2}");
            } else {
                bound_e = parseInt("${e://Field/lower_bound_eff_main_r2}");
                bound_t = parseInt("${e://Field/lower_bound_trad_main_r2}");
            }
        } else {
            if (isSpSelected) {
                bound_e = parseFloat("${e://Field/lower_bound_eff_r3}");
                bound_t = parseFloat("${e://Field/lower_bound_trad_r3}");
            } else {
                bound_e = parseInt("${e://Field/lower_bound_eff_main_r3}");
                bound_t = parseInt("${e://Field/lower_bound_trad_main_r3}");
            }
        }
        res["bound_e"] = bound_e;
        res["bound_t"] = bound_t;
        return res;
    }

    function getFollowImplement() {
        let sp;
        let switch_row;
        let row;
        let res = {
            "fmpl_sp": null,
            "dec_selected": null,
            "switch_row": null
        }
        let dec_fmpl_implement_step1 = parseInt("${e://Field/dec_fmpl_implement_step1}");
        res["dec_selected"] = dec_fmpl_implement_step1 - 1;

        if (round_implement === 1) {
            sp = parseInt("${e://Field/switchpoint_fmpl_r1}");
            row = parseInt("${e://Field/switch_row_fmpl_r1}");
        } else if (round_implement === 2) {
            sp = parseInt("${e://Field/switchpoint_fmpl_r2}");
            row = parseInt("${e://Field/switch_row_fmpl_r2}");
        } else {
            sp = parseInt("${e://Field/switchpoint_fmpl_r3}");
            row = parseInt("${e://Field/switch_row_fmpl_r3}");
        }
        res["fmpl_sp"] = sp;
        switch_row = findSwitchRow(sp, row);
        res["switch_row"] = switch_row;
        return res;
    }

    function backtracePrice(dec_selected, switch_row) {
        let price_implement;
        let price_implement_other;
        let bound_implement;
        let increment_implement;
        let bound_other;
        let increment_other;
        let eff_incr;
        let trad_incr;

        let eff_bound = findBounds()["bound_e"];
        let trad_bound = findBounds()["bound_t"];

        if (isSpSelected) {
            eff_incr = findIncr(main_sp)["incr_e"];
            trad_incr = findIncr(main_sp)["incr_t"];
        } else {
            let incr_a = parseInt("${e://Field/mpl_eff_incr}");
            let incr_b = parseInt("${e://Field/mpl_trad_incr}");
            if (iseffLeft()) {
                eff_incr = incr_a;
                trad_incr = incr_b;
            } else {
                eff_incr = incr_b;
                trad_incr = incr_a;
            }
        }

        if (choice_implement === "smart") {
            bound_implement = eff_bound;
            bound_other = trad_bound;
            increment_implement = eff_incr;
            increment_other = trad_incr;
        } else {
            bound_implement = trad_bound;
            bound_other = eff_bound;
            increment_implement = trad_incr;
            increment_other = eff_incr;
        }

        if (dec_selected <= switch_row) {
            price_implement = bound_implement - (switch_row - dec_selected) * increment_implement;
            price_implement_other = bound_other - (switch_row - dec_selected) * increment_other;
        } else {
            price_implement = bound_implement + (dec_selected - switch_row) * increment_implement;
            price_implement_other = bound_other + (dec_selected - switch_row) * increment_other;
        }

        console.log("price_implement is ", price_implement);
        console.log("price_implement_other is ", price_implement_other);
    }

    function getPureNum(str) {
        return str.substr(str.indexOf("$") + 1);
    }


});

Qualtrics.SurveyEngine.addOnUnload(function()
{
    /*Place your JavaScript here to run when the page is unloaded*/

});