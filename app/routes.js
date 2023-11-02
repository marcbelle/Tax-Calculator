//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// Add your routes here
require('./routing/0-0-1/routes.js') (router);
require('./routing/0-0-2/routes.js') (router);
require('./routing/0-0-3/routes.js') (router);
require('./routing/0-1-0/routes.js') (router);
require('./routing/alts/routes.js') (router);
require('./routing/0-1-1/routes.js') (router);
require('./routing/alts011/routes.js') (router);





  
// Add your routes above module.exports
module.exports = router;
