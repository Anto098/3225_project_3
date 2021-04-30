/**
 * toggles password on and off when button is clicked
 */
function toggle_password() {
    let x = $("#password");
    if (x.attr("type") === "password") {
        x.attr("type","text");
    } else {
        x.attr("type","password");
    }
}

/**
 * Sammy application logic. Manages functions associated with routes.
 */
let app = $.sammy('body', function() {

    this.get("", function () {
        console.log("empty route")
    });

    this.post('#',function(){
        $('#login_message').text("Bienvenue " + this.params['username'] + ".");
    })
}).run();
