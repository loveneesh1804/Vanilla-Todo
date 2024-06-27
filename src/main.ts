import './style.css';

type Todo={
  task : string;
  readonly id : string;
  status : boolean;
}

let btn = <HTMLButtonElement>document.querySelector(".btn");
let task = document.querySelector(".task") as HTMLInputElement;
let err = <HTMLSpanElement>document.querySelector(".err-msg");

let all = <HTMLButtonElement>document.querySelector(".all");
let completed = <HTMLButtonElement>document.querySelector(".true");
let ongoing = <HTMLButtonElement>document.querySelector(".false");


let title = localStorage.getItem("todos");
let todos:Array<Todo> = title ? JSON.parse(localStorage.getItem("todos") || '') : [];
 


btn.addEventListener("click",()=>{
  if(!task.value){
    err.innerHTML = "This Field is Mandatory !"
    task.setAttribute("id","error");
  }
  else{
    handleAdd();
  }
})

task.addEventListener("click",()=>{
  if(task.getAttribute("id")==="error"){
    err.innerHTML = "";
    task.removeAttribute("id")
  };
})


const handleAdd=()=>{
  let payload : Todo = {
    id : String(~~(Math.random() * 1000)),
    task : task.value,
    status : false
  }
  todos.push(payload);
  localStorage.setItem("todos",JSON.stringify(todos));

  task.value = "";
  hanldeRender(todos);
  handleChanges();
}

const hanldeRender=(data:Todo[])=>{
  let mainBox = document.querySelector(".task-list") as HTMLDivElement;
  mainBox.innerHTML = "";

  if(!todos.length){
    let span = document.createElement("span") as HTMLSpanElement;
    span.innerText = "No task added yet!";
    document.querySelector(".task-list")?.append(span);
    all.disabled = true;
    completed.disabled = true;
    ongoing.disabled = true;
  }
  if(!data.length){
    let span = document.createElement("span") as HTMLSpanElement;
    span.innerText = "No task found!";
    document.querySelector(".task-list")?.append(span);
  }
  else{
    data.map(({task,status,id} : Todo,i:number)=>{
      let box = <HTMLDivElement>document.createElement("div");
      box.setAttribute("class","task-itm");

      let para = document.createElement("p") as HTMLParagraphElement;
      if(task.length>100){
        para.textContent = `${task.slice(1,100)}...`;
      }else{
        para.textContent = task;
      }

      let innerbox: HTMLDivElement = document.createElement("div");

      let btn: HTMLButtonElement = document.createElement("button");
      btn.innerHTML = "<img src='https://cdn-icons-png.flaticon.com/128/2782/2782988.png' alt='rmv-ico' />";

      btn.addEventListener("click",()=>{
        todos.splice(i,1);
        localStorage.setItem("todos",JSON.stringify(todos));
        hanldeRender(todos);
        handleChanges();
      })

      let checkbox : HTMLInputElement = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = status;

      checkbox.addEventListener("change",()=>{
        todos.find(el=>{
          if(el.id === id){
            el.status = !el.status
          }
        });
        localStorage.setItem("todos",JSON.stringify(todos));
        hanldeRender(todos);
        handleChanges();
      });

      status && para.setAttribute("class","completed");

      let editbtn:HTMLButtonElement = document.createElement("button");
      editbtn.innerText = "Edit";
      if(status){
        editbtn.disabled = true
      };

      editbtn.addEventListener("click",()=>{
        let modal = document.createElement("div") as HTMLDivElement;
        modal.setAttribute("class","modal");

        let close = document.createElement("button") as HTMLButtonElement;
        close.innerHTML = "<img src='https://cdn-icons-png.flaticon.com/128/2961/2961937.png' alt='close-ico' />"

        let heading:HTMLParagraphElement = document.createElement("p");
        heading.innerText = "Update Todo"


        let content = document.createElement("textarea") as HTMLTextAreaElement;
        content.textContent = task;
        content.rows = 1;


        let mainModal = document.createElement("div") as HTMLDivElement;
        mainModal.setAttribute("class","inner-modal");
        
        let doneBtn = <HTMLButtonElement>document.createElement("button");
        doneBtn.disabled = true;
        doneBtn.textContent = "Done";

        
        content.addEventListener("input",()=>{
          if(content.value === task || !content.value.length){
            doneBtn.disabled = true;
          }
          else{
            doneBtn.disabled = false;
          }
        })

        mainModal.append(close,heading,content,doneBtn);

        modal.append(mainModal);

        document.querySelector("body")?.append(modal);
        mainModal.style.left = "50%";


        close.addEventListener("click",()=>{
          let pseudo = document.querySelector(".modal") as HTMLDivElement;
          pseudo.remove()
        })

        document.querySelector("textarea")?.focus();

        doneBtn.addEventListener("click",()=>{
          todos.find((el:Todo)=>{
            if(el.id === id){
              el.task = content.value;
              localStorage.setItem("todos",JSON.stringify(todos));
              hanldeRender(todos);
              handleChanges();
              let pseudo = document.querySelector(".modal") as HTMLDivElement;
              pseudo.remove();
            }
          })
        })

      })

      innerbox.append(checkbox,editbtn,btn);
      box.append(para,innerbox);
      mainBox.append(box);
    })
  }
}


let buttons = document.querySelectorAll(".filter>button") as NodeListOf<HTMLButtonElement>;
for(let i=0;i<buttons.length;i++){
  buttons[i].addEventListener("click",()=>{
    if(buttons[i].textContent==="All"){
      buttons[i].style.backgroundColor = "#4284F3";
      buttons[i].style.color = "white";
      handleColor(i);
      hanldeRender(todos);
    }
    else if(buttons[i].textContent==="Completed"){
      buttons[i].style.backgroundColor = "#33A852";
      buttons[i].style.color = "white";
      handleColor(i);
      const res = todos.filter(el=>el.status===true);
      hanldeRender(res);
    }
    else{
      buttons[i].style.backgroundColor = "#EA4335";
      buttons[i].style.color = "white";
      handleColor(i);
      const res = todos.filter(el=>el.status===false);
      hanldeRender(res);

    }
  })
}

const handleColor = (i:number)=>{
  buttons.forEach(el=>{
    if(el.textContent !== buttons[i].textContent){
      el.style.backgroundColor = "white";
      el.style.color = "black";
    }
  })
}

const handleChanges = ()=>{
  buttons[0].style.backgroundColor = "#4284F3";
  buttons[0].style.color = "white";
  handleColor(0);
}


hanldeRender(todos);
handleChanges();