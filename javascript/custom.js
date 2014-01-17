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

//**************** Mobile Demo Video ****************

// Helper method to find the correct video to play depending on the viewport size
function findCurrentVideo() {
    var video = null;
    $(".mobile-demo-video").each(function(){
        if($(this).is(':visible')) {
            var id = $(this).children('video').attr('id');
            video = document.getElementById(id);
        }
    })
    return video;
}

// When video ends go back to beginning so device is shown
$(document).ready(function() {
    var video = findCurrentVideo();
    if (video) {
        video.addEventListener('ended',function(){
            video.currentTime = 0;
            video.pause();
        });
    }
});

// Play video. Used for the link on the demo page
function playMobileDemoVideo() {
    var video = findCurrentVideo();
    video.play();
}

//***************************************************