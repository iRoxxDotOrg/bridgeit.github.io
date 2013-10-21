var options = {
    render: 'image',
    ecLevel: 'H',
    minVersion:1,
    color: '#000',
    bgColor: '#FFF',
    text: (''+window.location).match(/.*\//) + 'mobile.html',
    size: 100,
    radius: 0,
    quiet: 0,
    
    mode: 0,
    
    label: 'no label',
    labelsize: 0.1,
    fontname: 'sans',
    fontcolor: $("#fontcolor").val(),
    
    image: null,
    imagesize: 0.1
};
$("#qrDeviceLink").qrcode(options);
