var platform, compassWatchId;

function onDeviceReady(){
    platform = cordova.platformId;
    $('body').addClass(platform);
}


function startMonitoring(){
    var requiredAccuracy = $('#requiredAccuracy').val();
    cordova.plugins.compassAccuracy.startMonitoring(onAccuracyResult, function(error){
            onError("Error starting monitoring: " + JSON.stringify(error));
        }, requiredAccuracy);
}

function onAccuracyResult(result){
    if(result.type === cordova.plugins.compassAccuracy.RESULT_TYPE.STARTED){
        $('body').addClass("startedMonitoring");
        log("Started monitoring accuracy");
    }
    if(result.currentAccuracy !== undefined){
        log("Accuracy changed: " + result.currentAccuracy);
        $('#current-accuracy .value').text(result.currentAccuracy);
    }
    console.dir(result);
}


function stopMonitoring(){
    cordova.plugins.compassAccuracy.stopMonitoring(function(){
            $('body').removeClass("startedMonitoring");
            log("Stopped monitoring accuracy");
        }, function(error){
            onError("Error stopping monitoring: " + JSON.stringify(error));
        }
    );
}

function simulateAccuracyChange(){
    var simulatedAccuracy = $('#simulatedAccuracy').val();
    cordova.plugins.compassAccuracy.simulateAccuracyChange(simulatedAccuracy, function(){
            log("Simulated accuracy change to " + simulatedAccuracy);
        }, function(error){
            onError("Error simulating accuracy change: " + JSON.stringify(error));
        }
    );
}

// for use from the console
window.setSimulatedAccuracyAndChange = function (accuracy){
    $('#simulatedAccuracy').val(accuracy);
    simulateAccuracyChange();
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

function log(msg){
    console.log(msg);
}

$(document).on("deviceready", onDeviceReady);
