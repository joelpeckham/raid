// ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
// HELPERS BEGIN
// ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

let $ = document.getElementById.bind(document); //Poor man's jQuery

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

setInterval(() => {
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (e of document.getElementsByClassName('wildcard')){
    e.innerText = characters.charAt(Math.floor(Math.random() * 
    charactersLength));
  }
}, 60)

// ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
// HELPERS END
// ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄


// ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
// VIEW CONTROLLERS BEGIN
// ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

class Drive {
    constructor(containerElement) {
      this.home = containerElement;
      this.htmlID = uuidv4();
      this.render();
      $(`delete_${this.htmlID}`).addEventListener("click",()=>{this.delete();});
    }
    delete(){
      $(this.htmlID).remove();
    }
    render() {
      var template = document.createElement('template');
      let gridElements = "";
      for(let i=0; i<16; i++){
        gridElements += `
        <div class="driveBlock${i%4==0 ? ' leftBorder' : ''}${i < 4 ? ' topBorder' : ''}" 
        id="drive_${this.htmlID}_block_${i}">
          <p>${i}</p>
        </div>\n`
      }

      template.innerHTML = `
      <div id='${this.htmlID}' class='drive'>
        <div class="driveGridContainer">
          ${gridElements}
        </div>
        <button type="button" class="btn btn-danger" id="delete_${this.htmlID}"><i class="fa fa-trash"></i></button>
      </div>
      `;
      this.home.appendChild(template.content);
      for(let i=0; i<16; i++){
        let block = $(`drive_${this.htmlID}_block_${i}`);
        block.addEventListener("click",()=>{block.classList.add('wildcard')})
      }
    }
  }

// ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
// VIEW CONTROLLERS END
// ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄


// ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
// UI MODELS BEGIN
// ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

class DriveBay{
  constructor(homeElement){
    this.home = homeElement;
    this.drives = [];
    this.selectedDrive;
  }
}
// ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
// UI MODELS END
// ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄


// ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
// UI HANDLERS BEGIN
// ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

function addDrive(){ new Drive($('driveBay')); }

// ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
// UI HANDLERS END
// ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄


// ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
// UI BINDINGS BEGIN
// ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

$('addDriveButton').addEventListener('click',addDrive);

// ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
// UI BINDINGS END
// ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

// ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
// ENTRY POINT BEGIN
// ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

// ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
// ENTRY POINT END
// ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