var opts = {
  lines: 13 // The number of lines to draw
, length: 28 // The length of each line
, width: 14 // The line thickness
, radius: 42 // The radius of the inner circle
, scale: 1 // Scales overall size of the spinner
, corners: 1 // Corner roundness (0..1)
, color: '#000' // #rgb or #rrggbb or array of colors
, opacity: 0.25 // Opacity of the lines
, rotate: 0 // The rotation offset
, direction: 1 // 1: clockwise, -1: counterclockwise
, speed: 1 // Rounds per second
, trail: 60 // Afterglow percentage
, fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
, zIndex: 2e9 // The z-index (defaults to 2000000000)
, className: 'spinner' // The CSS class to assign to the spinner
, top: '50%' // Top position relative to parent
, left: '50%' // Left position relative to parent
, shadow: false // Whether to render a shadow
, hwaccel: false // Whether to use hardware acceleration
, position: 'absolute' // Element positioning
}
var target = document.getElementById('spinner-container')
var spinner = new Spinner(opts).spin(target);

 $(document).ready(function() {
     Tabletop.init({
         key: "1bDim7xyiqWwN-mKiwx4V6wLFMUsTw0oPbdJQP-ycujA",
         callback: showInfo,
         parseNumbers: true
     });
 });



 var allRows = [];

 function showInfo(data, tabletop) {

     allRows = _.sortBy(tabletop.sheets("agency status").all(), "Agency");

     var uri = new URI();
     var params = uri.search(true);

     if (params) {
         var filters = [];
         filters.push(buildAgencyFilter(params["Agency"]));
         updateCards(allRows, _.compact(filters));
     } else {
         updateCards(allRows);
     }
 }

 function updateCards(rows, filters) {

     spinner.stop();

     var filters = filters || [];
     var source = $("#card-template").html();
     var template = Handlebars.compile(source);

     _.chain(rows)
         .filter(function(row) {
                 return _.all(filters, function(filter) {
                     return filter(row);
                 });
        })
         .map(function(row) {
          
           row.ado = row["DATA OFFICER"];
           row.submit_init = row["SUBMITTED INITIAL DATASETS"];
           row.pub_init = row["PUBLISHED INITIAL DATASETS"];
           row.inventory = row["DATA INVENTORY"];
           row.plan = row["DATA PLAN"];
           row.tot_public = row["TOTAL PUBLIC DATASETS"];
           row.tot_published = row["TOTAL DATASETS PUBLISHED"];
           row.grade = row["Grade"];
           row.score = row["Score"];

           row.adoCaption = captions.ado[row.ado];
           row.submit_initCaption = captions.submit_init[row.submit_init];
           row.pub_init = captions.pub_init[row.pub_init];
           row.inventory = captions.inventory[row.inventory];
           row.plan = captions.plan[row.plan];
           row.tot_public = captions.tot_public[row.tot_public];
           row.tot_published = captions.tot_published[row.tot_published];
           row.openLicenseCaption = captions.openLicense[row.openLicense];
          

             var html = template(row);
            $("#cards").append(html);
            $('[data-toggle="tooltip"]').tooltip();  
        });
 }




 function buildAgencyFilter(Agency) {
     if (!Agency) {
         return false;
     }
     return function(row) {
         return row["Agency"] === Agency;
     }
 }

 

 function clearCards() {
     $("#cards").empty();
 }

 function filterByAgency(Agency) {
     clearCards();
     updateCards(allRows, [buildStateFilter(Agency)]);
 }

 function resetSearch() {
     clearCards();
     updateCards(allRows);
 }

 
