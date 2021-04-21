// ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
// COMPONENTS BEGIN
// ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

class Drive {
    constructor(containerElement) {
      this.home = containerElement;
      this.htmlID = uuidv4();
    }
    delete(){
      this.home.innerHTML = "";
    }
    render() {
      var container = document.createElement('div');
      container.classList = ["pile"];
      for (var card of this.cards) {
        card = card.render();
        card.firstElementChild.classList.add("inPile")
        var cardContainer = document.createElement('div');
        cardContainer.classList = ["cardContainer"];
        let spread = 15;
        cardContainer.style.transform = `rotate(${Math.random() * (spread*2) - spread  }deg)`;
        cardContainer.appendChild(card)
        container.appendChild(cardContainer);
      }
      this.htmlSubContainer = container;
      this.home.appendChild(container);
    }
  }

// ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
// COMPONENTS END
// ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

