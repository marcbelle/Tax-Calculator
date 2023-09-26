//
// For guidance on how to add JavaScript see:
// https://prototype-kit.service.gov.uk/docs/adding-css-javascript-and-images
//

window.GOVUKPrototypeKit.documentReady(() => {
  // Add JavaScript here

  // Script to append £ or % to pension contributions text field based on what user selects.
  const pensionContributions = document.querySelectorAll("[name='pension-contributions']");

  const changeRadio = (ev) => {

    

   if(document.getElementById('pension-contributions').checked) {
      //Male radio button is checked
       document.getElementById('suffix').classList.remove("govuk-input__suffix")
       document.getElementById('suffix').innerHTML = ""

       // Set Prefix
       var div = document.getElementById('prefix');
       div.innerHTML = "£";
       div.setAttribute('class', 'govuk-input__prefix');
       document.getElementById("prefix").appendChild(div);

       


    } else if(document.getElementById('pension-contributions-2').checked) {
      //Female radio button is checked
      document.getElementById('prefix').classList.remove("govuk-input__prefix")
      document.getElementById('prefix').innerHTML = ""

      // Set Suffix
      var div = document.getElementById('suffix');
      div.innerHTML = "%";
      div.setAttribute('class', 'govuk-input__suffix');
      document.getElementById("suffix").appendChild(div);


      
    }


  };

  pensionContributions.forEach((i) => i.addEventListener("change",changeRadio))
  
})
