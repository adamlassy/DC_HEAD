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

var currentElement = "";

var bInit = false;

var arrAnswerType = [
	"Short",
	"Long",
	"Medium",
	"Interrupt"
];

var arrState = [
	"Wait for person",
	"Prompt person",
	"Listen to question",
	"Answer"
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

  /*
  if (_type == TYPE_WAIT) {
     	_loop = " loop";
  }
  */

  console.log("element>" + _element);
  console.log("element>" + _src);
  document.write('<video id="' + _element + '"' + _loop + ' style="display:' + _style + '" height="600"><source src="' + _src + '" type="video/mp4"></video>');

  /*
  //Dynamically create element
  var _v = document.createElement("video");
  var _s = document.createElement("source");

  _v.id = _element;
  _v.style = "display:" + _style;
  _v.height = 600;
  _s.type = "video/mp4";
  _s.src = _src;
  _v.appendChild(_s);
  //_v.preload = "none";

  document.getElementById("videos").appendChild(_v);
  */

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

	for (var i=0; i<clipsAnswer.length; i++)
	{ drawClip(i,clipsAnswer[i],initVideo); }

	for (var i=0; i<clipsAsk.length; i++)
	{ drawClip(i,clipsAsk[i],initVideo);}

	for (var i=0; i<clipsWait.length; i++)
	{ drawClip(i,clipsWait[i],initVideo); initVideo=false;}
}

function swapVideo(_element, _loop)
{
	console.log(_element + " looping : " + _loop);
	if (_element != currentElement)
	{
		nextVideo = document.getElementById(_element); // "v_0_0");
		nextVideo.loop = _loop;
		nextVideo.muted = _loop;
		//nextVideo.currentTime = 0;
		nextVideo.play();
        	nextVideo.style.display = "inline";
        	currentVideo.style.display = "none";
		currentVideo.pause();
		currentVideo = nextVideo;
		currentElement = _element;
	}
}

function initState()
{
	bInit = true;

	console.log("INIT VIDEO");

	state = STATE_WAIT;
  	document.getElementById('state').innerHTML = arrState[state];
	
	currentVideo = document.getElementById("v_0_0");
	currentVideo.play();
	currentVideo.loop = true;
	currentVideo.muted = true;
        currentVideo.style.display = "inline";
}

//Listen loop to change state
function listenLoop()
{
	//console.log("Looping");

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

			//console.log("NOT init");
			if (Date.now() - START_LISTEN_TIMESTAMP > SILENCE_TIMEOUT) {
				console.log("NO TALK")
				setState(STATE_WAIT);
			} else {
				listenLoop();
			}
		}
	}, 100);
}

function findAnswer()
{

	_selectedIndex = Math.floor(Math.random()*(clipsAnswer.length));

/*
	arrRank = [];

	_allTags = "";
	_out = (final_transcript + "  " + interim_transcript).toLowerCase();

	console.log("Out > " + _out);

	_selectedIndex = -1;
	_selectedTagCount = 0;

	//Index all the clips
	for (i=0; i<clipsAnswer.length; i++)
	{
		//Increment the rank of each Answer when we find Key words
		arrRank[i] = 0;
		_tags = "";
		_tagCount = 0;

		console.log("c>" + clipsAnswer[i].tags);
		for (j=0; j<clipsAnswer[i].tags.length; j++)
		{
			_tag = clipsAnswer[i].tags[j];
			console.log("a>" + _tag);
			if (_out.indexOf(_tag) >= 0) {
				console.log("find");
				_tags += _tag + ", ";
				_tagCount++;
				console.log("tag count : " + _tagCount);
			}
		}

		if (_tagCount > 0) {

			console.log("found");

			if (_tagCount > _selectedTagCount) {
				console.log("new find");
				_selectedIndex = i;
				_selectedTagCount = _tagCount;
			}
				console.log("new selected index: " + _selectedIndex);
			_allTags += "<div>" + clipsAnswer[i].name + " : " + _tags;
		}
	}

	if (_selectedIndex == -1) {
		_selectedIndex = 0; //Math.floor(Math.random()*(clipsAnswer.length+1));
	}

	//Sort Ranks
  	document.getElementById('tags').innerHTML = _allTags;
  	document.getElementById('answer').innerHTML = clipsAnswer[_selectedIndex].name;

	console.log("Find answer : " + _out);

*/

	return _selectedIndex;
}


function setState(_stateID)
{
	state = _stateID;
  	document.getElementById('state').innerHTML = arrState[_stateID];
 
	switch (state) {

    		case STATE_WAIT:

			//STOP LISTENING
			stopButton();
  			document.getElementById('tags').innerHTML = "";
  			document.getElementById('answer').innerHTML = "";

			_element = "v_" + TYPE_WAIT + "_" + waitIndex;
console.log("* SET WAIT VIDEO : " + _element);
			swapVideo(_element,true);
			waitIndex = incIndex(waitIndex,clipsWait.length);

			clearInput();

			break;

    		case STATE_ASK:
			_element = "v_" + TYPE_ASK + "_" + askIndex;
			swapVideo(_element,false);
			askIndex = incIndex(askIndex,clipsAsk.length);
			break;

    		case STATE_LISTEN:
			LISTEN_INIT = false;
			listenLoop();

			_element = "v_" + TYPE_WAIT + "_" + waitIndex;
			swapVideo(_element,true);
			waitIndex = incIndex(waitIndex,clipsWait.length);

			//Start google listen
			startButton();
			break;

    		case STATE_ANSWER:
			
			//Get Keywords and find answer
			_answerIndex = findAnswer();

			_element = "v_" + TYPE_ANSWER + "_" + _answerIndex;
			swapVideo(_element,false);
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

	if (bInit) {
          setState(STATE_WAIT);
	} else {
          initState(STATE_WAIT);
	}

   } else if (key == 66) {
        setState(STATE_WAIT);
   } else if (state == STATE_WAIT) {
        setState(STATE_ASK);
   }

   //startButton(e);
}

