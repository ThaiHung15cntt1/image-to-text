
// let option = {
//
//     // Entrance animation
//     // pulse, shake, slide-up, slide-down, slide-left, slide-right
//     animation: 'slide-up',
//
//     // Border and background color
//     color: 'White',
//
//     // Duration in milliseconds
//     duration: 5000,
//
//     // Custom position of the notification
//     position: { x: 'right', y: 'top' },
//
//     // first or last
//     stack: 'last',
//
//     // Callback
//     onClose: function(){}
// };


function openDecription(){
  var selectMethod = document.getElementById('selectMethod');
  var decriptonOCR = document.getElementById('decriptonOCR');
  var decriptonWriteHand = document.getElementById('decriptonWriteHand');
  if(selectMethod.value==1){
    decriptonWriteHand.style.display = "none";
    decriptonOCR.style.display = "block";
  }else{
    decriptonWriteHand.style.display = "block";
    decriptonOCR.style.display = "none";
  }
}
var count=0;
function openInputUrl(){
  var decriptonOCR = document.getElementById('decriptonOCR');
  var decriptonWriteHand = document.getElementById('decriptonWriteHand');
  decriptonWriteHand.style.display = "none";
  decriptonOCR.style.display = "none";

  var inputLink = document.getElementById('inputLink');
  var decriptonOCR = document.getElementById('decriptonOCR');
  var selectMethod = document.getElementById('selectMethod');

  //document.getElementById('btnOpenInputUrl').disabled=true;
  count++;
  if(count==1){
      inputLink.style.display = "block";
      decriptonOCR.style.display = "block";
    }
    else if(selectMethod.value==1){
        decriptonWriteHand.style.display = "none";
        decriptonOCR.style.display = "block";
    }
    else if(selectMethod.value==2){
      decriptonOCR.style.display = "none";
      decriptonWriteHand.style.display = "block";
    }
}

function openInputUrlFile(){
  var decriptonOCR = document.getElementById('decriptonOCR');
  var inputLink = document.getElementById('inputLink');
  var decriptonWriteHand = document.getElementById('decriptonWriteHand');
  // decriptonWriteHand.style.display = "none";
  // decriptonOCR.style.display = "none";
  //

  if(count==0){
      inputLink.style.display = "block";
      decriptonOCR.style.display = "block";
    }
    // else if(selectMethod.value==1){
    //     decriptonWriteHand.style.display = "none";
    //     decriptonOCR.style.display = "block";
    // }
    // else if(selectMethod.value==2){
    //   decriptonOCR.style.display = "none";
    //   decriptonWriteHand.style.display = "block";
    // }
  //
  // inputLink.style.display = "block";
  // decriptonOCR.style.display = "block";

  document.getElementById('my_file').click();
}

//imgur///////////////////////////
$("document").ready(function() {

  $('input[type=file]').on("change", function() {

    var $files = $(this).get(0).files;
    console.log($files[0].type);
    if ($files.length) {

      // Reject big files
      if ($files[0].size > $(this).data("max-size") * 1024) {
        console.log("Please select a smaller file");
        return false;
      }
      if($files[0].type!='image/png' && $files[0].type!='image/jpg' && $files[0].type!='image/jpeg'){
        openToast('file invalid');
        return false;
      }
      else{
        var areaText = document.getElementById("area-text");
        var boxImage = document.getElementById("boxImage");
        var analysisBox = document.getElementById("analysisBox");

        areaText.style.display = "none";
        boxImage.style.display = "none";
        analysisBox.style.display = "none";

        document.getElementById('inputImage').value = '';


        $("#loading").load('loading4.svg');
        $("#loading").css("display", "block");
        //scroll
          $('html').animate({
            scrollTop: 250
          },1000);

      // Begin file upload
      console.log("Uploading file to Imgur..");

      // Replace ctrlq with your own API key
      var apiUrl = 'https://api.imgur.com/3/image';
      var apiKey = '9def1b7394fea86';

      var settings = {

        crossDomain: true,
        processData: false,
        contentType: false,
        type: 'POST',
        url: apiUrl,
        headers: {
          Authorization: 'Client-ID ' + apiKey,
          Accept: 'application/json'
        },
        mimeType: 'multipart/form-data'
      };

      var formData = new FormData();
      formData.append("image", $files[0]);
      settings.data = formData;


      // Response contains stringified JSON
      // Image URL available at response.data.link
      $.ajax(settings).done(function(response) {
        $("#loading").css("display", "none");
       var dkm = JSON.parse(response);
       //$('#inputImage').attr('value', dkm.data.link);
       document.getElementById('inputImage').value = dkm.data.link;
        console.log(dkm.data.link);
      });
    }
    }
  });
});



function readBy(btn){
  //an tat ca thanh phan khi submit
  var areaText = document.getElementById("area-text");
  areaText.style.display = "none";
  var boxImage = document.getElementById("boxImage");
  boxImage.style.display = "none";
  var analysisBox = document.getElementById("analysisBox");
  analysisBox.style.display = "none";
  var inputImage = document.getElementById('inputImage');

  $("#loading").css("display", "none");

  var message = 'Please enter a valid URL.';
  var method = document.getElementById('selectMethod');
  inputImage.value==''? openToast(message) : method.value==1 ?  ocrButtonClick() : handwritingButtonClick() ;
}

