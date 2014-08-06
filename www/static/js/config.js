//var ip = "http://192.168.1.119/";
var ip = "http://192.168.1.201/";
//var ip = "http://190.210.44.17/";
var project = "auditoria/rest/";

if(!window.devicePixelRatio){
    var pixelRatio = 1;
}
if( (navigator.userAgent.indexOf('iPad') > 0 || navigator.userAgent.indexOf('iPhone') > 0) && window.devicePixelRatio >= 2){
    pixelRatio = 1;
}
else{
    var pixelRatio = window.devicePixelRatio;
}
var bigscreen = Math.max(screen.width,screen.height) / pixelRatio;

//console.log(window.devicePixelRatio);
//console.log(bigscreen);