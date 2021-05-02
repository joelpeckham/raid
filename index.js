// ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
// HELPERS BEGIN
// ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

let $ = document.getElementById.bind(document); //Poor man's jQuery

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function randomChar(
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
) {
  let charactersLength = characters.length;
  return characters.charAt(Math.floor(Math.random() * charactersLength));
}
setInterval(() => {
  for (e of document.getElementsByClassName("wildcard")) {
    e.innerText = randomChar();
  }
}, 80);

// ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
// HELPERS END
// ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

// ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
// UI MODELS BEGIN
// ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

class Array {
  constructor(homeElement) {
    this.home = homeElement;
    this.drives = [];
    this.arrayType = "0";
  }
  reset() {
    for (let i = this.drives.length - 1; i >= 0; i--)
      this.removeDrive(this.drives[i]);
    this.arrayType = $("raidSelect").value;
    switch (this.arrayType) {
      case "0":
        this.newDrive(2);
        break;
      case "1":
        this.newDrive(2);
        break;
      case "10":
        this.newDrive(4);
        break;
      case "4":
        this.newDrive(3);
        break;
    }
  }
  write(data) {
    let dn = this.drives.length;
    if (this.arrayType == "0") {
      let cd = 0;
      for (let c of data) {
        this.drives[cd].addData(c);
        cd = (cd + 1) % dn;
      }
    } else if (this.arrayType == "1") {
      for (let c of data) {
        for(let d of this.drives){
          d.addData(c);
        }
      }
    } else if (this.arrayType == "10") {

    } else if (this.arrayType == "4") {
    }
  }
  newDrive(amount = 1) {
    for (let i = 0; i < amount; i++)
      this.drives.push(new DriveViewModel(this.home));
  }
  removeDrive(drive) {
    this.drives = this.drives.filter((item) => item !== drive);
    $(drive.htmlID).remove();
  }
  addDrive(){
    let oldAmount = this.drives.length;
    this.reset();
    this.newDrive(oldAmount - this.drives.length + 1);
  }
}
// ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
// UI MODELS END
// ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

// ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
// GLOBAL OBJECTS BEGIN
// ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

var driveBay = new Array($("driveBay"));

// ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
// GLOBAL OBJECTS END
// ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

// ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
// VIEW CONTROLLERS BEGIN
// ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

class DriveViewModel {
  constructor(containerElement) {
    this.home = containerElement;
    this.htmlID = uuidv4();
    this.render();
    $(`delete_${this.htmlID}`).addEventListener("click", () => {
      this.allWild();
    });
    this.wildBlocks = [];
    this.data = [];
  }
  addWildBlock(blockNum, block = null) {
    if (!block) block = $(`drive_${this.htmlID}_block_${blockNum}`);
    block.classList.add("wildcard");
    this.wildBlocks.push(blockNum);
  }
  allWild() {
    for (let i = 0; i < 16; i++) {
      let block = $(`drive_${this.htmlID}_block_${i}`);
      this.addWildBlock(i, block);
    }
  }
  addData(value, pos = null) {
    if (pos == null) pos = this.data.length;
    this.data.splice(pos, 0, value);
    $(`drive_${this.htmlID}_block_${pos}`).innerText = value;
  }
  render() {
    var template = document.createElement("template");
    let gridElements = "";
    for (let i = 0; i < 16; i++) {
      gridElements += `
        <div class="driveBlock${i % 4 == 0 ? " leftBorder" : ""}${
        i < 4 ? " topBorder" : ""
      }" 
        id="drive_${this.htmlID}_block_${i}">
          <p></p>
        </div>\n`;
    }
    
    template.innerHTML = `
      <div id='${this.htmlID}' class='drive'>
        <div class="driveGridContainer">
          ${gridElements}
        </div>
        <button type="button" class="btn btn-danger" id="delete_${this.htmlID}"><i class="fa fa fa-window-close-o"></i></button>
      </div>
      `;
    this.home.appendChild(template.content);
    for (let i = 0; i < 16; i++) {
      let block = $(`drive_${this.htmlID}_block_${i}`);
      block.addEventListener("click", () => {
        this.addWildBlock(i, block);
      });
    }
  }
}

// ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
// VIEW CONTROLLERS END
// ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

// ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
// UI HANDLERS BEGIN
// ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

// ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
// UI HANDLERS END
// ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

// ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
// UI BINDINGS BEGIN
// ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

$("addDriveButton").addEventListener("click", () => {
  driveBay.addDrive();
});
$("resetButton").addEventListener("click", () => {
  driveBay.reset();
});
$("raidSelect").addEventListener("change", () => {
  driveBay.reset();
});
$("randomDataButton").addEventListener("click", () => {
  randomData = "";
  for (i = 0; i < 200; i++) {
    randomData += randomChar();
  }
  $("writeDataTextArea").value = randomData;
});
$("clearDataButton").addEventListener("click", () => {
  $("writeDataTextArea").value = "";
});
$("writeDataButton").addEventListener("click", () => {
  driveBay.write("TESTING");
});
// ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
// UI BINDINGS END
// ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

// ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
// ENTRY POINT BEGIN
// ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

driveBay.reset();

// ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
// ENTRY POINT END
// ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
