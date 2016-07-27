'use babel';

export default class AtomEmailerView {

  constructor(serializedState, emitter) {
    // Create root element
    this.emitter = emitter;
    this.element = document.createElement('div');
    this.element.classList.add('atom-emailer');
    this.inputElement = document.createElement('input');
    const btnSubmit = document.createElement("button");
    this.constructInputElement(this.inputElement);
    this.constructSubmitButton(btnSubmit, this.inputElement);
    // Create message element
    const message = document.createElement('div');
    message.textContent = 'The AtomEmailer package is Alive! It\'s ALIVE!';
    message.classList.add('message');
    this.element.appendChild(message);
    this.element.appendChild(this.inputElement);
    this.element.appendChild(btnSubmit);
    dropDownDiv = document.createElement("div");
    dropDownDiv.classList.add("dropdown");
    dropDownElement = document.createElement("ul");
    dropDownElement.id = "drop-down";
    dropDownElement.classList.add("dropdown-menu");
    dropDownDiv.appendChild(dropDownElement);
    this.element.appendChild(dropDownDiv);
    this.listenForSelectedEmail();
  }

  constructSubmitButton(btnSubmit, inputElement) {
    btnSubmit.classList.add("submit-btn");
    btnSubmit.classList.add("btn");
    btnSubmit.classList.add("btn-success");
    btnSubmit.classList.add("btn-lg");
    btnSubmit.textContent = "submit";
    btnSubmit.addEventListener('click', this.sendEmail(this, inputElement));
  }

  constructInputElement(inputElement) {
    inputElement.classList.add("email-input");
    inputElement.classList.add("form-control");
    inputElement.addEventListener('keyup', () => { this.manageSpecialKey() });
  }

  listenForSelectedEmail() {
    _this = this;
    document.addEventListener('click', (e) => {
      if(e.target.getAttribute('class').indexOf('email-list') >=0 ) {
        _this.inputElement.value = e.target.innerHTML;
      }
    });
  }

  validateEmail(email) {
     var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
     return re.test(email);
  }

  moveCaret(elem, selectionStart, position) {
    caretStart = caretEnd = selectionStart + position;
    elem.focus();
    elem.setSelectionRange(caretStart, caretEnd);
  }

  deleteChar(inputText, selectionStart) {
    length = inputText.length;
    if(selectionStart == length) {
      return  inputText.substr(0, length - 1);
    } else {
      return inputText.slice(0, selectionStart - 1) + inputText.slice(selectionStart, length);
    }
  }

  manageSpecialKey() {
    let currentTarget = event.currentTarget;
    switch (event.which) {
      case 8: //backspace/delete
        selectionStart = currentTarget.selectionStart;
        currentTarget.value = this.deleteChar(currentTarget.value, selectionStart);
        this.moveCaret(currentTarget, selectionStart, -1);
        break;
      case 37: //left arrow
        this.moveCaret(currentTarget, currentTarget.selectionStart, -1);
        break;
      case 39: //right arrow
          this.moveCaret(currentTarget, currentTarget.selectionStart, 1);
        break;
      case 13: //enter arrow
        this.sendEmail(this, currentTarget)();
        break;
      default:
        this.fetchAutoCompleteEmail(currentTarget.value);
    }
  }

  fetchAutoCompleteEmail(inputText) {
    this.emitter.emit("on-email-insert", inputText);
  }

  displayFetchedEmail(emails) {
    console.log(emails)
    dropDownElement = document.getElementById("drop-down");
    dropDownElement.innerHTML = "";
    emails.forEach((email) => {
     dropDownElement.insertAdjacentHTML("beforeend", "<li><a href='#' class='email-list'>" + email + "</a></li>")
    });
  }

  sendEmail(_this, inputElement) {
    return function _closure(event) {
      if(_this.validateEmail(inputElement.value)){
        _this.emitter.emit("on-submit-email", inputElement.value);
      } else {
        alert("not a valid email");
      }
    }
  }
  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

}
