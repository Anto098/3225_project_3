////////// GLOBAL VARIABLES //////////
const ROW_COUNT = 21870;
const MAX_OFFSET = Math.floor(ROW_COUNT / 10) * 10;

/**
 * @type {int}
 * keeps track of current page
 */
var current_offset = 0;

////////// LOGIN & REGISTRATION LOGIC //////////

var user_input = [];
var email;      // LOGIN LOGIC : email address entered by the user
var password;   // LOGIN LOGIC : password entered by the user
var time;       // GAME LOGIC : time to play the game entered by the user
var cue;        // GAME LOGIC : cue entered by the user

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
    if(x.attr("type") === "password") {
        x.attr("type","text");
    } else {
        x.attr("type","password");
    }
}

/**
 * toggles between `register` and `login`
 */
function toggle_register_login_logout() {
    if(trying_to_logout) {
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
        trying_to_login = true;
    }
    game_restart(); // if user played, logs out then logs back in, need to reload game
    $("#login_message")
        .val("")
        .attr("hidden",true);
    $("#email").val("");
    $("#password").val("");


}

/**
 * Executes the procedure required to register a user
 */
function register(data) {
    console.log("data : \n"+data);
    data = JSON.parse(data);
    console.log(" user data : \nemail : "+email_value+", username : "+username+"\n");
    console.log(" server data : \nemail : "+data["EMAIL"]+", username : "+data["USERNAME"]+"\n");
    if(data["EMAIL"]===email_value || data["USERNAME"]===username) {
        $("#login_message")
            .text("Email or Username already in use.")
            .attr("hidden",false);
    } else {
        // toggle_register_login_logout();
        $("#login_message")
            .text("The account was successfully created.")
            .attr("hidden",false);
    }

}

/**
 * Executes the procedure required to login a user
 */
