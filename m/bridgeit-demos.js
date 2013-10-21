window.serviceHub = 'http://labs.icesoft.com/bridgeit-services/service';

/* App Store Redirect handling */
window.androidAppStoreLink = 'https://play.google.com/store/apps/details?id=org.icemobile.client.android.icemobilesx';
window.iosAppStoreLink = 'http://itunes.apple.com/us/app/icemobile-sx/id485908934?mt=8';
bridgeit.launchFailed = function(){
    alert('failure to launch');
    var appStoreLink = document.getElementById('appStoreLink');
    var iOS = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false );
    var android = navigator.userAgent.toLowerCase().indexOf('android') > -1;
    if( iOS ){
        appStoreLink.href = window.iosAppStoreLink;
    }
    else if( android ){
        appStoreLink.href = window.androidAppLink;
    }
    var popup = document.getElementById('getBridgeItPopup');
    popup.style.opacity = 0.9;
    popup.style.display = 'block';
}
function closeGetBridgeItPopup(){
    var popup = document.getElementById('getBridgeItPopup');
    popup.style.opacity = 0;
    popup.style.display = 'none';
}
function ajaxGet(url,cb){
    var request;
    if( window.XMLHttpRequest){
        request = new XMLHttpRequest();
    }
    else if( window.ActiveXObject ){
        try{
            request = new ActiveXObject("Msxml2.XMLHTTP");
        }
        catch(e){
            try{
                request = new ActiveXObject("Microsoft.XMLHTTP");
            }
            catch(e){}
        }
    }
    if( !request ){
        console.log("Unable to invoke XMLHttpRequest for " + url);
        return false;
    }
    request.onreadystatechange = function(){
        if (request.readyState === 4) {
            if (request.status === 200) {
                cb(request.responseText);
            } else {
                console.log("XMLHttpRequest for " + url +
                        " with status " + request.status);
            }
          }
    }
    request.open('GET', url);
    request.send();
}