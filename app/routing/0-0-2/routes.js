module.exports = function(router) {

  //Code goes below here

  var version = '0-0-2';

  router.post('/' + version + '/1', function(request, response) {

      response.redirect('/' + version + '/2')
  })
  router.post('/' + version + '/2', function(request, response) {

      response.redirect('/' + version + '/3')
  })


  //Code goes above here

}
