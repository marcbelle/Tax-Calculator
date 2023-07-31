//
// For guidance on how to create filters see:
// https://prototype-kit.service.gov.uk/docs/filters
//

const govukPrototypeKit = require('govuk-prototype-kit')
const addFilter = govukPrototypeKit.views.addFilter

// Add your filters here

// test filter
addFilter('uppercase', function (content) {
    return content.toUpperCase()
})

addFilter('formatPounds', function (x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
})

addFilter('toFixed', function(num, digits) {
  return parseFloat(num).toFixed(digits)
});

  

