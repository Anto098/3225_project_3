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
 * keeps track of wether the user wants to display a word information as a table or as a d3 histogram
 * if true, then we display as table, if false then we display as a d3 histogram.
 */
var is_word_info_as_table = true;

/**
 * @ {json}
 * stores a word information retrieved on the database if a player clicks on it on the #/cue table.
 */
var word_info = null;



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
function toggle_register_login() {
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
        trying_to_login = true;
    }
}

var email; // email address entered by the user
var password;
/**
 * Tells which function to execute whether we're trying to login or register
 */
function register_or_login() {
    if(trying_to_login){
        console.log("trying to login");
        email = $("#email").val();
        let email_serialized = $("#email").serialize();
        password = sha1($("#password").val());
        let password_serialized = "password="+password;
        $.get("../php/login.php",email_serialized+"&"+password_serialized, login);
    } else {
        // TODO get variables from html
        console.log("trying to register");
        $.get("login.php",email, register);
    }
}

/**
 * Executes the procedure required to register a user
 */
function register() {
    console.log("registering");
}

/**
 * Executes the procedure required to login a user
 */
function login(data) {
    console.log(" server data : \n"+data+"\n user data : \nemail : "+email+", password : "+password);
    if(data=="email : "+email+", password : "+password){
        console.log("user exists");
    } else {
        console.log("user doesn't exist");
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
 * Hides the word info histogram div (by default we show word info in the table div), and adds some event listeners.
 */
function setup_word_info() {
    $("#word_info_as_histogram_div").hide();

    $("#output_table").change(function() {
        is_word_info_as_table=true;
        display_word_info_as_table()
    });

    $("#output_histogram").change(function() {
        is_word_info_as_table=false;
        display_word_info_as_histogram()
    });

}

/**
 * Displays the stored word_info as a table.
 */
function display_word_info_as_table() {
    if(word_info != null) {
        let target_number = word_info.length/3;

        let table = $("#word_info_as_table_div");
        table.empty();
        for (let i=0; i<target_number; i++) {
            let row = $(document.createElement("div"));
            row.addClass("row");
            row.append("<div class='col-4'></div><div class='col-4'></div><div class='col-4'></div>");
            table.append(row);
        }

        d3.select("#word_info_as_table_div")
            .selectAll("div .col-4")
            .data(word_info)
            .text(d => d);

        table.show();
        $("#word_info_as_histogram_div").hide();
    }
}

/**
 * Displays the stored word_info as an histogram.
 */
function display_word_info_as_histogram() {
    if(word_info != null) {

        console.log("as histogram")
        $("#word_info_as_table_div").hide();
        $("#word_info_as_histogram_div").show();
    }
}

/**
 * Sammy application logic. Manages functions associated with routes.
 */
let app = $.sammy('body', function() {
    this.get("", function() {
        console.log("empty route")
    });

    this.post('#',function() {
        $('#login_message').text("Bienvenue " + this.params['email'] + ".");
    })

    this.after(function() {
        let info_path = '/psycho.html#/info/';
        let regex = new RegExp(info_path);
        let path = this.path;


        if (regex.test(path)) {
            // If we get here it means that we just used an info/:word route.
            let word = path.substring(regex.exec(path).index + info_path.length, path.length)
            $.get("../php/word.php","word="+word, function(data) {
                word_info = JSON.parse(data);
                is_word_info_as_table ? display_word_info_as_table() : display_word_info_as_histogram();
            })
        }

    })

})

/**
 * Called after html body is loaded. Setups the app.
 */
function main() {
    app.run();
    setup_word_info()
}

