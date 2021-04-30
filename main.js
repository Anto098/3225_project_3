function toggle_password() {
    let x = $("#password");
    console.log(x.attr("type"))
    if (x.attr("type") === "password") {
        x.attr("type","text");
    } else {
        x.attr("type","password");
    }
}

let app = $.sammy('#main', function() {
    this.post('#',function(){
        $('#login_message').text("Bienvenue " + this.params['username'] + ".");
    })
}).run();
