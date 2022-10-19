Qualtrics.SurveyEngine.addOnload(function()
{
    /*Place your JavaScript here to run when the page loads*/

});

Qualtrics.SurveyEngine.addOnReady(function()
{
    /*Place your JavaScript here to run when the page is fully displayed*/
    displayWTP();
    function displayWTP() {
        const lower_bound_eff = parseFloat("${e://Field/lower_bound_eff_r2}");
        const lower_bound_trad = parseFloat("${e://Field/lower_bound_trad_r2}");
        const upper_bound_eff = parseFloat("${e://Field/upper_bound_eff_r2}");
        const upper_bound_trad = parseFloat("${e://Field/upper_bound_trad_r2}");
        const lower_bound_wtp = parseFloat("${e://Field/lower_bound_wtp_r2_num}");
        const upper_bound_wtp = parseFloat("${e://Field/upper_bound_wtp_r2_num}");
        console.log("lower bound eff is ", lower_bound_eff);
        console.log("lower bound trad is ", lower_bound_trad);
        console.log("upper bound eff is ", upper_bound_eff);
        console.log("upper bound trad is ", upper_bound_trad);
        console.log("upper bound wtp is ", upper_bound_wtp);
        console.log("lower bound wtp is ", lower_bound_wtp);
    }
});

Qualtrics.SurveyEngine.addOnUnload(function()
{
    /*Place your JavaScript here to run when the page is unloaded*/

});