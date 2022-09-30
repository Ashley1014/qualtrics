// for pads_mpl_full
Qualtrics.SurveyEngine.addOnload(function()
{
    /*Place your JavaScript here to run when the page loads*/


});

Qualtrics.SurveyEngine.addOnReady(function()
{
    /*Place your JavaScript here to run when the page is fully displayed*/
    //test embedded variables
    console.log("num pads decisions is ", parseInt("${e://Field/num_pads_maindecisions}"));
    console.log("pads lg mpl incr is ", parseInt("${e://Field/pads_lg_mpl_incr}"));
    console.log("pads lg mpl init is ", parseInt("${e://Field/pads_lg_mpl_init}"));

    let condition = "${e://Field/Condition}";
    console.log("condition is ", condition);

    let price_init = parseInt("${e://Field/pads_init}");
    let price_incr = parseInt("${e://Field/pads_incr}");

    const qid = this.questionId;
    const question = document.getElementById(qid);
    //console.log(qid);
    let basenum;
    let radio1 = document.getElementsByTagName("input");
    const first_id = radio1[0].id;
    //console.log("first button id is ", first_id);
    const arr = first_id.split("~");
    basenum = Number(arr[arr.length-2]);
    editLabels(qid, price_init, price_incr);
    add_button_events();
    let len;
    let sp;
    let switch_row;
    let value;
    let pads_fmpl_incr = parseFloat("${e://Field/pads_fmpl_incr}");

    let lg_fmpl_incr;
    let sm_fmpl_incr;

    if (islgLeft()) {
        lg_fmpl_incr = pads_fmpl_incr;
        sm_fmpl_incr = -pads_fmpl_incr;
    } else {
        lg_fmpl_incr = -pads_fmpl_incr;
        sm_fmpl_incr = pads_fmpl_incr;
    }


    function addHeader(QID) {
        //let table = document.getElementsByTagName("table")[0];
        let pads_a_choice = "${e://Field/pads_header_a}";
        let pads_b_choice = "${e://Field/pads_header_b}";
        let pads_a_img = "${e://Field/image_pads_a}";
        console.log(pads_a_img);
        let pads_b_img = "${e://Field/image_pads_b}";
        console.log(pads_b_img);
        let a_caps = "<strong>" + pads_a_choice + "</strong><br /><img alt='legal' height=\"120\" src=\"" + pads_a_img + "\"/><br />";
        let b_caps = "<strong>" + pads_b_choice + "</strong><br /><img alt='small' height=\"120\" src=\"" + pads_b_img + "\"/><br />";
        let choice_a;
        let choice_b;
        choice_a = "<u>Choice A</u>:&nbsp;<br />" + a_caps;
        choice_b = "<u>Choice B</u>:&nbsp;<br />" + b_caps;
        let row_html = "<thead> <th scope=\"row\" class=\"c1\" tabindex=\"-1\" role=\"rowheader\">  <span class=\"LabelWrapper \">  <label>  <span></span> </label>   </span>  </th>  <td class=\"c2 BorderColor\"></td> <td class=\"c3 BorderColor\"></td>     <th class=\"c4   \">    <label style=\"display: block; padding-top: 0px; padding-bottom: 0px;\" >" + choice_a +"</label>  <label aria-hidden=\"true\" ></label> </th>   <th class=\"c5 last  \">    <label style=\"display: block; padding-top: 0px; padding-bottom: 0px;\" >" + choice_b + "</label> <label aria-hidden=\"true\"></label> </th>  </thead>";
        jQuery("#"+QID+" table:first").prepend(row_html);
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

    function editLabels(QID, inita, incra) {
        addHeader(QID);
        let initb;
        let incrb;
        inita = parseInt("${e://Field/pads_lg_mpl_init}");
        initb = parseInt("${e://Field/pads_sm_mpl_init}")
        incra = parseInt("${e://Field/pads_lg_mpl_incr}");
        incrb = parseInt("${e://Field/pads_sm_mpl_incr}");
        const rows = question.getElementsByClassName("ChoiceRow");
        for (let i = 0; i < rows.length; i++) {
            // const ida = QID+"-"+(i+basenum).toString()+"-1-label";
            // const idb = QID+"-"+(i+basenum).toString()+"-2-label";
            // document.getElementById(ida).innerHTML="<strong>$"+(inita+i*incra).toString()+"</strong>";
            // document.getElementById(idb).innerHTML="<strong>$"+(initb+i*incrb).toString()+"</strong>";
            const row = rows[i];
            const inputs = row.getElementsByTagName("input");
            const input_a = getInputByValue(inputs, 1);
            const input_b = getInputByValue(inputs, 2);
            const label_a = input_a.labels[0];
            const label_b = input_b.labels[0];
            label_a.innerHTML = "<strong>$"+(inita+i*incra).toString()+"</strong>";
            label_b.innerHTML = "<strong>$"+(initb+i*incrb).toString()+"</strong>";
        }
    }


    function islgLeft() {
        let num = parseInt("${e://Field/display_order_pads}");
        return num === 0;
    }


});

Qualtrics.SurveyEngine.addOnUnload(function()
{

});