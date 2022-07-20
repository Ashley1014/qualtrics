// certainty questions
Qualtrics.SurveyEngine.addOnload(function()
{
    /*Place your JavaScript here to run when the page loads*/

});

Qualtrics.SurveyEngine.addOnReady(function()
{
    /*Place your JavaScript here to run when the page is fully displayed*/
    //console.log("ready?");
    const switchpoint = parseInt("${e://Field/switchpoint_fmpl}");
    //console.log("your sp is ", switchpoint);
    const questions = document.getElementById("Questions");
    const certaintyQs = questions.getElementsByClassName("QuestionOuter");
    let sp;
    if (switchpoint === 3) {
        sp = 0;
    } else {
        sp = switchpoint;
    }
    for (let i = 0; i < 3; i++) {
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