function openToast(message) {
    var x = document.getElementById("snackbar");
    x.innerHTML=message;
    x.className="show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 4000);
}

function handwritingButtonClick() {
  //disable btn readBy
  document.getElementById('btnRead').disabled=true;
  setTimeout(function(){
    document.getElementById('btnRead').disabled=false;
  }, 5000);

  $("#loading").load('loading4.svg');
  $("#loading").css("display", "block");
    // Clear the display fields.

    $("#sourceImage").attr("src", "#");
    $("#responseTextArea").val("");
    // Display the image.
    var sourceImageUrl = $("#inputImage").val();
    $("#sourceImage").attr("src", sourceImageUrl);
    ReadHandwrittenImage(sourceImageUrl, $("#responseTextArea"));

    //scroll
    $('html').animate({
      scrollTop: 250
    },1000);
}

/* Recognize and read text from an image of handwriting at the specified URL by using Microsoft
* Cognitive Services Recognize Handwritten Text API.
* @param {string} sourceImageUrl - The URL to the image to analyze for handwriting.
* @param {<textarea> element} responseTextArea - The text area to display the JSON string returned
*                             from the REST API call, or to display the error message if there was
*                             an error.
*/
function ReadHandwrittenImage(sourceImageUrl, responseTextArea) {
    // Request parameters.
    var params = {
        "handwriting": "true",
    };

    // This operation requrires two REST API calls. One to submit the image for processing,
    // the other to retrieve the text found in the image.
    //
    // Perform the first REST API call to submit the image for processing.
$.ajax({
    url: common.uriBasePreRegion +
         $("#subscriptionRegionSelect").val() +
         common.uriBasePostRegion +
         common.uriBaseHandwriting +
         "?" +
         $.param(params),

    // Request headers.
    beforeSend: function(jqXHR){
        jqXHR.setRequestHeader("Content-Type","application/json");
        jqXHR.setRequestHeader("Ocp-Apim-Subscription-Key",
            encodeURIComponent($("#subscriptionKeyInput").val()));
    },

    type: "POST",

    // Request body.
    data: '{"url": ' + '"' + sourceImageUrl + '"}',
})

.done(function(data, textStatus, jqXHR) {
    // Show progress.
    responseTextArea.val("Handwritten image submitted.");

    // Note: The response may not be immediately available. Handwriting Recognition is an
    // async operation that can take a variable amount of time depending on the length
    // of the text you want to recognize. You may need to wait or retry this GET operation.
    //
    // Try once per second for up to ten seconds to receive the result.
    var tries = 10;
    var waitTime = 100;
    var taskCompleted = false;
    var count=0;

    var timeoutID = setInterval(function () {
        // Limit the number of calls.
        if (--tries <= 0) {
            window.clearTimeout(timeoutID);
            responseTextArea.val("The response was not available in the time allowed.");
            return;
        }

        // The "Operation-Location" in the response contains the URI to retrieve the recognized text.
        var operationLocation = jqXHR.getResponseHeader("Operation-Location");

        // Perform the second REST API call and get the response.
        $.ajax({
            url: operationLocation,

            // Request headers.
            beforeSend: function(jqXHR){
                jqXHR.setRequestHeader("Content-Type","application/json");
                jqXHR.setRequestHeader("Ocp-Apim-Subscription-Key",
                    encodeURIComponent($("#subscriptionKeyInput").val()));
            },

            type: "GET",
        })

        .done(function(data) {
            // If the result is not yet available, return.
            if (data.status && (data.status === "NotStarted" || data.status === "Running")) {
                return;
            }
            //loading svg
            $("#loading").css("display", "none");
            // Show formatted JSON on webpage.
            var response = data.recognitionResult;

            var text="";
              for(var i=0; i<response.lines.length; i++){
                for(var j=0; j<response.lines[i].words.length; j++){
                  text += data.recognitionResult.lines[i].words[j].text+" ";
                }
                text+='\n';
              }


            // if(count==0)
            //     callAPI(text);
            // count++;
             responseTextArea.val(text);

            // Indicate the task is complete and clear the timer.
            taskCompleted = true;
            window.clearTimeout(timeoutID);

            var areaText = document.getElementById("area-text");
            areaText.style.display = "block";
            var boxImage = document.getElementById("boxImage");
            boxImage.style.display = "block";
        })

        .fail(function(jqXHR, textStatus, errorThrown) {
            // Indicate the task is complete and clear the timer.
            taskCompleted = true;
            window.clearTimeout(timeoutID);

            // Display error message.
            var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
            errorString += (jqXHR.responseText === "") ? "" : (jQuery.parseJSON(jqXHR.responseText).message) ?
                jQuery.parseJSON(jqXHR.responseText).message : jQuery.parseJSON(jqXHR.responseText).error.message;
            $("#loading").css("display", "none");
            openToast(jQuery.parseJSON(jqXHR.responseText).message);
            //alert(errorString);
        });
    }, waitTime);
})

.fail(function(jqXHR, textStatus, errorThrown) {
    // Put the JSON description into the text area.
    responseTextArea.val(JSON.stringify(jqXHR, null, 2));

    // Display error message.
    var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
    errorString += (jqXHR.responseText === "") ? "" : (jQuery.parseJSON(jqXHR.responseText).message) ?
        jQuery.parseJSON(jqXHR.responseText).message : jQuery.parseJSON(jqXHR.responseText).error.message;
    $("#loading").css("display", "none");
      openToast(jQuery.parseJSON(jqXHR.responseText).message);
      //alert(errorString);
});
}






