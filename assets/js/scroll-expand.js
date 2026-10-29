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

    // Set initial box position for animation using transform
    box.css({
        position: "fixed",
        top: bounding_box.top + "px",
        left: bounding_box.left + "px",
        width: bounding_box.width + "px",
        height: bounding_box.height + "px",
        transform: "translate(0, 0)", // Initially no translation
    });

    // Add the in-animation class (CSS part)
    box.addClass("in-animation");

    // Hide the content of .box-inner
    boxInner.css("display", "none");

    // Show the mediic-section
    mediicSection.css("display", "block");

    // Disable vertical scrolling on the body to prevent page scrolling
    var scrollTop = $(window).scrollTop();  // Save the current scroll position
    $("body").css({
        "overflow": "hidden",  // Disable scrolling
        "position": "fixed",   // Lock the body in place
        "top": -scrollTop + "px",  // Offset the page to prevent background movement
        "width": "100%"         // Prevent layout shifts
    });

    // GSAP animation for the box expanding smoothly
    gsap.to(box[0], {
        duration: 0.6,
        ease: "power3.out",
        transformOrigin: "center center",  // Set transform origin to center
        scale: 1.1, // Slight scale up for the effect
        x: "-50%", // Move to the center horizontally
        y: "-50%", // Move to the center vertically
        width: "80vw", // Change to your desired size for the expanded box
        height: "80vh", // Change to your desired size for the expanded box
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
    boxInner.css("display", "block");

    // Get original position and dimensions
    var originalStyles = box.data("original-styles");

    // GSAP animation for the box closing
    gsap.to(box[0], {
        duration: 0.6,
        ease: "power3.inOut",
        transformOrigin: "center center",  // Set transform origin to center
        scale: 1, // Return to original size
        x: 0,    // Return to original horizontal position
        y: 0,    // Return to original vertical position
        width: originalStyles.width,
        height: originalStyles.height,
    });

    // Hide the close button after the animation
    closeBtn.hide();

    // Reset body scrolling after the box animation ends
    $("body").css({
        "overflow": "auto",      // Re-enable scrolling
        "position": "static",    // Reset body's position to default
        "top": "",               // Reset top offset
    });

    // Scroll back to the previous position
    $(window).scrollTop(scrollTop);  // Restore the scroll position
});

// Handle animation end to reset the state
$(".box").on("transitionend", function (e) {
    var box = $(this);
    var mediicSection = box.find(".mediic-section");

    // Reset the body's overflow
    $("body").css("overflow", "auto");
});
