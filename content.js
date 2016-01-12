var TYPE_WAIT = 0;
var TYPE_ASK = 1;
var TYPE_ANSWER = 2;

var STATE_WAIT = 0;
var STATE_ASK = 1;
var STATE_LISTEN = 2;
var STATE_ANSWER = 3;

var waitIndex = 0;
var askIndex = 0;
var answerIndex = 0;

var _state = STATE_WAIT;

var currentVideo;
var nextVideo;

var arrState = [
	"Wait",
	"Ask",
	"Listen",
	"Answer"
];

var clipsWait = [

	{
		type:0,
		name:"hold_0",
		src:"videos/wait_1.mp4"
	},
	{
		type:0,
		name:"hold_1",
		src:"videos/wait_1.mp4"
	}
];

var clipsAsk = [
	{
		type:1,
		name:"ask_0",
		src:"videos/ask_0.mp4"
	},
	{
		type:1,
		name:"ask_1",
		src:"videos/ask_1.mp4"
	},
	{
		type:1,
		name:"ask_2",
		src:"videos/ask_2.mp4"
	},
	{
		type:1,
		name:"ask_3",
		src:"videos/ask_3.mp4"
	},
	{
		type:1,
		name:"ask_4",
		src:"videos/ask_4.mp4"
	}
];

var clipsAnswer = [
/*
	{
		type: 2,
		name: "answer_0",
		src: "videos/answer_0.mp4",
		tags: [
			"fuck you", "asshole", "shit head", "test", "hello", "bottle"
		]
	},
	{
		type: 2,
		name: "answer_1",
		src: "videos/answer_1.mp4",
		tags: [
			"mr show", "mister show", "bob", "hello", "breasts", "boobs"
		]
	},
*/
	{
		type: 2,
		name: "answer_2",
		src: "videos/answer_2.mp4",
		tags: [
			"nudity", "tasteful", "obscene", "family friendly", "david"
		]
	},
	{
		type: 2,
		name: "answer_3",
		src: "videos/answer_3.mp4",
		tags: [
			"truck", "motorcycle"
		]
	},
	{
		type: 2,
		name: "answer_4",
		src: "videos/answer_4.mp4",
		tags: [
			"cats", "dogs", "pets"	
		] 
	},
	{
		type: 2,
		name: "answer_5",
		src: "videos/answer_5.mp4",
		tags: [
			"taco bell", "burgerking", "hamburger", "tacos"
		]
	}
];

function endAskVideo(e)
{
  	console.log("end ask");
	setState(STATE_LISTEN);
}

function endAnswerVideo(e)
{
  	console.log("end answer");
	setState(STATE_WAIT);
}

function onVideoLoad(e)
{
	console.log("load: " + e);
}

function drawClip(_index, _obj, _init)
{
  _loop = ""; 
  _name = _obj.name;
  _src = _obj.src;
  _type = _obj.type;

  _element = "v_" + _type + '_' + _index;

  _style = "none";
  if (_init == true) {
    _style = "inline";
  }

  if (_type == TYPE_WAIT) {
     	_loop = " loop";
  }

  console.log("element>" + _element);
  document.write('<video id="' + _element + '"' + _loop + ' style="display:' + _style + '" width="640" height="360"><source src="' + _src + '" type="video/mp4"></video>');

  //Add Event Listener
  switch (_type) {

    case TYPE_ASK:
	document.getElementById(_element).addEventListener('ended',endAskVideo,false);
	break;

    case TYPE_ANSWER:
	document.getElementById(_element).addEventListener('ended',endAnswerVideo,false);
	break;
  }

  document.getElementById(_element).addEventListener('loadeddata',onVideoLoad,false);
}

function initContent()
{
	var initVideo = true;

	for (var i=0; i<clipsWait.length; i++)
	{ drawClip(i,clipsWait[i],initVideo); initVideo=false;}

	for (var i=0; i<clipsAsk.length; i++)
	{ drawClip(i,clipsAsk[i],initVideo);}

	for (var i=0; i<clipsAnswer.length; i++)
	{ drawClip(i,clipsAnswer[i],initVideo); }
}