//////////////////////////
function ocrButtonClick() {
    /*disable btn read*/
    document.getElementById('btnRead').disabled=true;
    setTimeout(function(){
      document.getElementById('btnRead').disabled=false;
    }, 5000);

    $("#loading").load('loading4.svg');
    $("#loading").css("display", "block");
    // Clear the display fields.
    $("#sourceImage").attr("src", "#");
    $("#responseTextArea").val("");
    $("#captionSpan").text("");

    // Display the image.
    var sourceImageUrl = $("#inputImage").val();
    $("#sourceImage").attr("src", sourceImageUrl);

    ReadOcrImage(sourceImageUrl, $("#responseTextArea"));

    //scroll
    $('html').animate({
      scrollTop: 250
    },1000);
}
        function ReadOcrImage(sourceImageUrl, responseTextArea) {
    // Request parameters.
    var params = {
        "language": "unk",
        "detectOrientation ": "true",
    };

    // Perform the REST API call.
    $.ajax({
        url: common.uriBasePreRegion +
             $("#subscriptionRegionSelect").val() +
             common.uriBasePostRegion +
             common.uriBaseOcr +
             "?" +
             $.param(params),

        // Request headers.
        beforeSend: function(jqXHR){
            jqXHR.setRequestHeader("Content-Type","application/json");
            jqXHR.setRequestHeader("Ocp-Apim-Subscription-Key",
                encodeURIComponent($("#subscriptionKeyInput").val()));
        },

        type: "POST",


        // Request body.
        data: '{"url": ' + '"' + sourceImageUrl + '"}',
    })

    .done(function(data) {
        // Show formatted JSON on webpage.
        var response = data.regions[0];
        console.log(response.lines.length);
        // for(var i=0; i<response.lines.length; i++)
        //     console.log(i);

        var text="";
        for(var i=0; i<response.lines.length; i++){
          for(var j=0; j<response.lines[i].words.length; j++){
              text += data.regions[0].lines[i].words[j].text+" ";
          }
          text+='\n';
        }


          callAPI(text)
          var areaText = document.getElementById("area-text");
          var boxImage = document.getElementById("boxImage");
          var analysisBox = document.getElementById("analysisBox");

          setTimeout(function(){
            $("#loading").css("display", "none");
            areaText.style.display = "block";
            analysisBox.style.display = "block";
            boxImage.style.display = "block";}, 990);

            responseTextArea.val(text);
        })

      .fail(function(jqXHR, textStatus, errorThrown) {
          // Put the JSON description into the text area.
          responseTextArea.val(JSON.stringify(jqXHR, null, 2));

          // Display error message.
          var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
          errorString += (jqXHR.responseText === "") ? "" : (jQuery.parseJSON(jqXHR.responseText).message) ?
              jQuery.parseJSON(jqXHR.responseText).message : jQuery.parseJSON(jqXHR.responseText).error.message;
          $("#loading").css("display", "none");
          openToast(jQuery.parseJSON(jqXHR.responseText).message);
          //alert(errorString);
        });
      }


  function callAPI(text) {

      var documents = {"documents": [
         {
             "id": "1",
             "text": text
         },
     ]};
        var params = {
            // Request parameters
            "numberOfLanguagesToDetect": 0,
        };

        $.ajax({
            url: "https://westcentralus.api.cognitive.microsoft.com/text/analytics/v2.0/languages?" + $.param(params),
            beforeSend: function(xhrObj){
                // Request headers
                //xhrObj.setRequestHeader("Content-Type","application/json");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key",encodeURIComponent("7fd065baec1847eda695a7c41720a3aa"));
            },
            type: "POST",
            // Request body
            data: JSON.stringify(documents),
            contentType: "application/json",
        })
        .done(function(data) {
          var language = data.documents[0].detectedLanguages[0].name;
          var score = data.documents[0].detectedLanguages[0].score;
          var percent=score*100;
          $('#region').text(language);
          move(percent);
          console.log(score);
        })
        .fail(function() {
            $("#loading").css("display", "none");
            openToast('error');
            //alert("error");
        });
    }

function move(percent) {
  var elem = document.getElementById("myBar");
  var width = 1;
  var id = setInterval(frame, 10);
  function frame() {
    if (width >= percent) {
      clearInterval(id);
    } else {
      width++;
      elem.style.width = width + '%';
      $('#myBar').text(width + "%");
    }
  }
}
