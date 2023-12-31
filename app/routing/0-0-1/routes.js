module.exports = function(router) {

  //------- Code goes below here -------

  
 var version = '0-0-1'; // Set Prototype version

 // test function to calculate
  function addNumbers(a, b) {
    return a + b;
  } 

  // Calculate taxable income
  function calculateTaxableIncome(a, b, c) {
    return a - b - c;
  }

  // Calculate takehome
  function calculateTakehome(a, b, c, d, e, x) {
    return (a - b - c - d - e) + x ;
  }


  // Page routing
  router.post('/' + version + '/1', function(request, response) {

      response.redirect('/' + version + '/gross-income')

  })
  router.post('/' + version + '/gross-income', function(request, response) {


    if (request.session.data['gross-income-frequency'] == "a day"){ 
      // Need to work out time before anything else
      response.redirect('/' + version + '/number-days')

    } else if (request.session.data['gross-income-frequency'] == "an hour"){
      // Need to work out time before anything else
      response.redirect('/' + version + '/number-hours')

    } else { 
      // We can work out the time so move on to calculating the yearly amount
      // and checking to see if you can return to Check Answers or Next page
      
      // Calculate a yearly salary for everything other than Daily and hourly
      var yearlySalary = request.session.data['yearlySalary'];

      if (request.session.data['gross-income-frequency'] == "a month"){ 
        yearlySalary = request.session.data['gross-income-amount'] * 12
        request.session.data['yearlySalary'] = yearlySalary;
      } else if (request.session.data['gross-income-frequency'] == "every 4 weeks"){
        yearlySalary = request.session.data['gross-income-amount'] * 13
        request.session.data['yearlySalary'] = yearlySalary;
      } else if (request.session.data['gross-income-frequency'] == "a week") {
        yearlySalary = request.session.data['gross-income-amount'] * 52
        request.session.data['yearlySalary'] = yearlySalary;
      } else { // Set to yearly.
        yearlySalary = request.session.data['gross-income-amount']
        request.session.data['yearlySalary'] = yearlySalary;
      }

      //Now check if we are going back to check answers or the next page
      var checkMode = request.session.data['checkMode'];
      if (checkMode) {

        // if pension contributions are a percentage
        // recalculate amount if gross amount changed
        if (request.session.data['pension-contributions'] == "percentage") {
          yearlyPensionContributions = (request.session.data['pension-contributions-percentage'] / 100) * request.session.data['yearlySalary']
          request.session.data['yearlyPensionContributions'] = yearlyPensionContributions;
        }

        // recalculate student loan if gross changed
        var yearlyStudentLoan = request.session.data['yearlyStudentLoan'];
        var yearlySalary = request.session.data['yearlySalary'];


        if (request.session.data['student-loans'] == "None"){ 
          yearlyStudentLoan = 0 // no student loan so set to 0 incase it had been changed 
        } else if (request.session.data['student-loans'] == "Plan 1"){
          yearlyStudentLoan =(yearlySalary - 22015) * 0.09 //9% rate and £22,015 threshold
        } else if (request.session.data['student-loans'] == "Plan 2"){
          yearlyStudentLoan =(yearlySalary - 27295) * 0.09 //9% rate and £27,295 threshold
        } else if (request.session.data['student-loans'] == "Plan 4"){
          yearlyStudentLoan =(yearlySalary - 27660) * 0.09 //9% rate and £27,660 threshold
        } else if (request.session.data['student-loans'] == "Plan 5"){
          yearlyStudentLoan =(yearlySalary - 25000) * 0.09 //9% rate and £25,000 threshold
        } else if (request.session.data['student-loans'] == "Postgraduate Loan"){
          yearlyStudentLoan =(yearlySalary - 21000) * 0.06 //6% rate and £21,000 threshold
        } else { 
          yearlyStudentLoan =(yearlySalary - 22015) * 0.09 //they picked multiple so just work it out like Plan 1
        }

        if (yearlyStudentLoan < 0) {
          yearlyStudentLoan = 0;
        }

        request.session.data['yearlyStudentLoan'] = yearlyStudentLoan;
        response.redirect('/' + version + '/check-answers')

      } else {
        response.redirect('/' + version + '/income-type')
      }


    }


    /*
if the anwser is hourly or weekly go to the time page regardless of if checkmode is on.
if the anwser is NOT these look for checkmode and determine if go to end or income type and calculate amount
    */

/*
    else if (request.session.data['gross-income-frequency'] == "a day") {
      yearlySalary = (request.session.data['gross-income-amount'] * 5) * 52
      request.session.data['yearlySalary'] = yearlySalary;
    } else if (request.session.data['gross-income-frequency'] == "an hour") {
      yearlySalary = (request.session.data['gross-income-amount'] * 37.5) * 52
      request.session.data['yearlySalary'] = yearlySalary;
    }
*/

       
  })

  router.post('/' + version + '/number-days', function(request, response) {

    // Calculate a yearly salary
    var yearlySalary = request.session.data['yearlySalary'];
    yearlySalary = (request.session.data['gross-income-amount'] * request.session.data['number-days']) * 52
    request.session.data['yearlySalary'] = yearlySalary;
    console.log(yearlySalary);

    //Now check if we are going back to check answers or the next page
    var checkMode = request.session.data['checkMode'];
    if (checkMode) {

      // if pension contributions are a percentage
      // recalculate amount if gross amount changed
      if (request.session.data['pension-contributions'] == "percentage") {
        yearlyPensionContributions = (request.session.data['pension-contributions-percentage'] / 100) * request.session.data['yearlySalary']
        request.session.data['yearlyPensionContributions'] = yearlyPensionContributions;
      }

      // recalculate student loan if gross changed
      var yearlyStudentLoan = request.session.data['yearlyStudentLoan'];
      var yearlySalary = request.session.data['yearlySalary'];


      if (request.session.data['student-loans'] == "None"){ 
        yearlyStudentLoan = 0 // no student loan so set to 0 incase it had been changed 
      } else if (request.session.data['student-loans'] == "Plan 1"){
        yearlyStudentLoan =(yearlySalary - 22015) * 0.09 //9% rate and £22,015 threshold
      } else if (request.session.data['student-loans'] == "Plan 2"){
        yearlyStudentLoan =(yearlySalary - 27295) * 0.09 //9% rate and £27,295 threshold
      } else if (request.session.data['student-loans'] == "Plan 4"){
        yearlyStudentLoan =(yearlySalary - 27660) * 0.09 //9% rate and £27,660 threshold
      } else if (request.session.data['student-loans'] == "Plan 5"){
        yearlyStudentLoan =(yearlySalary - 25000) * 0.09 //9% rate and £25,000 threshold
      } else if (request.session.data['student-loans'] == "Postgraduate Loan"){
        yearlyStudentLoan =(yearlySalary - 21000) * 0.06 //6% rate and £21,000 threshold
      } else { 
        yearlyStudentLoan =(yearlySalary - 22015) * 0.09 //they picked multiple so just work it out like Plan 1
      }

      if (yearlyStudentLoan < 0) {
        yearlyStudentLoan = 0;
      }

      request.session.data['yearlyStudentLoan'] = yearlyStudentLoan;
      response.redirect('/' + version + '/check-answers')
      
    } else {
      response.redirect('/' + version + '/income-type')
    }

    
  })

  router.post('/' + version + '/number-hours', function(request, response) {

    // Calculate a yearly salary
    var yearlySalary = request.session.data['yearlySalary'];
    yearlySalary = (request.session.data['gross-income-amount'] * request.session.data['number-hours']) * 52
    request.session.data['yearlySalary'] = yearlySalary;
    console.log(yearlySalary);

    //Now check if we are going back to check answers or the next page
    var checkMode = request.session.data['checkMode'];
    if (checkMode) {

      // if pension contributions are a percentage
      // recalculate amount if gross amount changed
      if (request.session.data['pension-contributions'] == "percentage") {
        yearlyPensionContributions = (request.session.data['pension-contributions-percentage'] / 100) * request.session.data['yearlySalary']
        request.session.data['yearlyPensionContributions'] = yearlyPensionContributions;
      }

      // recalculate student loan if gross changed
      var yearlyStudentLoan = request.session.data['yearlyStudentLoan'];
      var yearlySalary = request.session.data['yearlySalary'];


      if (request.session.data['student-loans'] == "None"){ 
        yearlyStudentLoan = 0 // no student loan so set to 0 incase it had been changed 
      } else if (request.session.data['student-loans'] == "Plan 1"){
        yearlyStudentLoan =(yearlySalary - 22015) * 0.09 //9% rate and £22,015 threshold
      } else if (request.session.data['student-loans'] == "Plan 2"){
        yearlyStudentLoan =(yearlySalary - 27295) * 0.09 //9% rate and £27,295 threshold
      } else if (request.session.data['student-loans'] == "Plan 4"){
        yearlyStudentLoan =(yearlySalary - 27660) * 0.09 //9% rate and £27,660 threshold
      } else if (request.session.data['student-loans'] == "Plan 5"){
        yearlyStudentLoan =(yearlySalary - 25000) * 0.09 //9% rate and £25,000 threshold
      } else if (request.session.data['student-loans'] == "Postgraduate Loan"){
        yearlyStudentLoan =(yearlySalary - 21000) * 0.06 //6% rate and £21,000 threshold
      } else { 
        yearlyStudentLoan =(yearlySalary - 22015) * 0.09 //they picked multiple so just work it out like Plan 1
      }

      if (yearlyStudentLoan < 0) {
        yearlyStudentLoan = 0;
      }

      request.session.data['yearlyStudentLoan'] = yearlyStudentLoan;
      response.redirect('/' + version + '/check-answers')
      
    } else {
      response.redirect('/' + version + '/income-type')
    }

    
  })




  router.post('/' + version + '/income-type', function(request, response) {

    var checkMode = request.session.data['checkMode'];

    if (request.session.data['income-type'] == "private pension"){ //if income type is private pension skip state pension age

      if (checkMode) {
        response.redirect('/' + version + '/check-answers')
      } else {
        response.redirect('/' + version + '/registered-blind')
      }

    } else { // it's job income, check age
      response.redirect('/' + version + '/state-pension-age')
    }
  })
  router.post('/' + version + '/state-pension-age', function(request, response) {

    var checkMode = request.session.data['checkMode'];

    if (request.session.data['income-type'] == "private pension"){ //if income type is private pension skip pension contributions

      if (checkMode) {
        response.redirect('/' + version + '/check-answers')
      } else {
        response.redirect('/' + version + '/registered-blind')
      }

    } else { // it's job income, check pension contributions
      response.redirect('/' + version + '/pension-contributions')
    }
  })
  router.post('/' + version + '/pension-contributions', function(request, response) {

    // Calculate a yearly pension contributions
    var yearlyPensionContributions = request.session.data['yearlyPensionContributions'];

    if (request.session.data['pension-contributions'] == "fixed"){ 
      yearlyPensionContributions = request.session.data['pension-contributions-amount'] * 12
      request.session.data['yearlyPensionContributions'] = yearlyPensionContributions;
    } else if (request.session.data['pension-contributions'] == "percentage") {
      yearlyPensionContributions = (request.session.data['pension-contributions-percentage'] / 100) * request.session.data['yearlySalary']
      request.session.data['yearlyPensionContributions'] = yearlyPensionContributions;
    } else { // no pension contributions so set to 0 incase it had been changed
      yearlyPensionContributions = 0
    }

    request.session.data['yearlyPensionContributions'] = yearlyPensionContributions;

    var checkMode = request.session.data['checkMode'];
    if (checkMode) {
      response.redirect('/' + version + '/check-answers')
    } else {
      response.redirect('/' + version + '/registered-blind')
    }
    
  })


  router.post('/' + version + '/registered-blind', function(request, response) {

    var checkMode = request.session.data['checkMode'];
    if (checkMode) {
      response.redirect('/' + version + '/check-answers')
    } else {
      response.redirect('/' + version + '/student-loans')
    }
    
  })
  router.post('/' + version + '/student-loans', function(request, response) {

    // Calculate student loan repayment
    var yearlyStudentLoan = request.session.data['yearlyStudentLoan'];
    var yearlySalary = request.session.data['yearlySalary'];


    if (request.session.data['student-loans'] == "None"){ 
      yearlyStudentLoan = 0 // no student loan so set to 0 incase it had been changed 
    } else if (request.session.data['student-loans'] == "Plan 1"){
      yearlyStudentLoan =(yearlySalary - 22015) * 0.09 //9% rate and £22,015 threshold
    } else if (request.session.data['student-loans'] == "Plan 2"){
      yearlyStudentLoan =(yearlySalary - 27295) * 0.09 //9% rate and £27,295 threshold
    } else if (request.session.data['student-loans'] == "Plan 4"){
      yearlyStudentLoan =(yearlySalary - 27660) * 0.09 //9% rate and £27,660 threshold
    } else if (request.session.data['student-loans'] == "Plan 5"){
      yearlyStudentLoan =(yearlySalary - 25000) * 0.09 //9% rate and £25,000 threshold
    } else if (request.session.data['student-loans'] == "Postgraduate Loan"){
      yearlyStudentLoan =(yearlySalary - 21000) * 0.06 //6% rate and £21,000 threshold
    } else { 
      yearlyStudentLoan =(yearlySalary - 22015) * 0.09 //they picked multiple so just work it out like Plan 1
    }

    if (yearlyStudentLoan < 0) {
      yearlyStudentLoan = 0;
    }
    request.session.data['yearlyStudentLoan'] = yearlyStudentLoan;


    var checkMode = request.session.data['checkMode'];
    if (checkMode) {
      response.redirect('/' + version + '/check-answers')
    } else {
      response.redirect('/' + version + '/other-allowances')
    }
    
  })
  router.post('/' + version + '/other-allowances', function(request, response) {

    // reset tax free allowance
    request.session.data['taxFreeAmount'] = 12570;
    console.log(request.session.data['other-allowances']);

    if (request.session.data['other-allowances'] == undefined) {

      // user didn't select anything so set it all as 0
      
      // No allowances or deductions
      var otherAllowancesTotal = request.session.data['otherAllowancesTotal'];
      otherAllowancesTotal = 0;
      var otherDeductionsTotal = request.session.data['otherDeductionsTotal'];
      otherDeductionsTotal = 0;


      request.session.data['otherAllowancesTotal'] = otherAllowancesTotal;
      request.session.data['otherDeductionsTotal'] = otherDeductionsTotal;

      var checkMode = request.session.data['checkMode'];
      if (checkMode) {
        response.redirect('/' + version + '/check-answers')
      } else {
        response.redirect('/' + version + '/taxcode')
      }

    } else if (request.session.data['other-allowances'].includes('Allowances')){ 
      // if user selects anything other than None need to input amount, even if Checkmode is on.
      // go to specific page for that thing but if 2 are selected go to allowances first

      // go to allowances amount
      response.redirect('/' + version + '/amount-allowances')
    } else if (request.session.data['other-allowances'].includes('Deductions')) {
      // no allowances
      // go to deductions
      var otherAllowancesTotal = request.session.data['otherAllowancesTotal'];
      otherAllowancesTotal = 0;
      request.session.data['otherAllowancesTotal'] = otherAllowancesTotal;

      response.redirect('/' + version + '/amount-deductions')

    } else {
      // No allowances or deductions
      var otherAllowancesTotal = request.session.data['otherAllowancesTotal'];
      otherAllowancesTotal = 0;
      var otherDeductionsTotal = request.session.data['otherDeductionsTotal'];
      otherDeductionsTotal = 0;


      request.session.data['otherAllowancesTotal'] = otherAllowancesTotal;
      request.session.data['otherDeductionsTotal'] = otherDeductionsTotal;

      var checkMode = request.session.data['checkMode'];
      if (checkMode) {
        response.redirect('/' + version + '/check-answers')
      } else {
        response.redirect('/' + version + '/taxcode')
      }
    }

  })

  router.post('/' + version + '/amount-allowances', function(request, response) {

    // reset tax free allowance
    request.session.data['taxFreeAmount'] = 12570;

    // Calculate allowances
    var otherAllowancesTotal = request.session.data['otherAllowancesTotal'];

    if (request.session.data['allowances-frequency'] == "a month"){ 
      otherAllowancesTotal = request.session.data['allowances-amount'] * 12;
    } else { 
      otherAllowancesTotal = request.session.data['allowances-amount'];
    }

    request.session.data['otherAllowancesTotal'] = otherAllowancesTotal;


    // check if there was a deduction otherwise next screen or check answers
    if (request.session.data['other-allowances'].includes('Deductions')){ 
      // go to deductions amount
      response.redirect('/' + version + '/amount-deductions')
    } else {

      // No deductions
      var otherDeductionsTotal = request.session.data['otherDeductionsTotal'];
      otherDeductionsTotal = 0;
      request.session.data['otherDeductionsTotal'] = otherDeductionsTotal;

      var checkMode = request.session.data['checkMode'];
      if (checkMode) {
        response.redirect('/' + version + '/check-answers')
      } else {
        response.redirect('/' + version + '/taxcode')
      }
    }

  })

  router.post('/' + version + '/amount-deductions', function(request, response) {

    // reset tax free allowance
    request.session.data['taxFreeAmount'] = 12570;

    // Calculate deductions
    var otherDeductionsTotal = request.session.data['otherDeductionsTotal'];

    if (request.session.data['deductions-frequency'] == "a month"){ 
      otherDeductionsTotal = request.session.data['deductions-amount'] * 12;
    } else { 
      otherDeductionsTotal = request.session.data['deductions-amount'];
    }

    request.session.data['otherDeductionsTotal'] = otherDeductionsTotal;

    var checkMode = request.session.data['checkMode'];
    if (checkMode) {
      response.redirect('/' + version + '/check-answers')
    } else {
      response.redirect('/' + version + '/taxcode')
    }

  })




  router.post('/' + version + '/taxcode', function(request, response) {

    if (request.session.data['tax-code'] == ""){ //if the tax code is empty show scottish

      response.redirect('/' + version + '/scottish')
      
    } else { // there is a tax code skip to check answers
      request.session.data['checkMode'] = true;
      response.redirect('/' + version + '/check-answers')
    }

  })

  router.post('/' + version + '/scottish', function(request, response) {

    request.session.data['checkMode'] = true;
    response.redirect('/' + version + '/check-answers')
  })


  router.post('/' + version + '/check-answers', function(request, response) {

    // Grab some default variables stored in the session
    var taxableIncome = request.session.data['taxableIncomeTotal'];
    var yearlySalary = request.session.data['yearlySalary'];
    var taxFreeAmount = 12570;
    var threshold20 = 50270;
    var basicRateTotal = request.session.data['basicRateTotal'];
    var higherRateTotal = request.session.data['higherRateTotal'];
    var nationalInsuranceTotal = request.session.data['nationalInsuranceTotal'];
    var yearlyStudentLoan = request.session.data['yearlyStudentLoan'];
    

    // Work out tax free allowance with allowances and deductions

    taxFreeAmount = taxFreeAmount + (request.session.data['otherAllowancesTotal'] - request.session.data['otherDeductionsTotal'])
    request.session.data['taxFreeAmount'] = taxFreeAmount;
    console.log(taxFreeAmount + "tax free amount");
    console.log(request.session.data['otherAllowancesTotal'] + "allowances");
    console.log(request.session.data['otherDeductionsTotal'] + "deductions");
    console.log(request.session.data['otherAllowancesTotal'] - request.session.data['otherDeductionsTotal']);

    // Work out taxable income
    //taxableIncome = calculateTaxableIncome(yearlySalary, taxFreeAmount, request.session.data['other-allowances'], request.session.data['yearlyPensionContributions']);
    taxableIncome = calculateTaxableIncome(yearlySalary, taxFreeAmount, request.session.data['yearlyPensionContributions']);
    request.session.data['taxableIncomeTotal'] = taxableIncome;
    //console.log(taxableIncome);
    //console.log(yearlySalary);
    console.log(request.session.data['otherAllowancesTotal']);
    //console.log(request.session.data['yearlyPensionContributions']);


    // Work out tax bands if above tax free amount
    if (yearlySalary > taxFreeAmount) {
    console.log("gotta pay some tax");

            // Determine rate and NI contributions
            if (yearlySalary <= threshold20 ) { // User is only on 20%
              console.log("20 %");
              basicRateTotal = taxableIncome * 0.2;
              
              if (request.session.data['income-type'] == 'job') {
                // check age
                if (request.session.data['state-pension-age'] == 'No') {
                  // User pays NI
                  nationalInsuranceTotal = taxableIncome * 0.12;
                  console.log('Pay the NI!');
                } else {
                  // No NI because of State Pension age
                  nationalInsuranceTotal = 0;
                  console.log('pension age');
                }
              } else {
                // no NI because it is a private pension
                nationalInsuranceTotal = 0;
                console.log('private pension');
              }


              console.log(basicRateTotal);
              console.log(nationalInsuranceTotal);
              request.session.data['basicRateTotal'] = basicRateTotal;
              request.session.data['nationalInsuranceTotal'] = nationalInsuranceTotal;


            } else { // User is on 40%
              console.log("40 %");
              var basicRateTotal = (threshold20 - taxFreeAmount) * 0.2; // work out how much to do at 20%
              var higherRateTotal = (yearlySalary - threshold20) * 0.4; // do whatever is left at 40%

              if (request.session.data['income-type'] == 'job') {
                // check age
                if (request.session.data['state-pension-age'] == 'No') {
                  // User pays NI
                  var NI20 = (threshold20 - taxFreeAmount) * 0.12;
                  var NI40 = (yearlySalary - threshold20) * 0.02;
                  nationalInsuranceTotal = NI20 + NI40;
                  console.log('Pay the NI!');
                } else {
                  // No NI because of State Pension age
                  nationalInsuranceTotal = 0;
                  console.log('pension age');
                }
              } else {
                // no NI because it is a private pension
                nationalInsuranceTotal = 0;
                console.log('private pension');
              }


              console.log(basicRateTotal);
              console.log(higherRateTotal);
              console.log(nationalInsuranceTotal);
              request.session.data['basicRateTotal'] = basicRateTotal;
              request.session.data['higherRateTotal'] = higherRateTotal;
              request.session.data['nationalInsuranceTotal'] = nationalInsuranceTotal;

            }
    }



    // Work out take-home pay
    takeHomePay = calculateTakehome(taxableIncome, basicRateTotal, higherRateTotal, nationalInsuranceTotal, yearlyStudentLoan, taxFreeAmount) ;
    request.session.data['takeHomePay'] = takeHomePay;
    console.log(takeHomePay);



    // Work out monthly
    request.session.data['monthlySalary'] = request.session.data['yearlySalary'] / 12;
    request.session.data['monthlyPensionContributions'] = request.session.data['yearlyPensionContributions'] / 12;
    request.session.data['taxableIncomeTotal_monthly'] = request.session.data['taxableIncomeTotal'] / 12;
    request.session.data['otherAllowancesTotal_monthly'] = request.session.data['otherAllowancesTotal']  / 12;
    request.session.data['basicRateTotal_monthly'] = request.session.data['basicRateTotal'] / 12;
    request.session.data['higherRateTotal_monthly'] = request.session.data['higherRateTotal'] / 12;
    request.session.data['nationalInsuranceTotal_monthly'] = request.session.data['nationalInsuranceTotal'] / 12;
    request.session.data['monthlyStudentLoan'] = request.session.data['yearlyStudentLoan'] / 12;
    request.session.data['takeHomePay_monthly'] = request.session.data['takeHomePay'] / 12;

    // Work out weekly
    request.session.data['weeklySalary'] = request.session.data['yearlySalary'] / 52;
    request.session.data['weeklyPensionContributions'] = request.session.data['yearlyPensionContributions'] / 52;
    request.session.data['taxableIncomeTotal_weekly'] = request.session.data['taxableIncomeTotal'] / 52;
    request.session.data['otherAllowancesTotal_weekly'] = request.session.data['otherAllowancesTotal']  / 52;
    request.session.data['basicRateTotal_weekly'] = request.session.data['basicRateTotal'] / 52;
    request.session.data['higherRateTotal_weekly'] = request.session.data['higherRateTotal'] / 52;
    request.session.data['nationalInsuranceTotal_weekly'] = request.session.data['nationalInsuranceTotal'] / 52;
    request.session.data['weeklyStudentLoan'] = request.session.data['yearlyStudentLoan'] / 52;
    request.session.data['takeHomePay_weekly'] = request.session.data['takeHomePay'] / 52;



    response.redirect('/' + version + '/results')
  })
  

  //------- Code goes above here -------

}
