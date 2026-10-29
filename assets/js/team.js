$(document).ready(function () {
  // Append the styles for dynamic keyframes and media queries
  $("body").append('<style id="lightbox-animations" type="text/css"></style>');

  // Ensure mediic-section is hidden initially
  $(".mediic-section-custom").css("display", "none");

  // Handle click on any custom box
  $(".team-custom.box").on("click", function (e) {
    var box = $(this); // Current box clicked
    var closeBtn = box.find(".team-close-btn");
    var mediicSection = box.find(".mediic-section-custom"); // Expanded section
    var boxInner = box.find(".box-inner"); // Default content inside the box
    var teamThumbnail = box.find(".team-thumbnail"); // Team thumbnail

    // Prevent event propagation to ensure no other click events interfere
    e.stopPropagation();

    // Get the original position and dimensions of the box
    var boundingBox = box.get(0).getBoundingClientRect();

    // Store the original dimensions and position
    box.data("original-styles", {
      top: boundingBox.top + "px",
      left: boundingBox.left + "px",
      width: boundingBox.width + "px",
      height: boundingBox.height + "px",
    });

    // Set the box position for animation
    box.css({
      position: "fixed",
      top: boundingBox.top + "px",
      left: boundingBox.left + "px",
      width: boundingBox.width + "px",
      height: boundingBox.height + "px",
    });

    // Add the in-animation class
    box.addClass("in-animation");

    // Hide the content of .box-inner
    boxInner.css("display", "none");

    // Show the mediic-section
    mediicSection.css("display", "block");

    // Apply margin-top to the team-thumbnail after expanding
    teamThumbnail.css("margin-top", "60px");

    // Check screen size and apply a different margin-top if on small screens (320px to 479px)
    if ($(window).width() >= 320 && $(window).width() <= 479) {
      teamThumbnail.css("margin-top", "106px");
    };

    if ($(window).width() >= 768 && $(window).width() <= 991) {
      teamThumbnail.css("margin-top", "106px");
    }

    // $(window).on("resize", function () {
    //   if ($(window).width() >= 320 && $(window).width() <= 479) {
    //     $(".team-thumbnail img").css("width", "160px");
    //   } else {
    //     $(".team-thumbnail img").css("width", "auto");
    //   }
    // }).trigger("resize");

    // Don't disable scrolling yet, wait for the expansion animation to finish
    closeBtn.show();
    box.show();
  });

  // Handle close button click inside any box
  $(".team-close-btn").on("click", function (e) {
    var box = $(this).closest(".team-custom.box");
    var closeBtn = $(this);
    var mediicSection = box.find(".mediic-section-custom");
    var boxInner = box.find(".box-inner");
    var teamThumbnail = box.find(".team-thumbnail"); // Team thumbnail

    // Prevent event propagation
    e.stopPropagation();

    // Hide the mediic-section
    mediicSection.css("display", "none");

    // Restore the .box-inner content
    boxInner.css({
      "display": "block",
      "height": "auto",  // Ensure the height is set back to auto
      "transition": "height 0.3s ease-out" // Add smooth transition for height
    });

    // Get original position and dimensions
    var originalStyles = box.data("original-styles");

    // Apply the out-animation keyframes dynamically
    var styles = `
        @keyframes outlightbox {
            0% {
                height: 100%;
                width: 100%;
                top: 0;
                left: 0;
            }
            100% {
                height: ${originalStyles.height};
                width: ${originalStyles.width};
                top: ${originalStyles.top};
                left: ${originalStyles.left};
            }
        }
    `;
    $("#lightbox-animations").get(0).sheet.insertRule(styles, 0);

    // Add the out-animation class
    box.addClass("out-animation");

    // Hide the close button
    closeBtn.hide();

    // Remove margin-top from the team-thumbnail after closing
    teamThumbnail.css("margin-top", ""); // Reset the margin-top to its original value
  });

  // Handle animation end to reset the state
  $(".team-custom.box").on("animationend", function (e) {
    var box = $(this);
    var mediicSection = box.find(".mediic-section-custom");
    var teamThumbnail = box.find(".team-thumbnail");

    if (e.originalEvent.animationName === "inlightbox") {
      // On in-animation end, show the mediic-section and disable vertical scrolling
      mediicSection.css("display", "block"); // Ensure it's visible after animation

      // Disable vertical scrolling on both html and body to prevent page scrolling
      $("html, body").addClass("modal-open");
    } else if (e.originalEvent.animationName === "outlightbox") {
      // On out-animation end, reset the box to its original state
      var originalStyles = box.data("original-styles");

      box.css({
        position: "static",
        top: "",
        left: "",
        width: "",
        height: ""
      });

      box.removeClass("in-animation out-animation");

      // Remove the empty box and dynamic keyframe
      $(".empty-box").remove();
      $("#lightbox-animations").get(0).sheet.deleteRule(0);

      // Ensure the box remains visible in its original position
      box.css("display", "block");

      // Re-enable scrolling once the modal closes
      $("html, body").removeClass("modal-open");

      // Reset margin-top of the team-thumbnail after closing
      teamThumbnail.css("margin-top", ""); // Reset the margin-top to its original value
    }
  });
});