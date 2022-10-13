// for r3_mpl_full
Qualtrics.SurveyEngine.addOnload(function()
{
    /*Place your JavaScript here to run when the page loads*/


});

Qualtrics.SurveyEngine.addOnReady(function()
{
    /*Place your JavaScript here to run when the page is fully displayed*/
    console.log("testing r3_mpl_full");
    const qid = this.questionId;
    const question = document.getElementById(qid);
    const dec_num = parseInt("${e://Field/lower_bound_main_decno_r3}");
    console.log("The main sp dec_num is ", dec_num);

    editLabels(qid);
    prepopulate();

    function addHeader(QID) {
        let a_header = "${e://Field/header_a}";
        let b_header = "${e://Field/header_b}";
        let a_img = "${e://Field/image_a}";
        let b_img = "${e://Field/image_b}";
        let label_a = "<u>Choice A</u>:<br /><strong>" + a_header + "</strong><br /><img alt='option_a' height=\"80\" src=\"" + a_img + "\"/><br /> <br />";
        let label_b = "<u>Choice B</u>:<br /><strong>" + b_header + "</strong><br /><img alt='option_b' height=\"80\" src=\"" + b_img + "\"/><br /> <br />";
        let row_html = "<thead> <th scope=\"row\" class=\"c1\" tabindex=\"-1\" role=\"rowheader\">  <span class=\"LabelWrapper \">  <label>  <span></span> </label>   </span>  </th>  <td class=\"c2 BorderColor\"></td> <td class=\"c3 BorderColor\"></td>     <th class=\"c4   \">    <label style=\"display: block; padding-top: 0px; padding-bottom: 0px;\" >" + label_a +"</label>  <label aria-hidden=\"true\" ></label> </th>   <th class=\"c5 last  \">    <label style=\"display: block; padding-top: 0px; padding-bottom: 0px;\" >" + label_b + "</label> <label aria-hidden=\"true\"></label> </th>  </thead>";
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
        let inita = parseInt("${e://Field/mpl_eff_init}");
        let initb = parseInt("${e://Field/mpl_trad_init}");
        let incra = parseFloat("${e://Field/fmpl_eff_incr_swi}");
        let incrb = -parseFloat("${e://Field/fmpl_eff_incr_swi}");
        const rows = question.getElementsByClassName("ChoiceRow");
        for (let i = 0; i < rows.length; i++) {
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
        let wtp_upper = toNumber("${e://Field/upper_bound_wtp_r3}");
        let wtp_lower = toNumber("${e://Field/lower_bound_wtp_r3}");
        let main_sp = (("${e://Field/switchpoint_main_r3}") ) ? parseInt("${e://Field/switchpoint_main_r3}") : parseInt("${e://Field/switchpoint_main_r3_yes}");

        console.log("main_sp is ", main_sp);

        let row_num = -1;
        const rows = question.getElementsByClassName("ChoiceRow");
        let len = rows.length;
        let lower_bound;
        let upper_bound;
        let eff_lower;
        let eff_upper;
        let trad_lower;
        let trad_upper;

        if (main_sp === 3) {
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
                if (iseffLeft()) {
                    eff_lower = num_a_lower;
                    eff_upper = num_a_upper;
                    trad_lower = num_b_lower;
                    trad_upper = num_b_upper;
                } else {
                    eff_lower = num_b_lower;
                    eff_upper = num_b_upper;
                    trad_lower = num_a_lower;
                    trad_upper = num_a_upper;
                }
                lower_bound = Math.min((eff_lower - trad_lower), (eff_upper - trad_upper));
                upper_bound = Math.max((eff_lower - trad_lower), (eff_upper - trad_upper));
                if (wtp_upper <= upper_bound && wtp_lower >= lower_bound) {
                    row_num = i;
                    break;
                }
            }
        }

        if ((iseffLeft() && main_sp === 1) || (!iseffLeft() && main_sp === 2) ) {
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

    function iseffLeft() {
        let num = parseInt("${e://Field/display_order}");
        return num === 0;
    }

    this.hidePreviousButton();
});

Qualtrics.SurveyEngine.addOnUnload(function()
{

});