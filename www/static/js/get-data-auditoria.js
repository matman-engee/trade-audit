$(document).ready(function(){
	//alert( localStorage.audit_id );

	// voy a buscar los datos al server
	$.ajax({
		//url: 'http://localhost/test/Auditoria/nueva.php',
		url: ip+project+"audits/getAuditCategories/"+localStorage.getItem("audit_id")+".json",
		success: function(data,status){
			console.log("success");
			console.log(data);	// Unexpected token : 
			viewModel = new ViewModel( data.response.DATA );
			console.log(viewModel);
			ko.applyBindings(viewModel);
		},
		error: function(data){
			console.log("error");
			console.log(data);
		}	
	});

});

function ViewModel(data){
	var self = this;
	self.audit 		= ko.observable( new Audit(data.Audit) );
	self.auditCategories = ko.observableArray( $.map( data.AuditCategory || [], function(data){return new AuditCategory(data)}) );
	self.branch 	= ko.observable( new Branch( data.Branch ) );
	self.manager 	= ko.observable( new Manager( data.Manager ) );
	self.poll  		= ko.observable( new Poll( data.Poll ) );
	self.region 	= ko.observable( new Region( data.Region || { id: 1, name: "hola"} ) );
	//self.getObservation = self.auditCategories() && self.auditCategories()[0] && self.auditCategories()[0].observation;
	self.getObservation = self.audit() && self.audit().observation;

	self.prepare = function(){
		return JSON.stringify({
			id: self.audit().id(),
			observation: self.getObservation()
		});
	}

	self.remove = function(){
		self.callAjax( "deleteAudit" );
	}

	self.save = function(){
		self.callAjax( "saveAudit" );
	}

	self.finish = function(){
		self.callAjax( "finishAudit" );
	}

	self.callAjax = function(method){
		$.ajax({
			//url: 'http://localhost/test/Auditoria/nueva.php',
			url: ip+project+"audits/"+method+".json",
			type: "post",
			dataType: "json",
			data: self.prepare(),
			success: function(data,status){
				console.log("success");
				console.log(data);	// Unexpected token : 
				window.location = "index.html";
			},
			error: function(data){
				console.log("error");
				console.log(data);
			}	
		});				
	}
}