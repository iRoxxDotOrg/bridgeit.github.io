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

// Replace image with youtube video on click
$(document).ready(function() {
    $(".getting-started-video img").click(function(e) {
        e.preventDefault();
        var imgWidth = $(".getting-started-video img").width();
        var imgHeight = $(".getting-started-video img").height();
        $(".getting-started-video").html
        ("<iframe width='" + imgWidth + "' height='" + imgHeight + "' src='http://www.youtube.com/embed/W6rAjNIQIdA?vq=large&autoplay=1&rel=0' frameborder='0' allowfullscreen></iframe>");
    });
});