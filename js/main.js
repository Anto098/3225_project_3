const ROW_COUNT = 0;
const MAX_OFFSET = ROW_COUNT / 10;

/**
 * @type {int}
 * keeps track of current page
 */
var offset = 0;

/**
 * @type {boolean}
 * keeps track of whether the user will try to login or register when clicking the submit button
 */
var trying_to_login = true;
/**
 * @type {boolean}
 * Keeps track of whether the user will try to logout when clicking the logout/register/login button
 */
var trying_to_logout = false;

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
 * toggles between `register` and `login`
 */
function toggle_register_login_logout() {
    if(trying_to_logout){
        $("#logout_btn")
            .attr("id","register_login_btn")
            .removeClass("btn-danger")
            .addClass("btn-success")
            .attr("value","Login?");
        $("#login_form").attr("hidden",false);
        $("#login_message").text("");
        trying_to_logout = false;
    }
    if(trying_to_login) {
        $("#register_login_btn").attr("value","Login?");
        $("#login_register").html("Register : ");
        $("#login").attr("value","Register!");
        $("#username_div").attr("hidden",false);
        trying_to_login = false;
    } else {
        $("#register_login_btn").attr("value","Register?");
        $("#login_register").html("Login : ");
        $("#login").attr("value","Login!");
        $("#username_div").attr("hidden",true);
        $("#username").val("");
        $("#login_message")
            .val("")
            .attr("hidden",true);
        trying_to_login = true;
    }
    $("#email").val("");
    $("#password").val("");


}

var email;      // email address entered by the user
var password;   // password entered by the user
/**
 * Tells which function to execute whether we're trying to login or register
 */
function register_or_login() {
    email = $("#email").val();
    let email_serialized = $("#email").serialize();
    password = sha1($("#password").val());          // encoding password with SHA1
    let password_serialized = "password="+password; // serializing by hand
    if(trying_to_login){
        console.log("trying to login");
        $.post("../php/login.php", email_serialized + "&" + password_serialized, login);
    } else {
        let username_serialized = $("#username").serialize();
        console.log("trying to register");
        $.post("../php/register.php", email_serialized + "&" + password_serialized + "&" + username_serialized, register);
    }
    $("#password").val("");

}

/**
 * Executes the procedure required to register a user
 */
function register(data) {
    console.log("registering");
    if(data == "USER CREATED"){
        $("#login_message").text("The account was successfully created.");
        toggle_register_login_logout();
    } else {
        $("#login_message")
            .text("Email already in use.")
            .attr("hidden",false);
    }

}

/**
 * Executes the procedure required to login a user
 */
function login(data) {
    // check if email address is valid
    let regex = new RegExp("is not a valid email address");
    if (regex.test(data)) {
        $("#login_message").text("Please enter a valid email address.");
        return;
    }

    // check if email and password correspond to what's in the database
    data = JSON.parse(data);
    console.log(" user data : \nemail : "+email+", password : "+password+"\n");
    console.log(" server data : \nemail : "+data["EMAIL"]+", password : "+data["PASSWORD"]+"\n");
    if(data["EMAIL"]==email && data["PASSWORD"]==password){
        console.log("user exists");
        $("#login_form").attr("hidden",true);
        $("#login_register").html("Login successful!");
        $('#login_message').text("Bienvenue " + data["USERNAME"] + ".");
        $("#register_login_btn")
            .attr("id","logout_btn")
            .removeClass("btn-success")
            .addClass("btn-danger")
            .attr("value","Log out?");
        trying_to_logout = true;
        trying_to_login = false;
        $("#email").val("");
    } else {
        $("#login_message").text("Either the user doesn't exist or the password is incorrect.");
    }
}

/**
 * gets previous 10 cues in table
 */
function previous_page() {
    if(offset > 0) {
        offset -= 10;
    }
}

/**
 * gets next 10 cues in table
 */
function next_page() {
    if(offset < MAX_OFFSET) {
        offset += 10;
    }
}

/**
 * gets next 10 cues in table
 */
function update_table (){
    function reqListener () {
        console.log(this.responseText);
    }

    let req = new XMLHttpRequest();
    req.onload = function() {
        for (let i = 0; i < req.length; i++) {
            let row = $("#row-"+i);
            for(let j = 1; j <= req[i].length; j++) {
                if(j == 1) {
                    $(row+":nth-child("+j+"):first-child").attr("href", "#/info/"+req[i][j]);
                    $(row+":nth-child("+j+"):first-child").innerHTML(req[i][j]);
                }
                else {
                    $(row+":nth-child("+j+")").innerHTML(req[i][j]);
                }
            }
        }
        alert(this.responseText);
    }
    req.open("get", "paging.php", true);
    req.send();
}

/**
 * Sammy application logic. Manages functions associated with routes.
 */
let app = $.sammy('body', function() {
    this.get("", function() {
        console.log("empty route")
    });

    this.post('#',function() {

    })

    this.after(function() {
        let info_path = '/psycho.html#/info/';
        let regex = new RegExp(info_path);
        let path = this.path;

        if (regex.test(path)) {
            // If we get here it means that we just used an info/:word route.
            let word = path.substring(regex.exec(path).index + info_path.length, path.length)
            console.log(word)
        }

    })

}).run();

