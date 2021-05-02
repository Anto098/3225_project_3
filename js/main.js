const ROW_COUNT = 0;
const MAX_OFFSET = ROW_COUNT / 10;

/**
 * @type {int}
 * keeps track of current page
 */
var offset = 0;

////////// LOGIN LOGIC //////////

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
        trying_to_login = true;
    }
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
    console.log("registering");
    if(data == "USER CREATED"){
        toggle_register_login_logout();
        $("#login_message")
            .text("The account was successfully created.")
            .attr("hidden",false);
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
    console.log(data)
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

////////// END LOGIN LOGIC //////////

////////// GAME LOGIC //////////

var user_input = [];

function store_user_input(input) {
    user_input.push(input);
}

function calculate_score() {

}

////////// END GAME LOGIC //////////

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
    req.open("get", "sql_paging.php", true);
    req.send();
}



var email;      // email address entered by the user
var password;   // password entered by the user
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
        let target_number = word_info.length;

        let table = $("#word_info_as_table_div");
        table.empty();
        for (let i=0; i<target_number; i++) {
            let row = $(document.createElement("div"));
            row.addClass("row");
            row.append("<div class='col-4'></div><div class='col-4'></div><div class='col-4'></div>");
            table.append(row);
        }


        let word_info_array = []
        for (let j=0; j<target_number; j++) {
            word_info_array.push(word_info[j].word, word_info[j].targetword, word_info[j].msg)
        }

        d3.select("#word_info_as_table_div")
            .selectAll("div .col-4")
            .data(word_info_array)
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
        $("#my_dataviz").empty();
        circular_histogram()

        console.log("as histogram")
        $("#word_info_as_table_div").hide();
        $("#word_info_as_histogram_div").show();
    }
}

function circular_histogram() {
    // set the dimensions and margins of the graph
    var margin = {top: 100, right: 0, bottom: 0, left: 0},
        width = 1000 - margin.left - margin.right,
        height = 1000 - margin.top - margin.bottom,
        innerRadius = 90,
        outerRadius = Math.min(width, height) / 2;   // the outerRadius goes from the middle of the SVG area to the border

    // append the svg object
    var svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");

    let data = [
        {"Country":"United States", "Value":12394},
        {"Country":"Russia", "Value":6148}
    ]


    d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum.csv", function(d) {
        // Scales
        var x = d3.scaleBand()
            .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
            .align(0)                  // This does nothing
            .domain(word_info.map(function(d) { return d.targetword; })); // The domain of the X axis is the list of states.
        var y = d3.scaleRadial()
            .range([innerRadius, outerRadius])   // Domain will be define later.
            .domain([0, 14000]); // Domain of Y is from 0 to the max seen in the data

        // Add the bars
        svg.append("g")
            .selectAll("path")
            .data(word_info)
            .enter()
            .append("path")
            .attr("fill", "#69b3a2")
            .attr("d", d3.arc()     // imagine your doing a part of a donut plot
                .innerRadius(innerRadius)
                .outerRadius(function(d) { return y(d.msg*100000); })
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
            .attr("transform", function(d) { return "rotate(" + ((x(d.targetword) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (y(d.msg*100000)+10) + ",0)"; })
            .append("text")
            .text(function(d){return(d.targetword)})
            .attr("transform", function(d) { return (x(d.targetword) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
            .style("font-size", "11px")
            .attr("alignment-baseline", "middle")

    });
}

/**
 * Sammy application logic. Manages functions associated with routes.
 */
let app = $.sammy('body', function() {
    this.get("", function() {
        console.log("empty route")
    });

    this.post('#',function() {
        // Login/Register Route
        // Tells which function to execute whether we're trying to login or register
        email = $("#email").val();
        let email_serialized = $("#email").serialize();
        password = sha1($("#password").val());          // encoding password with SHA1
        let password_serialized = "password="+password; // serializing by hand

        if(trying_to_login){
            console.log("trying to login");
            $.post("../php/sql_login.php", email_serialized + "&" + password_serialized, login);
        } else {
            let username_serialized = $("#username").serialize();
            console.log("trying to register");
            $.post("../php/sql_register.php", email_serialized + "&" + password_serialized + "&" + username_serialized, register);
        }
        $("#password").val("");
    })

    this.after(function() {
        let info_path = '/psycho.html#/info/';
        let regex = new RegExp(info_path);
        let path = this.path;

        if (regex.test(path)) {
            // If we get here it means that we just used an info/:word route.
            let word = path.substring(regex.exec(path).index + info_path.length, path.length)
            $.get("../php/sql_word.php","word="+word, function(data) {
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

