$(document).ready(function () {
  function showView(viewName) {
    $(".view").hide();
    $("#" + viewName).show();
  }

  $("[data-launch-view]").click(function (e) {
    e.preventDefault();
    const viewName = $(this).attr("data-launch-view");
    showView(viewName);
  });

  $("[studentData-launch-view]").click(function (e) {
    e.preventDefault();
    const viewName = $(this).attr("studentData-launch-view");
    console.log(viewName);
    showView(viewName);
  });

  $("[level-launch-view]").click(function (e) {
    e.preventDefault();
    const viewName = $(this).attr("level-launch-view");
    if (viewName === "masters") {
      $("#bachBtns").hide();
      $("#bachContent").hide();
      $("#thesis").show();
    } else {
      $("#bachBtns").show();
      $("#bachContent").show();
      $("#thesis").hide();
    }
  });
});
