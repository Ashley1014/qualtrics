// certainty questions
Qualtrics.SurveyEngine.addOnload(function()
{
    /*Place your JavaScript here to run when the page loads*/

});

Qualtrics.SurveyEngine.addOnReady(function()
{
    console.log("testing r1_certainty_switch");
    /*Place your JavaScript here to run when the page is fully displayed*/
    //console.log("ready?");
    const switchpoint = parseInt("${e://Field/switchpoint_fmpl_r3}");
    //console.log("your sp is ", switchpoint);
    const questions = document.getElementById("Questions");
    const certaintyQs = questions.getElementsByClassName("QuestionOuter");
    let sp;
    if (switchpoint === 3) {
        sp = 1;
    } else {
        sp = switchpoint + 1;
    }
    for (let i = 0; i <= 3; i++) {
        //let disp = certaintyQs[i].style.display;
        if (i === sp) {
            certaintyQs[i].style.display = "block";
        } else {
            certaintyQs[i].style.display = "none";
        }
    }

});

Qualtrics.SurveyEngine.addOnUnload(function()
{
    /*Place your JavaScript here to run when the page is unloaded*/

});