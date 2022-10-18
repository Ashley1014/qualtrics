// for pads_mpl_full
Qualtrics.SurveyEngine.addOnload(function()
{
    /*Place your JavaScript here to run when the page loads*/


});

Qualtrics.SurveyEngine.addOnReady(function()
{
    /*Place your JavaScript here to run when the page is fully displayed*/
    console.log("testing pads_mpl_full");
    this.hidePreviousButton();
    this.disablePreviousButton();
    const qid = this.questionId;
    const question = document.getElementById(qid);

    editLabels(qid);
    prepopulate();
    displayWTP();


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


    function editLabels(QID) {
        addHeader(QID);
        let inita = parseInt("${e://Field/pads_lg_mpl_init}");
        let initb = parseInt("${e://Field/pads_sm_mpl_init}")
        let incra = parseFloat("${e://Field/pads_lg_fmpl_incr_swi}");
        let incrb = -parseFloat("${e://Field/pads_lg_fmpl_incr_swi}");
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

    function prepopulate() {
        let wtp_upper = toNumber("${e://Field/upper_bound_wtp_pads}");
        let wtp_lower = toNumber("${e://Field/lower_bound_wtp_pads}");
        let main_sp = parseInt("${e://Field/switchpoint_main_pads}");

        let row_num = -1;
        const rows = question.getElementsByClassName("ChoiceRow");
        let len = rows.length;
        let lower_bound;
        let upper_bound;
        let lg_lower;
        let lg_upper;
        let sm_lower;
        let sm_upper;
        for (let i = 0; i < len - 1; i++) {
            const row_lower = rows[i];
            const row_upper = rows[i+1];
            const inputs_lower = row_lower.getElementsByTagName("input");
            const inputs_upper = row_upper.getElementsByTagName("input");
            const input_a_lower = getInputByValue(inputs_lower, 1);
            const input_b_lower = getInputByValue(inputs_lower, 2);
            const input_a_upper = getInputByValue(inputs_upper, 1);
            const input_b_upper = getInputByValue(inputs_upper, 2);
            const label_a_lower = input_a_lower.labels[0].textContent;
            const label_b_lower = input_b_lower.labels[0].textContent;
            const label_a_upper = input_a_upper.labels[0].textContent;
            const label_b_upper = input_b_upper.labels[0].textContent;
            let num_a_lower = Number(label_a_lower.substring(label_a_lower.indexOf("$")+1));
            let num_b_lower = Number(label_b_lower.substring(label_b_lower.indexOf("$")+1));
            let num_a_upper = Number(label_a_upper.substring(label_a_upper.indexOf("$")+1));
            let num_b_upper = Number(label_b_upper.substring(label_b_upper.indexOf("$")+1));
            if (islgLeft()) {
                lg_lower = num_a_lower;
                lg_upper = num_a_upper;
                sm_lower = num_b_lower;
                sm_upper = num_b_upper;
            } else {
                lg_lower = num_b_lower;
                lg_upper = num_b_upper;
                sm_lower = num_a_lower;
                sm_upper = num_a_upper;
            }
            lower_bound = Math.min((lg_lower - sm_lower), (lg_upper - sm_upper));
            upper_bound = Math.max((lg_lower - sm_lower), (lg_upper - sm_upper));
            if (wtp_upper <= upper_bound && wtp_lower >= lower_bound) {
                row_num = i;
                break;
            }
        }

        if ((islgLeft() && main_sp === 1) || (!islgLeft() && main_sp === 2) ) {
            row_num = len - 1;
        }
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const inputs = row.getElementsByTagName("input");
            const choice_a = getInputByValue(inputs, 1);
            const choice_b = getInputByValue(inputs, 2);
            if (i <= row_num) {
                choice_a.checked = true;
                choice_b.checked = false;
            } else {
                choice_a.checked = false;
                choice_b.checked = true;
            }
            choice_a.disable();
            choice_b.disable();
        }
    }

    /**
     * convert a wtp string with $ sign to a number
     * @param wtp string to be converted
     */
    function toNumber(wtp) {
        if (wtp.charAt(0) === '-'){
            return -Number(wtp.substring(wtp.indexOf("$")+1));
        } else {
            return Number(wtp.substring(wtp.indexOf("$")+1));
        }
    }

    function islgLeft() {
        let num = parseInt("${e://Field/display_order_pads}");
        return num === 0;
    }

    function displayWTP() {
        const lower_bound_lg = parseInt("${e://Field/lower_bound_lg}");
        const lower_bound_sm = parseInt("${e://Field/lower_bound_sm}");
        const upper_bound_lg = parseInt("${e://Field/upper_bound_lg}");
        const upper_bound_sm = parseInt("${e://Field/upper_bound_sm}");
        const lower_bound_wtp = parseInt("${e://Field/lower_bound_wtp_pads_num}");
        const upper_bound_wtp = parseInt("${e://Field/upper_bound_wtp_pads_num}");
        console.log("lower bound lg is ", lower_bound_lg);
        console.log("lower bound sm is ", lower_bound_sm);
        console.log("upper bound lg is ", upper_bound_lg);
        console.log("upper bound sm is ", upper_bound_sm);
        console.log("upper bound wtp is ", upper_bound_wtp);
        console.log("lower bound wtp is ", lower_bound_wtp);
    }

});

Qualtrics.SurveyEngine.addOnUnload(function()
{

});