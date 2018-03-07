(function appClosure(){

  var ox = hub.openExchange;
  $parent = $('#widget');
  $drive = $('<div/>').addClass('driveHolder').appendTo($parent);

  var DATE_FORMAT = 'dddd MMM D';
  var TIME_FORMAT = 'h:mm A';

  function getHeaderView(hdr, prevDate) {
    $view = $('<div/>').addClass('driveHolder');

    $iconHolder = $('<div/>').addClass('iconBarHolder').prependTo($message);
    $iconBar = $('<div/>').addClass('iconBar hidden').html(iconHTML).appendTo($iconHolder);

    $showMoreHolder = $('<div/>').addClass('showMoreHolder').appendTo($view);
    $showMore = $('<div/>').addClass('showMore hidden').html('Show More').appendTo($showMoreHolder);

    return $view;
  }

ox.init().then( function() {

  console.log("In init");
    ox.getInfoStoreList();  
    //ox.syncDriveFolders();
})

})();