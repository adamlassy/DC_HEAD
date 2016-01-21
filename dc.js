
if (!('webkitSpeechRecognition' in window)) {

  upgrade();
} else {

  //start_button.style.display = 'inline-block';
  var recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = function() {
    recognizing = true;
    showInfo('info_speak_now');
  };

  recognition.onerror = function(event) {
    console.log("on error");

    if (event.error == 'no-speech') {
      start_img.src = '//www.google.com/intl/en/chrome/assets/common/images/content/mic.gif';
      showInfo('info_no_speech');
      ignore_onend = true;
    }
    if (event.error == 'audio-capture') {
      start_img.src = '//www.google.com/intl/en/chrome/assets/common/images/content/mic.gif';
      showInfo('info_no_microphone');
      ignore_onend = true;
    }
    if (event.error == 'not-allowed') {
      if (event.timeStamp - start_timestamp < 100) {
        showInfo('info_blocked');
      } else {
        showInfo('info_denied');
      }
      ignore_onend = true;
    }
  };

  recognition.onend = function() {
    console.log("on end");

    recognizing = false;
    if (ignore_onend) {
      showInfo('ignore on end');
      return;
    }
    if (!final_transcript) {
      showInfo('info_start');
      return;
    }
    showInfo('on end');
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
      var range = document.createRange();
      range.selectNode(document.getElementById('final_span'));
      window.getSelection().addRange(range);
    }
  };

  recognition.onresult = function(event) {

    //console.log("on result: " + typeof(event.results));
    LISTEN_INIT = true;
    LAST_TALK_TIMESTAMP = Date.now();

    interim_transcript = '';
    if (typeof(event.results) == 'undefined') {
      recognition.onend = null;
      recognition.stop();
      upgrade();
      return;
    }
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final_transcript += event.results[i][0].transcript;
      } else {
        interim_transcript += event.results[i][0].transcript;
      }
    }
    final_transcript = final_transcript; //capitalize(final_transcript);
    final_span.innerHTML = linebreak(final_transcript);
    interim_span.innerHTML = linebreak(interim_transcript);
  };
}

function upgrade() {
  //start_button.style.visibility = 'hidden';
  showInfo('info_upgrade');
}

function linebreak(s) {
  return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

var first_char = /\S/;
function capitalize(s) {
  return s.replace(first_char, function(m) { return m.toUpperCase(); });
}

//function startButton(event) {
function startButton() {

  if (recognizing) {
    recognition.stop();
    return;
  }

  final_transcript = '';
  recognition.lang = ""; //select_dialect.value;
  recognition.start();
  ignore_onend = false;
  final_span.innerHTML = '';
  interim_span.innerHTML = '';
  showInfo('info_allow');
  start_timestamp = Date.now(); //UNIX_Timestamp * 1000; //Date().getTime(); //event.timeStamp;

  START_LISTEN_TIMESTAMP = start_timestamp;
  console.log(start_timestamp);

}

function clearInput()
{
	final_transcript = '';
	interim_transcript = '';

	final_span.innerHTML = "";
    	interim_span.innerHTML = "";

	return;
}

function stopButton()
{
	recognition.stop();

	return;
}


function showInfo(s) {

  console.log("R>" + s);
  //document.getElementById('info').innerHTML = s;
}

//VIDEO CONTROLS
function playPause() {
    if (myVideo.paused)
        myVideo.play();
    else
        myVideo.pause();
}

function next() {
        myVideo.pause();
        myVideo.style.display = "none";

        index++;

        if (index > 6) { index= 1;}
        myVideo = document.getElementById("v"+index);
        myVideo.style.display = "inline"; //"block";
        myVideo.play();
}
