// Append the styles for dynamic keyframes
$("body").append('<style id="lightbox-animations" type="text/css"></style>');

// Ensure mediic-section is hidden initially
$(".mediic-section").css("display", "none");

// Handle click on any box
$(".box").on("click", function (e) {
    var box = $(this);
    var closeBtn = box.find(".close");
    var mediicSection = box.find(".mediic-section");
    var boxInner = box.find(".box-inner");

    // Prevent event propagation to ensure no other click events interfere
    e.stopPropagation();

    // Get the original position and dimensions of the box
    var bounding_box = box.get(0).getBoundingClientRect();
    box.data("original-styles", {
        top: bounding_box.top + "px",
        left: bounding_box.left + "px",
        width: bounding_box.width + "px",
        height: bounding_box.height + "px",
    });

    // Set the box position for animation
    box.css({
        position: "fixed",
        top: bounding_box.top + "px",
        left: bounding_box.left + "px",
        width: bounding_box.width + "px",
        height: bounding_box.height + "px",
    });

    // Add the in-animation class
    box.addClass("in-animation");

    // Hide the content of .box-inner
    boxInner.css("display", "none");

    // Show the mediic-section
    mediicSection.css("display", "block");

    // Disable vertical scrolling on the body to prevent page scrolling
    $("body").css({
        "overflow-y": "hidden",  // Disable vertical scroll
        "position": "fixed",     // Prevent scrolling by fixing the body's position
        "width": "100%"          // Ensure the body takes full width without any layout shifts
    });

    // Show the close button after the animation
    closeBtn.show();
    box.show();
});

// Handle close button click inside any box
$(".close").on("click", function (e) {
    var box = $(this).closest(".box");
    var closeBtn = $(this);
    var mediicSection = box.find(".mediic-section");
    var boxInner = box.find(".box-inner");

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

    // Reset body scrolling after the box animation ends
    $("body").css({
        "overflow-y": "auto",  // Re-enable vertical scrolling
        "position": "static",  // Reset body's position to default
    });
});

// Prevent unintended behavior when clicking outside of a box
$("body").on("click", function (e) {
    // Do nothing here to prevent the box from disappearing
    // Intentionally left blank to block propagation
});

// Handle animation end to reset the state
$(".box").on("animationend", function (e) {
    var box = $(this);
    var mediicSection = box.find(".mediic-section");

    if (e.originalEvent.animationName === "inlightbox") {
        // On in-animation end, show the mediic-section
        mediicSection.css("display", "block"); // Ensure it's visible after animation
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
    }

    // Reset the body's overflow
    $("body").css("overflow", "auto");
});
