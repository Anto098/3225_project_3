const ROW_COUNT = 14;
const MAX_OFFSET = (ROW_COUNT / 10) * 10;

/**
 * @type {int}
 * keeps track of current page
 */
var current_offset = 0;

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
 * gets previous 10 cues in table
 */
function previous_page() {
    if(current_offset > 0) {
        current_offset -= 10;
    }
    let test;
    $.get('../paging.php', current_offset, function(data) {
        console.log(JSON.parse(data));
    });
}

/**
 * gets next 10 cues in table
 */
function next_page() {
    if(current_offset < MAX_OFFSET) {
        current_offset += 10;
    }
    let test;
    let offset = "offset="+current_offset;
    console.log("allo");
    $.get('./paging.php',offset,function(data) {
        console.log(JSON.parse(data));
    });
}

/**
 * Sammy application logic. Manages functions associated with routes.
 */
let app = $.sammy('body', function() {
    this.get("", function() {
        console.log("empty route");
    });

    this.get("#/cue", function() {
        console.log("test");
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

