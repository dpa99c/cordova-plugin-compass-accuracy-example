var platform, compassWatchId;

function onDeviceReady(){
    platform = cordova.platformId;
    $('body').addClass(platform);
}


function startMonitoring(){
    cordova.plugins.compassAccuracy.startMonitoring(handleStartResult, function(error){
            onError("Error starting monitoring: " + JSON.stringify(error));
        }
    );
}

function handleStartResult(result){
    if(result.type === cordova.plugins.compassAccuracy.RESULT_TYPE.STARTED){
        $('body').addClass("startedMonitoring");
        handleSuccess("Started monitoring accuracy");
    }
    if(result.accuracy !== undefined){
        handleSuccess("Accuracy changed: " + result.accuracy);
    }
}

function stopMonitoring(){
    cordova.plugins.compassAccuracy.stopMonitoring(function(){
            $('body').removeClass("startedMonitoring");
            handleSuccess("Stopped monitoring accuracy");
        }, function(error){
            onError("Error stopping monitoring: " + JSON.stringify(error));
        }
    );
}

function startCompass(){
    compassWatchId = navigator.compass.watchHeading(onHeadingUpdate, onError, {frequency: 100});
}

function stopCompass(){
    navigator.compass.clearWatch(compassWatchId);
    onHeadingUpdate({trueHeading: 0});
}

function onHeadingUpdate(heading){
    var currentHeading = parseInt(heading.trueHeading)
    $('#compass .data .heading').text(currentHeading + "°");
    $('#compass .bezel').css('transform', 'rotate(' + currentHeading + 'deg)');
}

function onError(error){
    var msg = "An error occurred: " + error;
    console.error(msg);
    alert(msg);
}

function handleSuccess(msg){
    console.log(msg);
}

$(document).on("deviceready", onDeviceReady);
