$(function() 
{
    // Add scroll event listener
    $(".scrollbar").on("scroll", function(event) {
        $(".scroll-indicator").css("visibility", ($(event.target).scrollTop() == 0) ? "visible" : "hidden");
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

    // Submit add task form
    $("#task-add-form").on("submit", addTask);

    // Reroute to selected list
    $(".list-item").on("click", route);

    // Update backend/frontend

    // Submit the title on focus out.
    $("#list-title-form input").on("focusout", updateTitle);
    // Delete list
    $(".list-delete").on("click", deleteList);

    // Toggle task
    $(".task-content").on("click", toggleTask);
    // Delete task
    $(".task-delete").on("click", deleteTask);

})

function route(event)
{
    const target = $(event.currentTarget);
    let url = target.attr("data-url");

    if (typeof(url) === "undefined") {
        url = target.closest("li").attr("data-url");
    }

    window.location.href = url;
}

/**
 * Submit form without submit buttons.
 * @param {string} formId the form id to submit
 */
function submitForm(formId)
{
    document.getElementById(formId).submit();
}


function updateTitle(event)
{
    const form = $("#list-title-form");
    const listId = $("#list-title-form").data("id");

    const input = $("#list-title-form input[name=title]");

    $.post(
        `${form.attr("action")}`, 
        {"title": input.val()})
        .done(function(newTitle) {
            if (newTitle !== 0) {
                // Set up the new title and in the list
                input.val(newTitle);
                $("#l-" + listId + " span").text(newTitle);

/**
 * Create the task through json response 
 * to practice a different approach to improve ux.
 * @param {event} event 
 */
function addTask(event)
{
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    
    
    $.ajax({
        url: form.action,
        type: "POST",
        data: formData,
        contentType: false, // Make formData work w jquery
        processData: false,
        
        success: function(taskData) {
            if (taskData !== "{}") {
                
                const task = JSON.parse(taskData);
                createTask(task);

                // Force scroll to the new task;
                form.reset();
                window.location.hash = "t-" + task.id;
            }
        }
        
    })
}

/**
 * Create the task element.
 * @param {JSON} jsonData the json object containing the task data.
 */
function createTask(jsonData)
{
    const task = jsonData;
    const taskCompleted = task["is_completed"] ? "completed" : "";

    // Task li
    const li = $(`<li id="t-${task.id}" data-url="${task["baseTaskUrl"]}" class="d-flex w-100 mb-4"></li>`);
    li.html(`
        <div>
            <div class="marker priority priority-${task["priority"]} ${taskCompleted}"><i class="fa-solid fa-circle"></i></div>
            <div class="marker checkmark ${taskCompleted}"><i class="fa-solid fa-circle-check"></i></div>
        </div>
        <div class="d-flex flex-column w-100">
            <p class="mb-2 task-content ${taskCompleted}">${task["content"]}</p>
            <div class="d-flex">
                <div class="${taskCompleted} ${task["due_date"] != "" ? "due_date" : ""} task-date justify-content-center align-items-center rounded-5">${task["due_date"]}</div>
            </div>
        </div>
    `)
    li.on("click", toggleTask);
    $("#tasks-container ul").append(li);

    // Add interface buttons and events
    const divButtons = $(`<div class="text-center"></div>`);
    li.append(divButtons);
    
    // Edit button
    divButtons.append($(`<a class="task-icon task-edit ms-2" href="#"><i class="fa-solid fa-pen-to-square"></i></a>`));
    
    // Delete button
    const deleteButton = $(`<button type="button" class="task-icon task-delete"><i class="fa-solid fa-trash-can"></i></button>`);
    deleteButton.on("click", deleteTask);
    divButtons.append(deleteButton);
}


/**
 * Toggle the task's completed status
 * @param {event} event 
 */
function toggleTask(event)
{
    const target = $(event.currentTarget);
    const li = target.closest("li");

    $.get(`${li.attr("data-url")}/toggle`, function(isCompleted) {
        if (isCompleted) {

            // Update elements
            for (let name of ["task-content", "priority", "checkmark", "task-date"]) {
                li.find('.' + name).toggleClass("completed");
            }
        }
    });
}

/**
 * Delete a task
 * @param {event} event 
 */
function deleteTask(event)
{
    const target = $(event.currentTarget);
    const li = target.closest("li");

    $.ajax({
        url:`${li.attr("data-url")}/delete`,
        type: "DELETE",
        success: function(is_completed) {
            if (is_completed) {

                li.remove();
            }
        }
    });
}

/**
 * Delete a list
 * @param {event} event 
 */
function deleteList(event)
{
    const target = $(event.currentTarget);
    const li = target.closest("li");

    $.ajax({
        'url': `${li.attr("data-url")}/delete`,
        type: "DELETE",
        success: function(is_completed) {
            if (is_completed) {

                li.remove();
            }
        }
    })
}
