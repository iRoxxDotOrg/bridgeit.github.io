//Replace text in the features table to prevent wrapping on devices with small screens
function replaceFeatureText() {
    var width = $(window).width();
    if (width <= 565) {
        $(".augRealityTxt").text('AugReality');
        $(".cloudPushTxt").text('Push');
    }
    else {
        $(".augRealityTxt").text('Augmented Reality');
        $(".cloudPushTxt").text('Cloud Push');
    }
}
$(document).ready(replaceFeatureText);
$(window).resize(replaceFeatureText);