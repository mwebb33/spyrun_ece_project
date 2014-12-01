
      // Enter a client ID for a web application from the Google Developer Console.
      // The provided clientId will only work if the sample is run directly from
      // https://google-api-javascript-client.googlecode.com/hg/samples/authSample.html
      // In your Developer Console project, add a JavaScript origin that corresponds to the domain
      // where you will be running the script.
      var clientId = '934764183588-rmpligl7vlhqqou7lvrsao32as3lvobm.apps.googleusercontent.com';

      // Enter the API key from the Google Develoepr Console - to handle any unauthenticated
      // requests in the code.
      // The provided key works for this sample only when run from
      // https://google-api-javascript-client.googlecode.com/hg/samples/authSample.html
      // To use in your own application, replace this API key with your own.
      var apiKey = 'AIzaSyCY9O9Wl9F_lkWiJToOf9IrZtddQ__EOFE';

      // To enter one or more authentication scopes, refer to the documentation for the API.
      var scopes = 'profile';

      // Use a button to handle authentication the first time.
      function handleClientLoad() {
        gapi.client.setApiKey(apiKey);
        window.setTimeout(checkAuth,1);
      }

      function checkAuth() {
        gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, handleAuthResult);
      }


      function handleAuthResult(authResult) {
        var authorizeButton = document.getElementById('authorize-button');
        if (authResult && !authResult.error) {
          authorizeButton.style.visibility = 'hidden';
          makeApiCall();
        } else {
          authorizeButton.style.visibility = '';
          authorizeButton.onclick = handleAuthClick;
          stage.visible = false;
        }
      }

      function handleAuthClick(event) {
        gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, handleAuthResult);
        return false;
      }

      // Load the API and make an API call.  Display the results on the screen.
      function makeApiCall() {
        gapi.client.load('plus', 'v1', function() {
          var request = gapi.client.plus.people.get({
            'userId': 'me'
          });
          request.execute(function(resp) {
            var heading = document.createElement('h4');
            var image = document.createElement('img');
            image.src = resp.image.url;
            heading.appendChild(image);
            heading.appendChild(document.createTextNode(resp.displayName));

            document.getElementById('content').appendChild(heading);
            document.getElementById('logoutbutton').style.visibility="visible";
            pausecomp(1000);
            stage.visible = true;  
            window.location= "http://spyrun.heroku.com";
          });
        });
      }

      function logout() {
          window.location= "https://accounts.google.com/logout";
          pausecomp(1000);
          stage.visible = false; 
          window.location= "http://spyrun.heroku.com";
      }

      function pausecomp(millis) {
        var date = new Date();
        var curDate = null;
        do { curDate = new Date(); } while(curDate-date < millis);
      }

