// certainty questions
Qualtrics.SurveyEngine.addOnload(function()
{
    /*Place your JavaScript here to run when the page loads*/

});

Qualtrics.SurveyEngine.addOnReady(function()
{
    /*Place your JavaScript here to run when the page is fully displayed*/
    //console.log("ready?");
    const switchpoint = parseInt("${e://Field/switchpoint_fmpl_r3}");
    //console.log("your sp is ", switchpoint);
    const questions = document.getElementById("Questions");
    const certaintyQs = questions.getElementsByClassName("QuestionOuter");
    let sp;
    if (switchpoint === 3) {
        certaintyQs[0].style.display = "block";
        certaintyQs[1].style.display = "block";
        certaintyQs[2].style.display = "block";
        certaintyQs[3].style.display = "none";
        certaintyQs[4].style.display = "none";
    } else if (switchpoint===1) {
        certaintyQs[0].style.display = "block";
        certaintyQs[1].style.display = "none";
        certaintyQs[2].style.display = "none";
        certaintyQs[3].style.display = "block";
        certaintyQs[4].style.display = "none";
    } else {
        certaintyQs[0].style.display = "block";
        certaintyQs[1].style.display = "none";
        certaintyQs[2].style.display = "none";
        certaintyQs[3].style.display = "none";
        certaintyQs[4].style.display = "block";
    }
});

Qualtrics.SurveyEngine.addOnUnload(function()
{
    /*Place your JavaScript here to run when the page is unloaded*/

});