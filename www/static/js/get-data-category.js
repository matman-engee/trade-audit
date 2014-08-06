var viewModel = null;

$(document).ready(function(){
	var audit_id 		  = localStorage.getItem("audit_id");
	var audit_category_id = localStorage.getItem("audit_category_id");
	$.ajax({
		//url: 'http://localhost/test/Auditoria/nueva.php',
		url: ip+project+"audits/getAuditCategory/"+audit_id+"/"+audit_category_id+".json",
		success: function(data,status){
			console.log("success");
			console.log(data);	// Unexpected token : 
			viewModel = new ViewModel( data.response.DATA );
			console.log(viewModel);
			setTimeout(ko.applyBindings(viewModel), 1000);
		},
		error: function(data){
			console.log("error");
			console.log(data);
		}	
	});

	/*
	$.ajaxPrefilter( "json script", function( options ) {
  		options.crossDomain = true;
	});
	*/

	/* Esta linea en chrome no anda si se ejecuta fuera de un server */
	$(".templates").load("question-templates.html");
});

function ViewModel(data){
	var self = this;
	self.audit 		= ko.observable( new Audit(data.Audit) );
	self.auditCategories = ko.observableArray( $.map( data.AuditCategory || [], function(data){return new AuditCategory(data)}) );
	//self.auditCategories = ko.observableArray( new AuditCategory(data.AuditCategory) );	
	self.branch		= ko.observable( new Branch( data.Branch ) );
	self.manager	= ko.observable( new Manager( data.Manager ) );
	self.poll_id	= ko.observable( self.audit().poll_id );
	self.region 	= ko.observable( new Region( data.Branch.Region || { id: 1, name: "hola"} ) );
	self.category 	= ko.observable( self.auditCategories()[0].category() );
	self.questions 	= ko.computed( function(){
		if ( self.auditCategories() &&
			 self.auditCategories().length > 0 &&
			 self.auditCategories()[0].category() &&
			 self.auditCategories()[0].category().categoryQuestions() ){
			return self.auditCategories()[0].category().categoryQuestions();
		}else{
			return [];
		}
	});
	
	/* atajo */
	self.observation = 	self.auditCategories() && 
						self.auditCategories()[0] &&
						self.auditCategories()[0].observation;
	

	self.cancel = function(){
		window.location = "nueva-auditoria-2.html";
	}

	self.prepare = function(){
		return JSON.stringify({ 
			Audit: JSON.parse( self.audit().prepare() ),
			AuditCategory: JSON.parse( self.auditCategories()[0].prepare() )
		});
	}

	self.save = function(){
		$.ajax({
			//url: 'http://localhost/test/Auditoria/nueva.php',
			url: ip+project+"audits/saveAuditCategory.json",
			type: "post",
			dataType: "json",
			data: self.prepare(),
			success: function(data,status){
				console.log("success");
				console.log(data);	// Unexpected token : 
				window.location = "nueva-auditoria-2.html";
			},
			error: function(data){
				console.log("error");
				console.log(data);
			}	
		});		
	}

	self.savePhoto = function(data){
		// esto funciona pero solo admite una imagen
		//alert("data.index: "+data.index);
		self.auditCategories()[0].category().categoryQuestions()[data.index].auditResponse().value(data.data);
	}
}

var files = [];
//$("input[type=file]").change(function(event) {
$(document).on("change", "input[type=file]", function(event){
	console.log( "change" );
	console.log( event );
	var element_id = event.target.id;
	$.each(event.target.files, function(index, file) {
		var reader = new FileReader();
		reader.onload = function(event) {  
			object = {};
			object.filename = file.name;
			object.data = event.target.result;
			object.index = $("#"+element_id).attr("data-index");
			files.push(object);
			//console.log( object );
			viewModel.savePhoto( object );
		};  
		reader.readAsDataURL(file);
	});
});