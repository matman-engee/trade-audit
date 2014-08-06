var viewModel = null;

function ViewModel(data){
	var self = this;
	self.currentUser = ko.observable(1);
	self.regions = ko.observableArray( $.map( data.regions || [], function(data){return new Region(data)}) );

	self.selectedRegionId = ko.observable();
	self.selectedRegion = ko.computed(function(){
		return $.map( self.regions(), function(data){
					if ( data.id() == self.selectedRegionId() ){
						return data;
					}
				} );
	});

	self.selectedBranchId = ko.observable();
	self.selectedBranch = ko.computed(function(){
		var branches = (self.selectedRegion().length > 0 && self.selectedRegion()[0].branches()) || [];
		return $.map( branches, function(data){
					if ( data.id() == self.selectedBranchId() ){
						return data;
					}
				} );
	});

	self.selectedManagerId = ko.observable();
	self.selectedManager = ko.observable();

	this.regionFormId = function(index){
		return "region-"+index;
	}
	this.branchFormId = function(index){
		return "branch-"+index;
	}
	this.managerFormId = function(index){
		return "manager-"+index;
	}

	self.prepare = function(){
		return JSON.stringify({ 
					"poll_id": viewModel.selectedRegionId(),
					"user_id": viewModel.currentUser(),
					"manager_id": viewModel.selectedManagerId()
				});
	}
}

$(document).ready(function(){
	$.ajax({
		url: ip+project+'regions/getRegions.json',
		success: function(data,status){
			console.log("success");
			console.log(data);	// Unexpected token : 
			viewModel = new ViewModel( data );
			ko.applyBindings(viewModel);
		},
		error: function(data){
			console.log("error");
			console.log(data);
		}	
	});

	$("#nueva-auditoria").submit(function(e){
		e.preventDefault();
		console.log("submit");
		if( $(this).validationEngine("validate") ){
			console.log( "valido" );
			$.ajax({
				url: ip+project+"audits/createNewAudit.json",
				type: "post",
				dataType: "json",
				data: viewModel.prepare(),
				success: function(data){
					console.log("success");
					console.log(data);
					//window.location = ip+project+"audits/getAuditCategories/"+data.response.DATA+".json";
					if ( typeof(Storage) !== "undefined" ){
						localStorage.setItem( "audit_id", data.response.DATA );
						window.location = "nueva-auditoria-2.html";
					}else{
						console.log( "LocalStorage not supported" );
						alert("error");
					}
				},
				error: function(data){
					console.log("error");
					console.log(data);
				}
			});
		}else{
			console.log( "invalido" );
		}
		return false;
	});
});


