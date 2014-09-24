var express = require('express');
var app = express();

app.get('/', function(req, res){
	res.status(200);
	res.sendFile(__dirname + "/index.html");
});

app.get('/:user/:id', function(req, res){	
	var me = req.params.user
	if (req.params.id == "user") {
	    res.set({'Content-Type': 'application/json'});
	    res.status(200);
	    res.send(users[me]);
	    return;
	}
	if (req.params.id == "inventory") {
	    res.set({'Content-Type': 'application/json'});
	    res.status(200);
	    res.send(users[me].inventory);
	    return;
	}
	if(req.params.id == "who") {
	    res.set({'Content-Type': 'application/json'});
	    res.status(200);
	    var whoIsInside = [users[me].id];
	    for(var x in users) {
		if( users[me].room == users[x].room && x != me )
			whoIsInside.push(users[x].id);
	    }
	    whoIsInside.push(app.get('title'));
	    res.send(whoIsInside);
	    return;
	}
	for (var i in campus) {
		if (req.params.id == campus[i].id) {
		    campus[10].what = ["student"];
		    users[me].room = req.params.id;
		    res.set({'Content-Type': 'application/json'});
		    res.status(200);
		    res.send(campus[i]);
		    return;
		}
	}
	res.status(404);
	res.send("not found, sorry");
});

app.get('/images/:sessionID/:where', function(req, res){
	res.status(200);
	res.sendFile(__dirname + "/" + req.params.where);
	return;
});

app.delete('/:user/:id/:item', function(req, res){
	var me = req.params.user;
	for (var i in campus) {
		if (req.params.id == campus[i].id) {
		    res.set({'Content-Type': 'application/json'});
		    var ix = -1;
		    if (campus[i].what != undefined) {
					ix = campus[i].what.indexOf(req.params.item);
		    }
		    if (ix >= 0) {
		       res.status(200);
			users[me].inventory.push(campus[i].what[ix]); // stash
		        res.send(users[me].inventory);
			campus[i].what.splice(ix, 1); // room no longer has this
			return;
		    }
		    res.status(200);
		    res.send([]);
		    return;
		}
	}
	res.status(404);
	res.send("location not found");
});

app.put('/:user/:id/:item', function(req, res){
	var me = req.params.user;
	for (var i in campus) {
		if (req.params.id == campus[i].id) {
				// Check you have this
				var ix = users[me].inventory.indexOf(req.params.item)
				if (ix >= 0) {
					dropbox(ix,campus[i], me);
					res.set({'Content-Type': 'application/json'});
					res.status(200);
					res.set([]);
				} else {
					res.status(404);
					res.send("you do not have this");
				}
				return;
		}
	}
	res.status(404);
	res.send("location not found");
});

app.listen(3000);

var dropbox = function(ix,room, user) {
	var item = users[user].inventory[ix];
	users[user].inventory.splice(ix, 1);	 // remove from inventory
	if (room.id == 'allen-fieldhouse' && item == "basketball") {
		room.text	+= " Someone found the ball so there is a game going on!";
		campus[2].next = {"east": "snow-hall", "south": "allen-fieldhouse", "west": "lied-center", "inside": "secret-room"}
		return;
	}
	if (room.what == undefined) {
		room.what = [];
	}
	room.what.push(item);
}

var users = [ { "id": "Bill Self",
		"room": "",
		"inventory": ["clipboard", "basketball tickets"]
		},
		{ "id": "Coach Weis",
		"room": "",
		"inventory": ["football", "golf cart", "clipboard"]
		},
		{ "id": "Chancellor Little",
		"room": "",
		"inventory": ["laptop", "segway"]
		},
		{ "id": "Big Jay",
		"room": "",
		"inventory": ["nest"]
		},
		{ "id": "Baby Jay",
		"room": "",
		"inventory": ["bouncy ball"]
		},
		{ "id": "Professor",
		"room": "",
		"inventory": ["exam", "laptop"]
		},
		{ "id": "Student",
		"room": "",
		"inventory": ["homework", "backpack", "ID card", "laptop"]
		},
		{ "id": "Phog Allen",
		"room": "",
		"inventory": ["peach basket", "Phog's ghostly remains"]
		},
		{ "id": "James Naismith",
		"room": "",
		"inventory": ["history", "Naismith's ghostly remains"]
		},
		{ "id": "Squirrel",
		"room": "",
		"inventory": ["nut"]
		}
	    ]

var campus =
    [ { "id": "lied-center",
	"where": "LiedCenter.jpg",
	"next": {"east": "eaton-hall", "south": "dole-institute"},
	"text": "You are outside the Lied Center.",
	"who": ""
      },
      { "id": "dole-institute",
	"where": "DoleInstituteofPolitics.jpg",
	"next": {"east": "allen-fieldhouse", "north": "lied-center"},
	"text": "You take in the view of the Dole Institute of Politics. This is the best part of your walk to Nichols Hall.",
	"who": ""
      },
      { "id": "eaton-hall",
	"where": "EatonHall.jpg",
	"next": {"east": "snow-hall", "south": "allen-fieldhouse", "west": "lied-center"},
	"text": "You are outside Eaton Hall. You should recognize here.",
	"who": ""
      },
      { "id": "snow-hall",
	"where": "SnowHall.jpg",
	"next": {"east": "strong-hall", "south": "ambler-recreation", "west": "eaton-hall"},
	"text": "You are outside Snow Hall. Math class? Waiting for the bus?",
	"who": ""
      },
      { "id": "strong-hall",
	"where": "StrongHall.jpg",
	"next": {"east": "outside-fraser", "north": "memorial-stadium", "west": "snow-hall"},
	"what": ["coffee"],
	"text": "You are outside Stong Hall.",
	"who": ["Bill", "George"]
      },
      { "id": "ambler-recreation",
	"where": "AmblerRecreation.jpg",
	"next": {"west": "allen-fieldhouse", "north": "snow-hall"},
	"text": "It's the starting of the semester, and you feel motivated to be at the Gym. Let's see about that in 3 weeks.",
	"who": ""
      },
      { "id": "outside-fraser",
  "where": "OutsideFraserHall.jpg",
	"next": {"west": "strong-hall","north":"spencer-museum"},
	"what": ["basketball"],
	"text": "On your walk to the Kansas Union, you wish you had class outside.",
	"who": ""
      },
      { "id": "spencer-museum",
	"where": "SpencerMuseum.jpg",
	"next": {"south": "outside-fraser","west":"memorial-stadium"},
	"what": ["art"],
	"text": "You are at the Spencer Museum of Art.",
	"who": ""
      },
      { "id": "memorial-stadium",
	"where": "MemorialStadium.jpg",
	"next": {"south": "strong-hall","east":"spencer-museum"},
	"what": ["ku flag"],
	"text": "Half the crowd is wearing KU Basketball gear at the football game.",
	"who": ""
      },
      { "id": "allen-fieldhouse",
	"where": "AllenFieldhouse.jpg",
	"next": {"north": "eaton-hall","east": "ambler-recreation","west": "dole-institute"},
	"text": "Rock Chalk! You're at the field house.",
	"who": ""
      },
	{ "id": "secret-room",
	  "where": "lab.jpg",
	  "next": {"leave lab": "eaton-hall"},
	  "text": "CS seniors don't have time to go to the game :(",
	  "what": ["student"],
	  "who": ""
	}
    ]
