Qualtrics.SurveyEngine.addOnload(function()
{
    /*Place your JavaScript here to run when the page loads*/

});

Qualtrics.SurveyEngine.addOnReady(function()
{
    /*Place your JavaScript here to run when the page is fully displayed*/
    displayWTP();
    function displayWTP() {
        const lower_bound_emissions_wtp = parseFloat("${e://Field/lower_bound_wtp_emissions}");
        const lower_bound_cost_wtp = parseFloat("${e://Field/lower_bound_wtp_cost}");
        const upper_bound_emissions_wtp = parseFloat("${e://Field/upper_bound_wtp_emissions}");
        const upper_bound_cost_wtp = parseFloat("${e://Field/upper_bound_wtp_cost}");
        console.log("lower bound eff is ", lower_bound_emissions_wtp);
        console.log("lower bound trad is ", lower_bound_cost_wtp);
        console.log("upper bound eff is ", upper_bound_emissions_wtp);
        console.log("upper bound trad is ", upper_bound_cost_wtp);
    }
});

Qualtrics.SurveyEngine.addOnUnload(function()
{
    /*Place your JavaScript here to run when the page is unloaded*/

});