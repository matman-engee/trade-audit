(function () {

    var serverURL = ip+project;
    /*
    var serverURL = "http://192.168.1.4:3000", // IMPORTANT: This URL needs to be accessible from your phone for testing.
        $scroller = $('.scroller'),
        */

        // Get List of images from server
        /*
        getFeed = function () {
            $scroller.empty();
            $.ajax({url: serverURL + "/images", dataType: "json", type: "GET"}).done(function (data) {
                var l = data.length;
                for (var i = 0; i < l; i++) {
                    $scroller.append('<img src="' + serverURL + '/' + data[i].fileName + '"/>');
                }
            });
        },
        */

        // Upload image to server
        upload = function (imageURI) {
            var ft = new FileTransfer(),
                options = new FileUploadOptions();

            options.fileKey = "file";
            options.fileName = 'filename.jpg'; // We will use the name auto-generated by Node at the server side.
            options.mimeType = "image/jpeg";
            options.chunkedMode = false;
            options.params = { // Whatever you populate options.params with, will be available in req.body at the server-side.
                "description": "Uploaded from my phone"
            };

            ft.upload(imageURI, serverURL + "/images",
                function (e) {
                    console.log("image upload success");
                    alert("Upload success");
                    //getFeed();
                },
                function (e) {
                    alert("Upload failed");
                }, options);
        },

        // Take a picture using the camera or select one from the library
        takePicture = function (e) {
            //alert(e);
            //alert(destinationType);
			alert("takePicture");
			//alert( Camera );

			/*
            if ( typeof Camera === "undefined" ){
                console.log("Esta función solo está disponible en el emulador de android o en un dispositivo real");
                return;
            }
			*/	
			
			alert("after if");
			
            var options = {
                quality: 45,
                targetWidth: 1000,
                targetHeight: 1000,
                destinationType: Camera.DestinationType.DATA_URL,
                encodingType: Camera.EncodingType.JPEG,
                sourceType: Camera.PictureSourceType.CAMERA
            };

            navigator.camera.getPicture(
                function (imageDATA) {
                    console.log(imageDATA);
                    alert("success");
                    //alert(imageDATA); // file:storage
                    //upload(imageURI);
                    //if ( destinationType == "DATA_URL" ){
                        object.data = "data:image/jpeg;base64," + imageDATA;
                    //}else{
                    //    object.data = imageDATA;
                    //}
                    //object.data = imageDATA;
                    object.index = 1; // TODO calcularlo a partir del event
                    viewModel.savePhoto( object );
                },
                function (message) {
                    console.log(message);
                    //alert("error:");
                    alert(message);
                    // We typically get here because the use canceled the photo operation. Fail silently.
                }, options);

            return false;

        };

    //$('.camera-btn').on('click', takePicture);
    $(document).on( "click", ".camera-btn", function(){
		alert("click captured");
		takePicture();
	});

    //getFeed();

}());

document.addEventListener("deviceready",onDeviceReady,false);

function onDeviceReady() {
    alert(navigator.camera);    
}