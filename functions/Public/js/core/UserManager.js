function UserManager() {

}

UserManager.prototype.SendVerifyEmail = function (emailAddr) {
    firebase.auth().sendEmailVerification(emailAddr).then(function() {
        // Email sent.
        console.log("email sent")
    }, function(error) {
        // An error happened.
        console.log("error: " + error)
    });
}