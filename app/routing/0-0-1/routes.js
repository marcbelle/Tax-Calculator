module.exports = function(router) {

  //------- Code goes below here -------

  
 var version = '0-0-1'; // Set Prototype version

 // test function to calculate
  function addNumbers(a, b) {
    return a + b;
  } 

  // Calculate taxable income
  function calculateTaxableIncome(a, b, c, d) {
    return a - b - c - d;
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

    // Calculate a yearly salary
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
    } else if (request.session.data['gross-income-frequency'] == "a day") {
      yearlySalary = (request.session.data['gross-income-amount'] * 5) * 52
      request.session.data['yearlySalary'] = yearlySalary;
    } else if (request.session.data['gross-income-frequency'] == "an hour") {
      yearlySalary = (request.session.data['gross-income-amount'] * 37.5) * 52
      request.session.data['yearlySalary'] = yearlySalary;
    } else { // it's been set as yearly
      yearlySalary = request.session.data['gross-income-amount']
      request.session.data['yearlySalary'] = yearlySalary;
    }


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

    var otherAllowancesTotal = request.session.data['otherAllowancesTotal'];

    if (request.session.data['other-allowances'] == "monthly"){ 
      otherAllowancesTotal = request.session.data['other-allowances-monthly'] * 12;
    } else if (request.session.data['other-allowances'] == "yearly") {
      otherAllowancesTotal = request.session.data['other-allowances-yearly'];
    } else {
      otherAllowancesTotal = 0;
    }

    request.session.data['otherAllowancesTotal'] = otherAllowancesTotal;


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
    var taxFreeAmount = request.session.data['taxFreeAmount'];
    var threshold20 = 50270;
    var basicRateTotal = request.session.data['basicRateTotal'];
    var higherRateTotal = request.session.data['higherRateTotal'];
    var nationalInsuranceTotal = request.session.data['nationalInsuranceTotal'];
    var yearlyStudentLoan = request.session.data['yearlyStudentLoan'];
    

    

    // Work out taxable income
    //taxableIncome = calculateTaxableIncome(yearlySalary, taxFreeAmount, request.session.data['other-allowances'], request.session.data['yearlyPensionContributions']);
    taxableIncome = calculateTaxableIncome(yearlySalary, taxFreeAmount, request.session.data['otherAllowancesTotal'], request.session.data['yearlyPensionContributions']);
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
