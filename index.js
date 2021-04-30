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

setInterval(() => {
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (e of document.getElementsByClassName("wildcard")) {
    e.innerText = characters.charAt(
      Math.floor(Math.random() * charactersLength)
    );
  }
}, 80);

// ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
// HELPERS END
// ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

// ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
// UI MODELS BEGIN
// ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

class DriveBay {
  constructor(homeElement) {
    this.home = homeElement;
    this.drives = [];
    this.selectedDrive;
  }
  reset() {
    for (let i = this.drives.length - 1; i >= 0; i--) {
      this.removeDrive(this.drives[i]);
    }
  }
  newDrive() {
    this.drives.push(new DriveViewModel(this.home));
  }
  removeDrive(drive) {
    this.drives = this.drives.filter((item) => item !== drive);
    $(drive.htmlID).remove();
  }
}
// ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
// UI MODELS END
// ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

// ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
// ENTRY POINT BEGIN
// ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

var driveBay = new DriveBay($("driveBay"));

// ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
// ENTRY POINT END
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
    // 	fa fa-window-close-o
    template.innerHTML = `
      <div id='${this.htmlID}' class='drive'>
        <div class="driveGridContainer">
          ${gridElements}
        </div>
        <button type="button" class="btn btn-danger" id="delete_${this.htmlID}"><i class="fa fa-exclamation-triangle"></i></button>
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
  driveBay.newDrive();
});
$("resetButton").addEventListener("click", () => {
  driveBay.reset();
});
$("raidSelect").addEventListener("change", () => {
  driveBay.reset();
});

// ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
// UI BINDINGS END
// ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
