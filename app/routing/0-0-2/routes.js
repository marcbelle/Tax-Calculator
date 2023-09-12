module.exports = function(router) {

  //------- Code goes below here -------

  
 var version = '0-0-2'; // Set Prototype version

 // test function to calculate
  function addNumbers(a, b) {
    return a + b;
  } 

  // Calculate taxable income
  function calculateTaxableIncome(a, b, c) {
    return a - b - c;
  }

  // Calculate takehome
  function calculateTakehome(a, b, c, d, e, f, x) {
    return (a - b - c - d - e - f) + x ;
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

        // Reset tax free allowance just incase anything changed
        var taxFreeAmount = 12570;
        request.session.data['taxFreeAmount'] = taxFreeAmount;


        // if pension contributions are a percentage
        // recalculate amount if gross amount changed
        if (request.session.data['pension-contributions'] == "percentage") {
          yearlyPensionContributions = (request.session.data['pension-contributions-amount'] / 100) * request.session.data['yearlySalary']
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

        // flag that we have updated the amount
        //request.session.data['changeSalary'] = true;
        request.session.data['changeSalary'] = true;
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
        yearlyPensionContributions = (request.session.data['pension-contributions-amount'] / 100) * request.session.data['yearlySalary']
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
        yearlyPensionContributions = (request.session.data['pension-contributions-amount'] / 100) * request.session.data['yearlySalary']
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
        response.redirect('/' + version + '/student-loans')
      }

    } else { // it's job income, check age
      
      if (checkMode) {
        response.redirect('/' + version + '/check-answers')
      } else {
        response.redirect('/' + version + '/state-pension-age')
      }
      
    }
  })

  router.post('/' + version + '/state-pension-age', function(request, response) {

    var checkMode = request.session.data['checkMode'];

    if (request.session.data['income-type'] == "private pension"){ //if income type is private pension skip pension contributions

      if (checkMode) {
        response.redirect('/' + version + '/check-answers')
      } else {
        response.redirect('/' + version + '/student-loans')
      }

    } else { // it's job income, check pension contributions
      response.redirect('/' + version + '/pension-contributions')
    }
  })

  router.post('/' + version + '/pension-contributions', function(request, response) {
    if (request.session.data['make-pension-contributions'] == "Yes"){ 
      response.redirect('/' + version + '/amount-contributions')
    } else {
      // Set to 0 incase this has been changed
      var yearlyPensionContributions = request.session.data['yearlyPensionContributions'];
      yearlyPensionContributions = 0;
      request.session.data['yearlyPensionContributions'] = yearlyPensionContributions;
    

      
      var checkMode = request.session.data['checkMode'];
      if (checkMode) {
        response.redirect('/' + version + '/check-answers')
      } else {
        response.redirect('/' + version + '/student-loans')
      }
    }
  })



  router.post('/' + version + '/amount-contributions', function(request, response) {

    // Calculate a yearly pension contributions
    var yearlyPensionContributions = request.session.data['yearlyPensionContributions'];

    if (request.session.data['pension-contributions'] == "fixed"){ 
      yearlyPensionContributions = request.session.data['pension-contributions-amount'] * 12
    } else {
      yearlyPensionContributions = (request.session.data['pension-contributions-amount'] / 100) * request.session.data['yearlySalary']
    }

    request.session.data['yearlyPensionContributions'] = yearlyPensionContributions;
    console.log(yearlyPensionContributions);

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
      response.redirect('/' + version + '/taxcode')
    }
    
  })
  

  

  



  router.post('/' + version + '/taxcode', function(request, response) {

    if (request.session.data['tax-code'] == ""){ //if the tax code is empty show scottish

      response.redirect('/' + version + '/scottish')
      
    } else { // there is a tax code skip to check answers
      request.session.data['checkMode'] = true;

      // User might have updated the taxcode so hide the message about taxcode not applying to salary
      var changeSalary = request.session.data['changeSalary'];
      if (changeSalary) {
        request.session.data['changeSalary'] = false;
      }

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
    var taxFreeAmount = request.session.data['defaultTaxFreeAmount']; // we reset the taxfree amount so that we can calculate it again incase the user has made a change.
    // var taxFreeAmount = request.session.data['taxFreeAmount'];
    var threshold0 = request.session.data['threshold0'];
    var threshold20 = request.session.data['threshold20'];
    var threshold40 = request.session.data['threshold40'];
    var netSalary = 0;
    var basicRateTotal = 0; // reset in case the user makes a change to salary
    var higherRateTotal = 0; // reset in case the user makes a change to salary
    var additionalRateTotal = 0; // reset in case the user makes a change to salary
    request.session.data['basicRateTotal'] = basicRateTotal;
    request.session.data['higherRateTotal'] = higherRateTotal;
    request.session.data['additionalRateTotal'] = additionalRateTotal;
    var nationalInsuranceTotal = request.session.data['nationalInsuranceTotal'];
    var yearlyStudentLoan = request.session.data['yearlyStudentLoan'];

    // Reset taper flag
    request.session.data['taperMode'] = false;
    

    // Work out tax free allowance with allowances and deductions
    //taxFreeAmount = taxFreeAmount + (request.session.data['otherAllowancesTotal'] - request.session.data['otherDeductionsTotal'])
    //request.session.data['taxFreeAmount'] = taxFreeAmount;


   
    if (yearlySalary > 100000) {
      // work out what tax free amoutn will be

      netSalary = calculateTaxableIncome(yearlySalary, 0, request.session.data['yearlyPensionContributions']);

      
      

      if (netSalary > 100000) {

        // Tapering should apply but if the user has ignored the first taxcode message on check answers
        // let them continue with the 1257L taxcode without tapering the tax free amount and show them 
        // a second message on the results screen.

        if (request.session.data['tax-code'] == "1257L") {

          taxFreeAmount = taxFreeAmount;

        } else {
          // Taper
          //Set taper flag to on
          request.session.data['taperMode'] = true;
          
          // Reduce the tax free allowance
          if (netSalary > threshold40) {
            // set allowance to 0
            taxFreeAmount = 0;
          } else {
          // work out how much to reduce it by
            taxFreeAmount = threshold0 - ((netSalary - 100000) / 2)
          }
        }
  
      } 

    }




    taxableIncome = calculateTaxableIncome(yearlySalary, taxFreeAmount, request.session.data['yearlyPensionContributions']);
   
    



    request.session.data['taxableIncomeTotal'] = taxableIncome;
    request.session.data['taxFreeAmount'] = taxFreeAmount;
    //console.log(taxableIncome + "is the taxable income");
    //console.log(yearlySalary);
    //console.log(request.session.data['otherAllowancesTotal']);
    //console.log(request.session.data['yearlyPensionContributions']);


    // Work out tax bands if above tax free threshold
    if (taxableIncome > threshold0) {
    console.log("gotta pay some tax");

            // Determine rate and NI contributions
            if (taxableIncome <= threshold20 ) { // User is only on 20%
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


            } else if (taxableIncome > threshold40) { // User is on 45%

              console.log("45%");

              

              var basicRateTotal = (threshold20 - threshold0) * 0.2; // work out how much to do at 20%
              var higherRateTotal = (threshold40 - (threshold20 - threshold0)) * 0.4; // work out how much is at 40%
              var additionalRateTotal = (taxableIncome - threshold40) * 0.45; // do whatever is left at 45%

              if (request.session.data['income-type'] == 'job') {
                // check age
                if (request.session.data['state-pension-age'] == 'No') {
                  // User pays NI
                  var NI20 = (threshold20 - threshold0) * 0.12;
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
              console.log(additionalRateTotal);
              console.log(nationalInsuranceTotal);
              request.session.data['basicRateTotal'] = basicRateTotal;
              request.session.data['higherRateTotal'] = higherRateTotal;
              request.session.data['additionalRateTotal'] = additionalRateTotal;
              request.session.data['nationalInsuranceTotal'] = nationalInsuranceTotal;
              
              

            } else { // User is on 40%

              console.log("40 %");
              var basicRateTotal = (threshold20 - threshold0) * 0.2; // work out how much to do at 20%
              var higherRateTotal = (taxableIncome - (threshold20 - threshold0)) * 0.4; // do whatever is left at 40%
              console.log("higher rate is: " + higherRateTotal)
/*
              if (netSalary > 100000) {

                // if over £100k calculate additional 40% on threshold0 - taxfreeamount.
                higherRateTotal = higherRateTotal + ((threshold0 - taxFreeAmount) * 0.4);

              }
              */

              

              if (request.session.data['income-type'] == 'job') {
                // check age
                if (request.session.data['state-pension-age'] == 'No') {
                  // User pays NI
                  var NI20 = (threshold20 - threshold0) * 0.12;
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
    takeHomePay = calculateTakehome(taxableIncome, basicRateTotal, higherRateTotal, additionalRateTotal, nationalInsuranceTotal, yearlyStudentLoan, taxFreeAmount) ;
    request.session.data['takeHomePay'] = takeHomePay;
    console.log(takeHomePay);



    // Work out monthly
    request.session.data['monthlySalary'] = request.session.data['yearlySalary'] / 12;
    request.session.data['monthlyPensionContributions'] = request.session.data['yearlyPensionContributions'] / 12;
    request.session.data['taxableIncomeTotal_monthly'] = request.session.data['taxableIncomeTotal'] / 12;
    request.session.data['otherAllowancesTotal_monthly'] = request.session.data['otherAllowancesTotal']  / 12;
    request.session.data['basicRateTotal_monthly'] = request.session.data['basicRateTotal'] / 12;
    request.session.data['higherRateTotal_monthly'] = request.session.data['higherRateTotal'] / 12;
    request.session.data['additionalRateTotal_monthly'] = request.session.data['additionalRateTotal'] / 12;
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
    request.session.data['additionalRateTotal_weekly'] = request.session.data['additionalRateTotal'] / 52;
    request.session.data['nationalInsuranceTotal_weekly'] = request.session.data['nationalInsuranceTotal'] / 52;
    request.session.data['weeklyStudentLoan'] = request.session.data['yearlyStudentLoan'] / 52;
    request.session.data['takeHomePay_weekly'] = request.session.data['takeHomePay'] / 52;



    response.redirect('/' + version + '/results')
  })

  router.post('/' + version + '/results', function(request, response) {

    response.redirect('/' + version + '/check-answers')
    
  })
  

  //------- Code goes above here -------

}