function swapVideo(_element)
{
	console.log(_element);

	nextVideo = document.getElementById(_element); // "v_0_0");
	nextVideo.play();
        nextVideo.style.display = "inline";

	currentVideo.pause();
        currentVideo.style.display = "none";

	currentVideo = nextVideo;	
}

function initState()
{
	console.log("INIT VIDEO");

	state = STATE_WAIT;
  	document.getElementById('state').innerHTML = arrState[state];
	
	currentVideo = document.getElementById("v_0_0");
	currentVideo.play();
        currentVideo.style.display = "inline";
}

//Listen loop to change state
function listenLoop()
{
	console.log("Looping");

	setTimeout(function () {

		//IF WE STARTED TALKING, WAIT TILL 3 SECOND DELAY
		if (LISTEN_INIT == true) {

			console.log("Time diff : " + (Date.now() - LAST_TALK_TIMESTAMP));
			if (Date.now() - LAST_TALK_TIMESTAMP > QUESTION_TIMEOUT) {

				console.log("Talk Timeout");
				setState(STATE_ANSWER);
	
			} else {

				listenLoop();
			}
  
		//IF WE HAVENT
		}  else {

			console.log("NOT init");
			if (Date.now() - START_LISTEN_TIMESTAMP > SILENCE_TIMEOUT) {
				setState(STATE_WAIT);
			} else {
				listenLoop();
			}
		}
	}, 1000);
}

function findAnswer()
{
	arrRank = [];

	_tags = "";
	_out = (final_transcript + "  " + interim_transcript).toLowerCase();

	console.log("Out > " + _out);

	//Index all the clips
	for (i=0; i<clipsAnswer.length; i++)
	{
		//Increment the rank of each Answer when we find Key words
		arrRank[i] = 0;
		_tags += "<div>" + clipsAnswer[i].name + " : ";

		console.log("c>" + clipsAnswer[i].tags);
		for (j=0; j<clipsAnswer[i].tags.length; j++)
		{
			_tag = clipsAnswer[i].tags[j];
			console.log("a>" + _tag);
			if (_out.indexOf(_tag) >= 0) {
				console.log("find");
				_tags += _tag + " ";
				arrRank[i]++;
			}
		}
		_tags += "</div>";
	}

	//Sort Ranks
	if (arrRank.length > 0) {
		highVal = 0;
		highIndex = 0;
		for (i=0; i<arrRank.length; i++)
		{
			
		}

	} else {
		//No tagged files
	}


  	document.getElementById('tags').innerHTML = _tags;
	console.log("Find answer : " + _out);
}


function setState(_stateID)
{
	state = _stateID;
  	document.getElementById('state').innerHTML = arrState[_stateID];
 
	switch (state) {

    		case STATE_WAIT:
			//STOP LISTENING
			stopButton();

			_element = "v_" + TYPE_WAIT + "_" + waitIndex;
			swapVideo(_element);
			waitIndex = incIndex(waitIndex,clipsWait.length);

			clearInput();

			break;

    		case STATE_ASK:
			_element = "v_" + TYPE_ASK + "_" + askIndex;
			swapVideo(_element);
			askIndex = incIndex(askIndex,clipsAsk.length);
			break;

    		case STATE_LISTEN:
			LISTEN_INIT = false;
			listenLoop();

			_element = "v_" + TYPE_WAIT + "_" + waitIndex;
			swapVideo(_element);
			waitIndex = incIndex(waitIndex,clipsWait.length);

			//Start google listen
			startButton();
			break;

    		case STATE_ANSWER:
			
			//Get Keywords and find answer
			findAnswer();

			_element = "v_" + TYPE_ANSWER + "_" + answerIndex;
			swapVideo(_element);
			answerIndex = incIndex(answerIndex,clipsAnswer.length);

			//STOP LISTENING
			stopButton();

			break;
  	}
}

function incIndex(_i, _total)
{
	_i++;

	if (_i >= _total) {
		_i = 0;
	}
	return _i;
}

window.onkeydown = function(e) {

   var key = e.keyCode ? e.keyCode : e.which;

   console.log("KEY");
   console.log(key);

   if (key == 65) {
        initState(STATE_WAIT);
   } else if (key == 66) {
        setState(STATE_WAIT);
   } else if (state == STATE_WAIT) {
        setState(STATE_ASK);
   }

   //startButton(e);
}

