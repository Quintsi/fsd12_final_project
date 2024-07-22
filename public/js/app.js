$(function() 
{
    // Add scroll event listener
    $(".scrollbar").on("scroll", function(event) {
        $(".scroll-indicator").css("visibility", ($(event.target).scrollTop() == 0) ? "visible" : "hidden");
    });


    // Submit the title on focus out.
    $("#list-title-form input").on("focusout", function() {
        submitForm("list-title-form");
    });

    // Submit priority on click.
    $("#priority-btn").on("click", function() {
        submitForm("priority-form");
    })

    // Show add task form
    $("#task-add-btn").on("click", function() {
        $("#task-add-form").toggle(200);
        $("#task-add-btn").toggleClass("hide");

        if ($("#task-add-btn").hasClass("hide")) {
            $("#task-add-form textarea").focus();
        }
    })

    // Reroute to selected list
    $(".list-item").on("click", route);

    // Update backend/frontend
    // Toggle task is_completed
    $(".task-content").on("click", toggleTask);
    $(".task-delete").on("click", deleteTask);

})

function route(event)
{
    window.location.href = $(event.target).attr("data-url");
}

/**
 * Submit form without submit buttons.
 * @param {string} formId the form id to submit
 */
function submitForm(formId)
{
    document.getElementById(formId).submit();
}


/**
 * Toggle the task's completed status
 * @param {event} event 
 */
function toggleTask(event)
{
    const target = $(event.currentTarget);
    const li = target.closest("li");

    $.get(`${li.attr("data-url")}/toggle`, function(is_completed) {
        if (is_completed) {

            // Update elements
            for (let name of ["task-content", "priority", "checkmark", "task-date"]) {
                li.find('.' + name).toggleClass("completed");
            }
        }
    });
}

/**
 * Delete the task
 * @param {event} event 
 */
function deleteTask(event)
{
    const target = $(event.currentTarget);
    const li = target.closest("li");

    $.ajax({
        url:`${li.attr("data-url")}/delete`,
        type: 'DELETE',
        success: function(is_completed) {
            if (is_completed) {

                const li = target.closest("li");
                li.remove();
            }
        }
    });
}
