Qualtrics.SurveyEngine.addOnload(function()
{
    /*Place your JavaScript here to run when the page loads*/

});

Qualtrics.SurveyEngine.addOnReady(function()
{
    /*Place your JavaScript here to run when the page is fully displayed*/
    const dec_mpl_implement = parseInt("${e://Field/dec_mpl_implement}");
    console.log("dec_mpl_implemented is ", dec_mpl_implement);
    let isSpSelected = checkSwitchpoint();
    if (isSpSelected) {
        console.log("switchpoint has been selected!");
    } else {
        console.log("switchpoint has not been selected!");
    }

    function iseffLeft() {
        let num = parseInt("${e://Field/display_order}");
        return num === 0;
    }

    function checkSwitchpoint() {
        let sp;
        let row;
        let switch_row;
        let switch_dec;

        function findSwitchRow() {
            if (sp === 3) {
                switch_row = row;
                return;
            }
            // eff is A, trad is B
            if (iseffLeft()) {
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
        }

        // when the selected decision is in round 1
        if (dec_mpl_implement <= 5) {
            sp = parseInt("${e://Field/switchpoint_main_r1}");
            row = parseInt("${e://Field/switch_row_main_r1}");
            findSwitchRow(row);
            switch_dec = switch_row + 1;
        } else if (dec_mpl_implement <= 10) {
            sp = parseInt("${e://Field/switchpoint_main_r2}");
            row = parseInt("${e://Field/switch_row_main_r2}");
            findSwitchRow(row);
            switch_dec = switch_row + 6;
        } else {
            sp = parseInt("${e://Field/switchpoint_main_r3}");
            row = parseInt("${e://Field/switch_row_main_r3}");
            findSwitchRow(row);
            switch_dec = switch_row + 11;
        }
    return switch_dec === dec_mpl_implement;
    }




});

Qualtrics.SurveyEngine.addOnUnload(function()
{
    /*Place your JavaScript here to run when the page is unloaded*/

});