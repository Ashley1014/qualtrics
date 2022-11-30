// for r3_mpl_full
Qualtrics.SurveyEngine.addOnload(function()
{
    /*Place your JavaScript here to run when the page loads*/


});

Qualtrics.SurveyEngine.addOnReady(function()
{


    /*ANJALI HAS INSERTED THIS HERE*/
    /*ANJALI HAS INSERTED THIS HERE*/
    // this.hidePreviousButton();
    // this.disablePreviousButton()
    /*ANJALI HAS INSERTED THIS HERE*/
    /*ANJALI HAS INSERTED THIS HERE*/


    /*Place your JavaScript here to run when the page is fully displayed*/
    console.log("testing r3_mpl_full");
    const qid = this.questionId;
    const question = document.getElementById(qid);
    const dec_num = parseInt("${e://Field/lower_bound_main_decno_r3}");
    console.log("The main sp dec_num is ", dec_num);

    editLabels(qid);
    prepopulate();
    displayWTP();

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
        let init_eff;
        let incr_eff;
        let init_trad;
        let incr_trad;
        let inita = parseInt("${e://Field/mpl_eff_init}");
        let initb = parseInt("${e://Field/mpl_trad_init}");
        let incra = parseFloat("${e://Field/fmpl_eff_incr_swi}");
        let incrb = -parseFloat("${e://Field/fmpl_eff_incr_swi}");
        if (iseffLeft()) {
            init_eff = inita;
            incr_eff = incra;
            init_trad = initb;
            incr_trad = incrb;
        } else {
            init_eff = initb;
            incr_eff = incrb;
            init_trad = inita;
            incr_trad = incra;
        }
        let assignment = parseInt("${e://Field/condition_no}");
        if (assignment === 5 || assignment === 6) {
            let disc_rate = parseFloat("${e://Field/disc_rate}");
            displayLabels_v2(init_eff, incr_eff, init_trad, incr_trad, disc_rate);
        } else {
            displayLabels_v1(init_eff, incr_eff, init_trad, incr_trad);
        }
    }

    function displayLabels_v1(init_eff, incr_eff, init_trad, incr_trad) {
        const rows = question.getElementsByClassName("ChoiceRow");
        for (let i = 0; i < rows.length; i++) {
            let choice_a = (init_eff + i * incr_eff).toFixed(2).replace(/\.00$/, '');
            let choice_b = (init_trad + i * incr_trad).toFixed(2).replace(/\.00$/, '');
            const row = rows[i];
            const inputs = row.getElementsByTagName("input");
            const input_a = getInputByValue(inputs, 1);
            const input_b = getInputByValue(inputs, 2);
            const label_a = input_a.labels[0];
            const label_b = input_b.labels[0];
            label_a.innerHTML = "<strong>$"+(choice_a)+"</strong>";
            label_b.innerHTML = "<strong>$"+(choice_b)+"</strong>";
        }
    }

    function displayLabels_v2(init_eff, incr_eff, init_trad, incr_trad, disc_rate) {
        let eff_value = (iseffLeft()) ? 1 : 2;
        const rows = question.getElementsByClassName("ChoiceRow");
        //console.log(num);
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const inputs = row.getElementsByTagName("input");
            const input_eff = getInputByValue(inputs, eff_value);
            const input_trad = getInputByValue(inputs, 3-eff_value);
            const label_eff = input_eff.labels[0];
            const label_trad = input_trad.labels[0];

            const eff_disc = (init_eff + i * incr_eff).toFixed(2).replace(/\.00$/, '');
            const eff_original = (eff_disc / disc_rate).toFixed(2).replace(/\.00$/, '');
            let trad = (init_trad + i * incr_trad).toFixed(2).replace(/\.00$/, '');

            label_eff.innerHTML = "<strong><s>$"+eff_original+"</s><span style=\"color:red\"> $" + eff_disc +"</span></strong>";
            label_trad.innerHTML = "<strong>$"+trad+"</strong>";
        }
    }

    function prepopulate() {
        const rows = question.getElementsByClassName("ChoiceRow");
        let len = rows.length;
        let main_dec_num = parseInt("${e://Field/lower_bound_main_decno_r3}");
        console.log("prepopulated main_dec_num is ", main_dec_num);
        let row_num;
        if (main_dec_num === (parseInt("${e://Field/num_totaldecisions_1r}") + 1)) {
            // all a selected
            row_num = len - 1;
        } else if (main_dec_num === 0) {
            // all b selected
            row_num = -1;
        } else {
            row_num = parseInt("${e://Field/lower_bound_fmpl_decno_r3}") - 1;
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

    function displayWTP() {
        const dec_num_main = parseInt("${e://Field/lower_bound_main_decno_r3}");
        console.log("The main sp dec_num is ", dec_num_main);
        const dec_num_fmpl = parseInt("${e://Field/lower_bound_fmpl_decno_r3}");
        console.log("The fmpl sp dec_num is ", dec_num_fmpl);
        const lower_bound_eff = parseFloat("${e://Field/lower_bound_eff_r3}");
        const lower_bound_trad = parseFloat("${e://Field/lower_bound_trad_r3}");
        const upper_bound_eff = parseFloat("${e://Field/upper_bound_eff_r3}");
        const upper_bound_trad = parseFloat("${e://Field/upper_bound_trad_r3}");
        const lower_bound_wtp = parseFloat("${e://Field/lower_bound_wtp_r3_num}");
        const upper_bound_wtp = parseFloat("${e://Field/upper_bound_wtp_r3_num}");
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

});
