'use babel';

var nodemailer = require('nodemailer');
var fs = require('fs');
var _ = require('lodash');
import AtomEmailerView from './atom-emailer-view';
import { CompositeDisposable } from 'atom';
import { Emitter } from 'atom';

export default {

  atomEmailerView: null,
  modalPanel: null,
  subscriptions: null,
  activate(state) {
    this.emitter = new Emitter();
    this.atomEmailerView = new AtomEmailerView(state.atomEmailerViewState, this.emitter);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.atomEmailerView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-emailer:toggle': () => this.toggle()
    }));
    this.onEmailSubmit(this.sendEmail);
    this.localSettings();
  },

  localSettings() {
    this.settings = this.readLocalSettings();
  },

  rootDir() {
    var split_path = __dirname.split("/");
    return split_path.slice(0, split_path.length-1).join("/");
  },

  readLocalSettings() {
    var path = this.rootDir();
    var dbPath = path + "/db";
    var filePath = dbPath + "/db.json";
    try{
      fs.accessSync(filePath, fs.F_OK);
      var jsonData = JSON.parse(fs.readFileSync(filePath).toString());
    } catch (e) {
      console.log("fatt gaya");
      fs.mkdirSync(dbPath);
      var jsonData = {};
      fs.writeFile(filePath, JSON.stringify(jsonData, null, 4), function (err) {});
    }
    return jsonData;
  },

  onEmailSubmit(callback) {
    this.emitter.on('on-submit-email', callback(this));
  },

  sendEmail (_this) {
    return function sendEmailClosure(to) {
      editor = atom.workspace.getActiveTextEditor();
      selectedText = editor.getSelectedText();
      var transporter = nodemailer.createTransport(_this.settings.url);
      var mailOptions = {
        from: '<rohit.khatana@craftsvilla.com>', // sender address
        to: to, // list of receivers
        subject: 'Hello from Atom ✔', // Subject line
        text: selectedText // plaintext body
        // html: '<b>Hello world 🐴</b>' // html body
      };
      transporter.sendMail(mailOptions, function(error, info){
        if(error) {
          return console.log(error);
        }
        console.log("Message info: " + info.response);
      });
    }
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.atomEmailerView.destroy();
  },

  serialize() {
    return {
      atomEmailerViewState: this.atomEmailerView.serialize()
    };
  },

  toggle() {
    console.log('AtomEmailer was toggled!');
    if (this.modalPanel.isVisible()) {
      this.modalPanel.hide();
    } else {
      editor = atom.workspace.getActiveTextEditor();
      selectedText = editor.getSelectedText();
      this.modalPanel.show();
    }
    // return (
    //   this.modalPanel.isVisible() ?
    //   this.modalPanel.hide() :
    //   this.modalPanel.show()
    // );
  }

};
