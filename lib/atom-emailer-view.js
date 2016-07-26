'use babel';

export default class AtomEmailerView {

  constructor(serializedState, emitter) {
    // Create root element
    this.emitter = emitter;
    this.element = document.createElement('div');
    this.element.classList.add('atom-emailer');

    const inputElement = document.createElement('input');
    const btnSubmit = document.createElement("button");
    this.constructInputElement(inputElement);
    this.constructSubmitButton(btnSubmit, inputElement);
    // Create message element
    const message = document.createElement('div');
    message.textContent = 'The AtomEmailer package is Alive! It\'s ALIVE!';
    message.classList.add('message');
    this.element.appendChild(message);
    this.element.appendChild(inputElement);
    this.element.appendChild(btnSubmit);
  }

  constructSubmitButton(btnSubmit, inputElement) {
    btnSubmit.classList.add("submit-btn");
    btnSubmit.textContent = "submit";
    btnSubmit.addEventListener('click', this.sendEmail(this, inputElement));
  }

  constructInputElement(inputElement) {
    inputElement.classList.add("email-input");
    inputElement.addEventListener('keydown', this.manageSpecialKey(this));
  }

  validateEmail(email) {
     var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
     return re.test(email);
  }

  moveCart(elem, position) {
    caretStart = caretEnd = elem.selectionStart + position
    elem.focus();
    elem.setSelectionRange(caretStart, caretEnd)
  }

  manageSpecialKey(_this) {
    function closure(event) {
      console.log(event.which)
      switch (event.which) {
        case 8: //backspace/delete
          this.value = this.value.substr(0, this.value.length-1);
          break;
        case 37: //left arrow
          _this.moveCart(this, -1)
          break;
        case 39: //right arrow
            _this.moveCart(this, 1)
          break;
        case 13: //enter arrow
          _this.sendEmail(_this, this)();
          break;
      }
    }
    return closure;
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
