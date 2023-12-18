let TC = document.querySelector(".ticket-container");
let allFilters = document.querySelectorAll(".filter"); // all filters by querySelectorAll
// console.log(allFilters.length);
let selectedPriority;

for (let i = 0; i < allFilters?.length; i++) {
  allFilters[i].addEventListener("click", filterHandler);
  // console.log(allFilters[i]+" ");
}
function filterHandler(e) {
  // div(filter class).span(at 0 index).classlist(array format classes at 0 is color).splitat[0] to get first property at index 0 i.e. color
  // let filterColor = e.currentTarget.children[0].classList[0].split("-")[0];
  // let span = e.currentTarget.children[0];
  // let style = getComputedStyle(span); // all the css to span stored in style
  // console.log(style.backgroundColor)
  // TC.style.backgroundColor = style.backgroundColor;
  // TC.style.backgroundColor = filterColor; //ticket containers background color changing

  //-- adding filter active to the filter div
  TC.innerHTML = "";
  if (e.currentTarget.classList.contains("active")) {
    e.currentTarget.classList.remove("active");
    loadTickets();
  } else {
    let activefilter = document.querySelector(".filter.active");
    if (activefilter) activefilter.classList.remove("active");
    e.currentTarget.classList.add("active");
    let ticketPriority = e.currentTarget.children[0].classList[0];
    loadTickets(ticketPriority);
  }
}
let modalVisible = false;

function loadTickets(color) {
  let allTasks = localStorage.getItem("allTasks");
  if (allTasks != null || allTasks != 'null') {
    allTasks = JSON.parse(allTasks);
    if (color) {
      allTasks = allTasks?.filter(function (data) {
        return data.priority == color;
      });
    }
    for (let i = 0; i < allTasks?.length; i++) {
      allTasks[i];
      let ticket = document.createElement("div");

      ticket.classList.add("ticket");
      ticket.innerHTML = `<div class="ticket-color ticket-color-${allTasks[i].priority}"></div>
            <div class="ticket-id">#${allTasks[i].ticketId}</div>
            <div class="task">${allTasks[i].task}</div>`;

      TC.appendChild(ticket);
      ticket.addEventListener("click", function (e) {
        if (e.currentTarget.classList.contains("active")) {
          e.currentTarget.classList.remove("active");
        } else {
          e.currentTarget.classList.add("active");
        }
      });
    }
  }
}

loadTickets();
let addbtn = document.querySelector(".add-button");
let deletebtn = document.querySelector(".delete-button");

deletebtn.addEventListener("click", function (e) {
  let selectedTickets = document.querySelectorAll(".ticket.active");
  let allTasks = JSON.parse(localStorage.getItem("allTasks"));
  for (let i = 0; i < selectedTickets?.length; i++) {
    selectedTickets[i].remove();
    let ticketID = selectedTickets[i].querySelector(".ticket-id").innerText;
    allTasks = allTasks?.filter(function (data) {
      return "#" + data.ticketId != ticketID;
    });
  }
  localStorage.setItem("allTasks", JSON.stringify(allTasks));
});
addbtn.addEventListener("click", showModal);

function showModal(e) {
  if (!modalVisible) {
    let modal = document.createElement("div");
    modal.classList.add("modal");
    modal.innerHTML = `<div class="modal-task-added" data-typed="false" contenteditable="true">Enter your task here.</div>
    <div class="modal-priority-list">

            <div class="modal-purple modal-filter active"></div>
            <div class="modal-red modal-filter"></div>
            <div class="modal-green modal-filter"></div>
            <div class="modal-blue modal-filter"></div>

    </div>`;
    //append for string and appendChild for tag
    // TC.innerHTML = TC.innerHTML + modal;
    TC.appendChild(modal); //append node only
    selectedPriority = "purple"; //default priority color
    let taskModal = document.querySelector(".modal-task-added");
    taskModal.addEventListener("click", function (e) {
      if (e.currentTarget.getAttribute("data-typed") == "false") {
        e.currentTarget.innerText = "";
        e.currentTarget.setAttribute("data-typed", "true");
      }
    });
    modalVisible = true;
    taskModal.addEventListener("keypress", addTicket.bind(this, taskModal));
    let modalfilters = document.querySelectorAll(".modal-filter");
    for (let i = 0; i < modalfilters?.length; i++) {
      modalfilters[i].addEventListener(
        "click",
        selectPriority.bind(this, taskModal)
      );
    }
  }
}
function selectPriority(taskModal, e) {
  let activefilter = document.querySelector(".modal-filter.active");
  activefilter.classList.remove("active");
  selectedPriority = e.currentTarget.classList[0].split("-")[1];
  // console.log(e.currentTarget);
  e.currentTarget.classList.add("active");
  taskModal.click();
  taskModal.focus();
}

function addTicket(taskModal, e) {
  if (
    e.key == "Enter" &&
    e.shiftKey == false &&
    taskModal.innerHTML.trim() != ""
  ) {
    let task = taskModal.innerText;
    let id = Date.now();
    // let id = uuid();
    // let ticket = document.createElement("div");

    // ticket.classList.add("ticket");
    //  ticket.innerHTML = `<div class="ticket-color ticket-color-${selectedPriority}"></div>
    // <div class="ticket-id">#${id}</div>
    // <div class="task">${task}</div>`;
    document.querySelector(".modal").remove();
    modalVisible = false;

    // TC.appendChild(ticket);
    // ticket.addEventListener("click", function(e){
    //     if(e.currentTarget.classList.contains("active")){
    //         e.currentTarget.classList.remove("active");
    //     }else{
    //         e.currentTarget.classList.add("active");
    //     }
    // });

    // TC.innerHTML = TC.innerHTML + ticket;
    //adding tasks in local storage

    let allTasks = localStorage.getItem("allTasks");
    if (allTasks == null || allTasks == 'null') {
      let data = [{ ticketId: id, task: task, priority: selectedPriority }];
      localStorage.setItem("allTasks", JSON.stringify(data));
    } else {
      let data = JSON.parse(allTasks);
      data?.push({ ticketId: id, task: task, priority: selectedPriority });
      localStorage.setItem("allTasks", JSON.stringify(data));
    }
    let activefilter = document.querySelector(".filter.active");
    TC.innerHTML = "";
    if (activefilter) {
      let activePriority = activefilter.children[0].classList[0];
      loadTickets(activePriority);
    } else {
      loadTickets();
    }
  } else if (e.key == "Enter" && e.shiftKey == false) {
    e.preventDefault();
    alert("Error - Please type a task in task box");
  }
}
