var mainApp 

(function(){
    var uid = null
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          uid = user.uid
        } else {
            uid = null
            console.log('logout')
            window.location.replace("/")

        }
      });

      const logout = document.getElementById('log-out')
      function logOut(){
          firebase.auth().signOut()
      }

      logout.addEventListener('click', function(){
        mainApp.logOut = logOut()
      })
      
})()