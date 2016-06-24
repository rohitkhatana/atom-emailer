'use babel';

import AtomEmailerView from './atom-emailer-view';
import { CompositeDisposable } from 'atom';

export default {

  atomEmailerView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.atomEmailerView = new AtomEmailerView(state.atomEmailerViewState);
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
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
