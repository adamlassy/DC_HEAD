/*
var TYPE_WAIT = 0;
var TYPE_ASK = 1;
var TYPE_ANSWER = 2;
var TYPE_INTERRUPT = 3;
var TYPE_HERES_ANSWER = 4;
var TYPE_OUTBURST = 5;
var TYPE_SHORT = 6;
var TYPE_MEDIUM = 7;
var TYPE_LONG = 8;
var TYPE_LISTEN = 9;
*/

var CONTENT_TYPE_SHORT = 0;
var CONTENT_TYPE_MEDIUM = 1;
var CONTENT_TYPE_LONG = 2;
var CONTENT_TYPE_INTERRUPTING = 3;
var _currentContentType = CONTENT_TYPE_MEDIUM;

var STATE_WAIT = 0;
var STATE_ASK = 1;
var STATE_LISTEN = 2;
var STATE_ANSWER = 3;
var STATE_BLURT = 5;
var STATE_CROWD = 4;

var waitIndex = 0;
var askIndex = 0;
var answerIndex = 0;
var blurtIndex = 0;

var _state = STATE_WAIT;

var currentVideo;
var nextVideo;

var currentElement = "";

var bInit = false;

var _max = 3;
var arrMax = [];
var answerHash = [];

var askOffset = 0
var answerOffset = 0

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
	"Answer",
	"People Present",
	"Shout"
];


function endAskVideo(e)
{
  	console.log("end ask");
	setState(STATE_CROWD);
}

function endAnswerVideo(e)
{
  	console.log("end answer");
	setState(STATE_CROWD);
}

function endBlurtVideo(e)
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

  console.log("element>" + _element);
  console.log("element>" + _src);
  //document.write('<video id="' + _element + '"' + _loop + ' style="display:' + _style + '" height="400"><source src="' + _src + '" type="video/mp4"></video>');

  //Dynamically create element
  var _v = document.createElement("video");
  var _s = document.createElement("source");
  var _d = document.createElement("div");

  _d.id = "c_" + _element;
  _v.id = _element;
  _v.height = 600;
  _s.type = "video/mp4";
  _s.src = _src;
  _v.appendChild(_s);
  _v.preload = "none";

  //$(_d).append(_v);
  //$("videos").append(_d);

  _v.load();
 
  document.getElementById("videos").appendChild(_d);
  _d.appendChild(_v);
  
  if (_init != true) {
    $(_d).hide();
  }

  //Add Event Listener
  switch (_type) {

    case TYPE_ASK:
	
document.getElementById(_element).addEventListener('ended',endAskVideo,false);
	break;

    case TYPE_ANSWER:
	document.getElementById(_element).addEventListener('ended',endAnswerVideo,false);
	break;

    case TYPE_BLURT:
	document.getElementById(_element).addEventListener('ended',endBlurtVideo,false);
	break;
  }
  document.getElementById(_element).addEventListener('loadeddata',onVideoLoad,false);

}

function getOffset(_max)
{
	return Math.floor(Math.random() * _max);
}

function initContent()
{
	var initVideo = true;

	drawClip(0,clipsWait[0],initVideo); initVideo=false;

	arrMax[TYPE_LISTEN] = Math.min(clipsListening.length,_max);
	for (var i=0; i<Math.min(clipsListening.length,_max); i++)
	{ 
		drawClip(i,clipsListening[i],initVideo);
	}
	
	arrMax[TYPE_BLURT] = Math.min(clipsBlurt.length,_max);
	for (var i=0; i<Math.min(clipsBlurt.length,_max); i++)
	{ drawClip(i,clipsBlurt[i],initVideo);}

        if (_currentContentType == CONTENT_TYPE_SHORT)
	{
		answerOffset = Math.floor(Math.random()*clipsShort.length) -_max;
		if (answerOffset<0) {answerOffset = 0;}

		for (var i=0; i<_max; i++)
		{ 
			_ti = i+answerOffset;
			drawClip(_ti,clipsShort[_ti],initVideo); 
		}
	}
        if (_currentContentType == CONTENT_TYPE_MEDIUM)
	{	
		answerOffset = Math.floor(Math.random()*clipsMedium.length)-_max;
		if (answerOffset<0) {answerOffset = 0;}
		
		for (var i=0; i<_max; i++)
		{ 
			_ti = i+answerOffset;
			drawClip(_ti,clipsMedium[_ti],initVideo); 
		}
	}
        if (_currentContentType == CONTENT_TYPE_LONG)
	{	
		answerOffset = 0; //Math.floor(Math.random()*(clipsLong.length-_max));
		
		for (var i=0; i<_max; i++)
		{ 
			_ti = i+answerOffset;
			drawClip(_ti,clipsLong[_ti],initVideo); 
		}
	}
        if (_currentContentType == CONTENT_TYPE_INTERRUPTING)
	{	
		arrMax[TYPE_ANSWER] = Math.min(clipsInterrupting.length,_max);
		for (var i=0; i<Math.min(clipsInterrupting.length,_max); i++)
		{ drawClip(i,clipsInterrupting[i],initVideo); }
	}

	askOffset = Math.floor(Math.random()*clipsAsk.length);
	_ti = askOffset;
	drawClip(_ti,clipsAsk[_ti],initVideo);
}

