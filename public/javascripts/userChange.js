$(document).ready(function (e) {
  function showView(viewName) {
    $(".view").hide();
    $("#" + viewName).show();
  }

  $("[data-launch-view]").click(function (e) {
    e.preventDefault();
    var viewName = $(this).attr("data-launch-view");
    showView(viewName);
  });

  $("[studentData-launch-view]").click(function (e) {
    e.preventDefault();
    var viewName = $(this).attr("studentData-launch-view");
    showView(viewName);
  });

   $("[teacherData-launch-view]").click(function (e) {
    e.preventDefault();
    var viewName = $(this).attr("teacherData-launch-view");
    showView(viewName);
  });
});
