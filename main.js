const ROW_COUNT = 0;
const MAX_OFFSET = ROW_COUNT / 10;

/**
 * @type {int}
 * keeps track of current page
 */
var offset = 0;

/**
 * @type {boolean}
 * keeps track of whether the user will try to connect or register when clicking the submit button
 */
var trying_to_connect = true;

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
 * toggles between `s'inscrire` and `se connecter`
 */
function toggle_inscrire_connecter() {
    if(trying_to_connect) {
        $("#register_connect_btn").attr("value","Connect ?");
        $("#connect_register").html("Register : ");
        $("#login").attr("value","Register!");
        trying_to_connect = false;
    } else {
        $("#register_connect_btn").attr("value","Register?");
        $("#connect_register").html("Login : ");
        $("#login").attr("value","Login!");
        trying_to_connect = true;
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
function update_table {
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
        $('#login_message').text("Bienvenue " + this.params['username'] + ".");
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