function swapVideo(_element, _loop)
{
	if (_element != currentElement)
	{
		console.log("inside" + _element);
		nextVideo = document.getElementById(_element); // "v_0_0");
		nextVideo.loop = _loop;
		//nextVideo.muted = _loop;
		nextVideo.currentTime = 0;

console.log("is loaded:" + nextVideo.readyState);
/*
		if ( nextVideo.readyState !== 4 ) {
			nextVideo.load();	
		}
*/
		nextVideo.play();

		$("#c_" + _element).show();

		console.log("show #c_" + _element);
		console.log("hide #c_"+ currentElement);

		$("#c_"+ currentElement).hide();

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

        currentElement = "v_0_0";
	
	currentVideo = document.getElementById(currentElement);
	currentVideo.play();
	currentVideo.loop = true;
	currentVideo.muted = true;
        //currentVideo.style.display = "inline";
}

//Listen loop to change state
function listenLoop()
{

	setTimeout(function () {

		//IF WE STARTED TALKING, WAIT TILL 3 SECOND DELAY
		if (LISTEN_INIT == true) {

			//console.log("Time diff : " + (Date.now() - LAST_TALK_TIMESTAMP));
			if (Date.now() - LAST_TALK_TIMESTAMP > QUESTION_TIMEOUT) {

				console.log("Talk Timeout");
				setState(STATE_ANSWER);
	
			} else {

				listenLoop();
			}
  
		//IF WE HAVENT
		}  else {

			/*
			//console.log("NOT init");
			if (Date.now() - START_LISTEN_TIMESTAMP > SILENCE_TIMEOUT) {
				console.log("NO TALK")
				setState(STATE_WAIT);
			} else {
				listenLoop();
			}
			*/
			listenLoop();

		}
	}, 100);
}

function findAnswer()
{

	if (_currentContentType != CONTENT_TYPE_LONG )
	{
		_selectedIndex = Math.floor(Math.random()*_max) + answerOffset;
		console.log("found : " + _max + " " + _selectedIndex);

	} else {

	arrRank = [];

	_allTags = "";
	_out = (final_transcript + "  " + interim_transcript).toLowerCase();

	console.log("Out > " + _out);

	_selectedIndex = -1;
	_selectedTagCount = 0;

	//Index all the clips
	for (i=0; i<_max; i++)
	{
		//Increment the rank of each Answer when we find Key words
		arrRank[i] = 0;
		_tags = "";
		_tagCount = 0;

		console.log("c>" + clipsLong[i].tags);
		for (j=0; j<clipsLong[i].tags.length; j++)
		{
			_tag = clipsLong[i].tags[j];
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
			_allTags += "<div>" + clipsLong[i].name + " : " + _tags;
		}
	}

	if (_selectedIndex == -1) {
		//_selectedIndex = 0; //Math.floor(Math.random()*(clipsAnswer.length+1));
		_selectedIndex = Math.floor(Math.random()*_max) + answerOffset;
	}

	//Sort Ranks
  	document.getElementById('tags').innerHTML = _allTags;
  	document.getElementById('answer').innerHTML = clipsLong[_selectedIndex].name;

	console.log("Find answer : " + _out);
	
	}

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

			_element = "v_" + TYPE_WAIT + "_" + 0;
console.log("* SET WAIT VIDEO : " + _element);
			swapVideo(_element,true);
			//waitIndex = incIndex(waitIndex,arrMax[TYPE_WAIT]);

			clearInput();
			break;

    		case STATE_ASK:
			_element = "v_" + TYPE_ASK + "_" + askOffset;
console.log("ASK : " + _element);

			swapVideo(_element,false);
			//askIndex = incIndex(askIndex,arrMax[TYPE_ASK]);
			break;

    		case STATE_LISTEN:
			//listenLoop();
			_listenIndex = 0;

			_element = "v_" + TYPE_LISTEN + "_" + _listenIndex;
			swapVideo(_element,true);
			//waitIndex = incIndex(waitIndex,arrMax[TYPE_LISTEN]);

			break;

    		case STATE_ANSWER:
			
			//Get Keywords and find answer
			_answerIndex = findAnswer();

			_element = "v_" + TYPE_ANSWER + "_" + _answerIndex;
			swapVideo(_element,false);
			answerIndex = incIndex(answerIndex,arrMax[TYPE_ANSWER]); //clipsAnswer.length);

			//STOP LISTENING
			stopButton();

			break;


		case STATE_BLURT:

			_element = "v_" + TYPE_BLURT + "_" + blurtIndex;
			swapVideo(_element,false);
			blurtIndex = incIndex(blurtIndex,arrMax[TYPE_BLURT]);

			break;

		case STATE_CROWD:

			//STOP LISTENING
			stopButton();

			LISTEN_INIT = false;
			listenLoop();

			_element = "v_" + TYPE_WAIT + "_" + 0;
			swapVideo(_element,true);
			//waitIndex = incIndex(waitIndex,arrMax[TYPE_WAIT]);

			//Start google listen
			startButton();
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

   } else if (key == 67 && state == STATE_WAIT) {
   console.log("GO TO BLURT");
        setState(STATE_BLURT);

   } else if (key == 66 && state == STATE_WAIT) {
        setState(STATE_ASK);
   }

}

