if (typeof OpenGeoportal === 'undefined') {
	OpenGeoportal = {};
} else if (typeof OpenGeoportal !== "object") {
	throw new Error("OpenGeoportal already exists and is not an object");
}

if (typeof OpenGeoportal.Views === 'undefined') {
	OpenGeoportal.Views = {};
} else if (typeof OpenGeoportal.Views !== "object") {
	throw new Error("OpenGeoportal.Views already exists and is not an object");
}


OpenGeoportal.Views.PreviewedLayersTable = OpenGeoportal.Views.LayerTable
		.extend({
			constructor: function (options) {
				//allow options to be passed in the constructor argument as in previous Backbone versions.
				    this.options = options;
				    Backbone.View.apply(this, arguments);
			},
					
			initSubClass: function(){
				this.tableConfig = this.options.tableConfig;
				this.listenTo(this.collection, "change:preview add remove", this.render);
				var that = this;
				this.tableConfig.listenTo(this.collection, "change:visible", function(model){ that.updateSubviews.call(that);});
				this.listenTo(this.collection, "change:showControls", function(){jQuery(document).trigger("previewRow.expand");});
				this.listenTo(this.collection, "change:zIndex", this.render);

			},
			
			handleEmptyTable: function(table$){
				table$.addClass("hiddenTable");
			},
			
			renderHeaders: function(){
				//nop
			},
			
			createNewRow: function(model){

				var row = new OpenGeoportal.Views.PreviewedLayersRow(
						{
							model : model,
							tableConfig: this.tableConfig
						});
				this.appendSubview(row);

				return row;
			},
			
			getTable: function(){
				return jQuery(this.template.get('tableView')({tableHeader: "", tableFooter: ""}));
			},
			
			shouldProcessRow: function(model){
				return (model.get("preview") === "on");
			},
			
			createTableConfig: function() {
				//we're going to pass in the table config from the search results view.
				return null;
			}

		});
