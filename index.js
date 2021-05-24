// ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
// HELPERS BEGIN
// ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

let $ = document.getElementById.bind(document); //Poor man's jQuery
let wildSentinel = new Object();
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
    this.clearDrives();
    let dn = this.drives.length;
    if (this.arrayType == "0") {
      let cd = 0;
      for (let c of data) {
        this.drives[cd].addData(c);
        cd = (cd + 1) % dn;
      }
    } else if (this.arrayType == "1") {
      for (let c of data) {
        for (let d of this.drives) {
          d.addData(c);
        }
      }
    } else if (this.arrayType == "10") {
      let cd = 0;
      for (let c of data) {
        this.drives[cd].addData(c);
        this.drives[cd + dn / 2].addData(c);
        cd = (cd + 1) % (dn / 2);
      }
    } else if (this.arrayType == "4") {
      let cd = 0;
      for (let c of data) {
        this.drives[cd].addData(c);
        if (cd == dn - 2) {
          let pos = this.drives[dn - 1].data.length;
          let sum = this.drives[0].data[pos].charCodeAt(0);
          for (let i = 1; i < dn - 1; i++) {
            sum += this.drives[i].data[pos].charCodeAt(0);
          }
          this.drives[dn - 1].addData(sum);
        }
        cd = (cd + 1) % (dn - 1);
      }
    }
  }
  repair() {
    let failText = "";
    let dn = this.drives.length;
    let k = 0;
    for (let d of this.drives) {
      let i = 0;
      for (let b of d.data) {
        if (b === wildSentinel) {
          let rebuildData = [];
          if (this.arrayType == "0") {
            failText = "Rebuild failed. Cannot repair RAID 0 array.";
          } else {
            let j = 0;
            for (let rd of this.drives) {
              if (rd != d) {
                if (this.arrayType == "10") {
                  if (j % 2 == k % 2) {
                    if (rd.data[i] != wildSentinel)
                      rebuildData.push(rd.data[i]);
                  }
                } else {
                  if (rd.data[i] != wildSentinel) rebuildData.push(rd.data[i]);
                }
              }
              j++;
            }
            if (this.arrayType == "4") {
              if (rebuildData.length >= dn - 1) {
                if (Number.isInteger(rebuildData[rebuildData.length - 1])) {
                  let lastNum = rebuildData[rebuildData.length - 1];
                  for (let x = 0; x < rebuildData.length - 1; x++) {
                    lastNum -= rebuildData[x].charCodeAt(0);
                  }
                  d.removeWildBlock(i, String.fromCharCode(lastNum));
                } else {
                  d.removeWildBlock(
                    i,
                    rebuildData.reduce(
                      (a, b) => a.charCodeAt(0) + b.charCodeAt(0)
                    )
                  );
                }
              }
              else{
                failText = "Rebuild failed. Too much damage.";
              }
            } else if (this.arrayType == "1" || this.arrayType == "10") {
              if (rebuildData[0]) {
                d.removeWildBlock(i, rebuildData[0]);
              } else {
                failText = "Rebuild failed. Too much damage.";
              }
            }
          }
        }
        i++;
      }
      k++;
    }
    if (failText != "") alert(failText);
  }
  newDrive(amount = 1) {
    for (let i = 0; i < amount; i++)
      this.drives.push(new DriveViewModel(this.home));
  }
  removeDrive(drive) {
    this.drives = this.drives.filter((item) => item !== drive);
    $(drive.htmlID).remove();
  }
  clearDrives() {
    let oldAmount = this.drives.length;
    this.reset();
    this.newDrive(oldAmount - this.drives.length);
  }
  addDrive() {
    this.clearDrives();
    let even = this.arrayType == "10";
    this.newDrive(1 + even);
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
    this.data = [];
    wildSentinel = new Object();
  }
  addWildBlock(blockNum, block = null) {
    if (!block) block = $(`drive_${this.htmlID}_block_${blockNum}`);
    if (block.innerText == "") return;
    block.classList.add("wildcard");
    this.data[blockNum] = wildSentinel;
  }
  removeWildBlock(blockNum, data) {
    let block = $(`drive_${this.htmlID}_block_${blockNum}`);
    block.classList.remove("wildcard");
    this.data[blockNum] = data;
    block.innerText = data;
  }
  allWild() {
    for (let i = 0; i < 16; i++) {
      let block = $(`drive_${this.htmlID}_block_${i}`);
      this.addWildBlock(i, block);
    }
  }
  addData(value, pos = null) {
    if (pos == null) pos = this.data.length;
    if (pos >= 16) return;
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
let textarea = $("writeDataTextArea");
function getRandomText() {
  fetch("https://www.randomtext.me/api/gibberish/p-1/15")
    .then((response) => response.json())
    .then((data) => {
      textarea.value = data.text_out
        .replace(/(<([^>]+)>)/gi, "")
        .replaceAll(" ", "_");
    });
}
$("randomDataButton").addEventListener("click", getRandomText);
$("clearDataButton").addEventListener("click", () => {
  textarea.value = "";
});
$("writeDataButton").addEventListener("click", () => {
  driveBay.write(textarea.value);
});
$("writeDataTextArea").addEventListener("input", (e) => {
  textarea.value = textarea.value.replaceAll(" ", "_");
});
textarea.addEventListener("keydown", (e) => {
  if (e.keyCode == 13) e.preventDefault();
});
$("repairButton").addEventListener("click", () => {
  driveBay.repair();
});
// ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
// UI BINDINGS END
// ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

// ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
// ENTRY POINT BEGIN
// ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

driveBay.reset();
// getRandomText();
textarea.value = "ABCDEFGHIJKLMNOP";

// ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
// ENTRY POINT END
// ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