function login(data) {
    // check if email address is valid
    let regex = new RegExp("is not a valid email address");
    if(regex.test(data)) {
        $("#login_message").text("Please enter a valid email address.");
        return;
    }

    // check if email and password correspond to what's in the database
    data = JSON.parse(data);
    console.log(" user data : \nemail : "+email_value+", password : "+password+"\n");
    console.log(" server data : \nemail : "+data["EMAIL"]+", password : "+data["PASSWORD"]+"\n");
    if(data["EMAIL"] === email_value && data["PASSWORD"] === password) {
        console.log("user exists");
        $("#login_form").attr("hidden",true);
        $("#login_register").html("Login successful!");
        $('#login_message')
            .text("Bienvenue " + data["USERNAME"] + ".")
            .removeAttr("hidden");
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

////////// END LOGIN & REGISTRATION LOGIC //////////

////////// GAME LOGIC //////////

var user_input_p = $("#user_input_p"); // #user_input_p, declared here to avoid calling jquery multiple times
var all_user_input = [];
var score_sum = 0;
var game_data;

/**
 * manage_user_input :
 * if input is valid (length > 0 and word has not already been entered by the user) :
 * check if word is a TARGET of the CUE and store the word
 * else : show an error message
 */
function manage_user_input(){
    let input = $("#user_input").val().toUpperCase();
    if(input.length > 0 && !all_user_input.includes(input)){
        $("#game_message_p").attr("hidden",true);
        $("#user_input").val("");
        let isTarget = check_user_input(input);
        store_user_input(input,isTarget);
    } else {
        $("#game_message_p")
            .text("Input too short (min length = 1) or you already tried this word.")
            .attr("hidden",false);
    }
}

/**
 * @param input : user input
 * @returns {boolean}
 *  check_user_input : checks if the user input is a valid TARGET of the CUE
 */
function check_user_input(input){
    for(i in game_data) {
        if(game_data[i]["TARGET"] === input) {
            return true;
        }
    }
    return false;
}

/**
 * @param input : user input
 * @param isTarget : is the word a target of the cue
 * store_user_input : stores the user input in an array and in #user_input_p, changes its color if correct
 */
function store_user_input(input,isTarget) {
    all_user_input.push(input);
    // if word is a TARGET of the CUE, make it blue
    if(isTarget) {
        calculate_score(input);
        input = "<span style='color:blue'>"+input+"</span>";
    }
    if(user_input_p.html().length === 0 ){
        user_input_p.html(input);
    } else {
        user_input_p.html(user_input_p.html()+", "+input);
    }
}

/**
 * @param input
 * looks up the score of a word given by the user, adds to the total score
 */
function calculate_score(input) {
    for(i in game_data){
        if(input === game_data[i]["TARGET"]) {
            score_sum += parseFloat(game_data[i]["MSG"]);
        }
    }
}

/**
 * @param data sent back by ajax request
 * play_game : function that manages the game.
 */
function play_game(data) {
    game_data = JSON.parse(data);
    if(game_data.length === 0) { // if invalid cue, ask player to enter another one
        $("#game_message_p")
            .text("Your cue did not yield any result, please try another one.")
            .attr("hidden",false);
    } else {                    // if valid cue, start game
        $("#game_message_p").attr("hidden",true);
        $("#time").attr("disabled",true);
        $("#cue")
            .attr("disabled",true)
            .val(game_data[0]["CUE"]);
        $("#start_game")
            .attr("hidden",true);
        $("#user_input_div").removeAttr("hidden");
        game_timer();
    }
}

/**
 * update_db : updates the GAMES_PLAYED and SCORE fields of a user after he played a game
 */
function update_db(){
    $.post("../php/sql_game_nb_score.php",email_serialized+"&"+"score="+score_sum, function(data){
        console.log(data);
    });
}

/**
 * game_timer : decrements time counter every second
 */
async function game_timer() {
    let timer = $("#time");
    while(timer.val()>0) {
        await sleep(1000);
        timer.val(timer.val()-1);
    }
    $("#game_message_p")
        .html("Game Over!\n Votre score : "+score_sum)
        .removeAttr("hidden");
    $("#user_input").attr("disabled",true);
    $("#submit_user_input").attr("disabled",true);
    $("#game_restart_button").removeAttr("hidden");
    update_db(); // update db when game is over
}

function game_restart(){
    $("#start_game").attr("hidden",false);
    $("#user_input_div").attr("hidden",true);
    $("#game_message_p").attr("hidden",true);
    $("#time")
        .removeAttr("disabled")
        .val("60");
    $("#cue")
        .removeAttr("disabled")
        .val("");
    $("#user_input")
        .attr("disabled",false)
        .val("");
    $("#submit_user_input").attr("disabled",false);
    $("#game_restart_button").attr("hidden",true);
    // reset all variables/html elements
    all_user_input = [];
    score_sum = 0;
    $("#user_input_p").html("");
}

/**
 * @param ms : nb of ms we want to sleep
 * sleep : sleeps a certain amount of ms given in argument
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

////////// END GAME LOGIC //////////

////////// CUE TABLE LOGIC //////////
/**
 * gets previous 10 cues in table
 */
function previous_page() {
    if(current_offset > 0) {
        current_offset -= 10;
    }
    let offset = "offset="+current_offset;
    $.post('../php/sql_paging.php',offset,update_table);
}

/**
 * gets next 10 cues in table
 */
function next_page() {
    if(current_offset < MAX_OFFSET) {
        current_offset += 10;
    }
    let offset = "offset="+current_offset;
    $.post('../php/sql_paging.php',offset,update_table);
}

/**
 * gets next 10 cues in table
 */
function update_table(data) {
    console.log(data)
    data = JSON.parse(data);
    console.log(data[0]['0']);
    let row = "row-";
    for(let i = 0; i < 10; i++) {
        for(let j = 0; j < 3; j++) {
            if(j === 0) {
                document.getElementById(row+i).getElementsByTagName('div')[j]
                    .getElementsByTagName('a')[j].setAttribute("href", "");
                document.getElementById(row+i).getElementsByTagName('div')[j]
                    .getElementsByTagName('a')[j].textContent = "";
            }
            else {
                document.getElementById(row+i).getElementsByTagName('div')[j].textContent = "";
            }
        }
    }
    for(let i = 0; i < Math.min(10, ROW_COUNT - current_offset); i++) {
        for(let j = 0; j < 3; j++) {
            if(j === 0) {
                document.getElementById(row+i).getElementsByTagName('div')[j]
                    .getElementsByTagName('a')[j].setAttribute("href", "#/info/"+data[i][j]);
                document.getElementById(row+i).getElementsByTagName('div')[j]
                    .getElementsByTagName('a')[j].textContent = data[i][j];
            }
            else {
                document.getElementById(row+i).getElementsByTagName('div')[j].textContent = data[i][j];
            }
        }
    }
}
////////// END CUE TABLE LOGIC //////////

/**
 * Hides the word info histogram div (by default we show word info in the table div), and adds some event listeners.
 */
function setup_word_info() {
    $("#word_info_div").hide();
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
        let table = $("#word_info_as_table");
        table.empty();

        for (let i=0; i<word_info.length; i++) {
            let row = $(document.createElement("div"));
            row.addClass("row");
            row.append("<div class='col-4'></div><div class='col-4'></div><div class='col-4'></div>");
            table.append(row);
        }


        let word_info_array = []
        for (let j=0; j<word_info.length; j++) {
            word_info_array.push(word_info[j].word, word_info[j].targetword, word_info[j].msg)
        }

        d3.select("#word_info_as_table")
            .selectAll("div .col-4")
            .data(word_info_array)
            .text(d => d);

        $("#word_info_as_table_div").show();
        $("#word_info_as_histogram_div").hide();
    }
}

/**
 * Displays the stored word_info as an histogram.
 */
function display_word_info_as_histogram() {
    if(word_info != null) {
        $("#my_dataviz").empty();
        circular_histogram()

        console.log("as histogram")
        $("#word_info_as_table_div").hide();
        $("#word_info_as_histogram_div").show();
    }
}

/**
 * Returns the msg max value in the global json variable word_info.
 * @returns {number}
 */
function get_word_max_msg() {
    if (word_info === null) {
        return 1;
    }

    let max_msg = 0;
    for (let i=0; i<word_info.length; i++) {
        if (word_info[i].msg > max_msg) {
            max_msg = word_info[i].msg;
        }
    }

    return max_msg;
}

/**
 * Displays a circular histogram of the word info.
 */
function circular_histogram() {
    let max_msg = get_word_max_msg();

    // set the dimensions and margins of the graph
    var margin = {top: 100, right: 100, bottom: 100, left: 100},
        width = 600 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom,
        innerRadius = 90,
        outerRadius = Math.min(width, height) / 2;   // the outerRadius goes from the middle of the SVG area to the border

    // append the svg object
    var svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");

    // Scales
    var x = d3.scaleBand()
        .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
        .align(0)                  // This does nothing
        .domain(word_info.map(function(d) { return d.targetword; })); // The domain of the X axis is the list of states.
    var y = d3.scaleRadial()
        .range([innerRadius, outerRadius])   // Domain will be define later.
        .domain([0, max_msg]); // Domain of Y is from 0 to the max seen in the data

    // Add the bars
    svg.append("g")
        .selectAll("path")
        .data(word_info)
        .enter()
        .append("path")
        .attr("fill", "#69b3a2")
        .attr("d", d3.arc()     // imagine your doing a part of a donut plot
            .innerRadius(innerRadius)
            .outerRadius(function(d) { return y(d.msg); })
            .startAngle(function(d) { return x(d.targetword); })
            .endAngle(function(d) { return x(d.targetword) + x.bandwidth(); })
            .padAngle(0.01)
            .padRadius(innerRadius))

    // Add the labels
    svg.append("g")
        .selectAll("g")
        .data(word_info)
        .enter()
        .append("g")
        .attr("text-anchor", function(d) { return (x(d.targetword) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
        .attr("transform", function(d) { return "rotate(" + ((x(d.targetword) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (y(d.msg)+10) + ",0)"; })
        .append("text")
        .text(function(d){return(d.targetword)})
        .attr("transform", function(d) { return (x(d.targetword) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
        .style("font-size", "13px")
        .attr("alignment-baseline", "middle")

}

var email_value;      // LOGIN & REGISTRATION LOGIC : email address entered by the user (registration and login)
var email_serialized;
var password;   // LOGIN & REGISTRATION LOGIC : password entered by the user (registration and login)
var username;   // LOGIN & REGISTRATION LOGIC : username entered by the user (registration)
var cue;        // GAME LOGIC : cue entered by the user

/**
 * Sammy application logic. Manages functions associated with routes.
 */
let app = $.sammy("body", function() {
    this.get("", function() {
        console.log("empty route")
    });

    this.post("#",function() {
        // Login/Register Route
        // Tells which function to execute whether we're trying to login or register
        let email = $("#email");
        email_value = email.val();
        email_serialized = email.serialize();
        password = sha1($("#password").val());          // encoding password with SHA1
        let password_serialized = "password="+password; // serializing by hand
        if(trying_to_login){
            console.log("trying to login");
            $.post("../php/sql_login.php", email_serialized + "&" + password_serialized, login);
        } else {
            username = $("#username").val();
            let username_serialized = $("#username").serialize();
            console.log("trying to register");
            $.post("../php/sql_register.php", email_serialized + "&" + password_serialized + "&" + username_serialized, register);
        }
        $("#password").val("");
    })

    this.post("#/game",function(){
        let time_serialized = $("#time").serialize();
        cue = $("#cue").val();
        let cue_serialized = "cue="+cue;
        console.log("time_serialized : "+time_serialized+", cue_serialized : "+cue_serialized);
        console.log("trying to start game");
        $.get("../php/sql_game_info.php",cue_serialized,play_game);
    })

    this.after(function() {
        let info_path = '/psycho.html#/info/';
        let regex = new RegExp(info_path);
        let path = this.path;

        if(regex.test(path)) {
            // If we get here it means that we just used an info/:word route.
            let word = path.substring(regex.exec(path).index + info_path.length, path.length)
            $.get("../php/sql_word.php","word="+word, function(data) {
                word_info = JSON.parse(data);
                is_word_info_as_table ? display_word_info_as_table() : display_word_info_as_histogram();
                $("#word_info_div").show();
            })
        }

    })

})

/**
 * Called after html body is loaded. Setups the app.
 */
function main() {
    app.run();
    setup_word_info();
    previous_page();
}
////////// END APP LOGIC //////////
