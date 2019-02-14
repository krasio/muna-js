import React, { Component } from 'react';
import kbpgp from 'kbpgp';

class App extends Component {
  constructor(props) {
    super(props);

    this.inputChanged = this.inputChanged.bind(this);
    this.importRecipientsPublicKeys = this.importRecipientsPublicKeys.bind(this);
    this.encrypt = this.encrypt.bind(this);

    this.recipients = [];
    var {gpgKeys} = require('./recipients');
    this.importRecipientsPublicKeys(gpgKeys);

    this.state = {
      secretName: '',
      rawSecret: '',
      encryptedSecret: '',
      invalidSecret: false
    };
  }

  inputChanged(event) {
    const name = event.target.name;
    this.setState({[name]: event.target.value});
  }

  importRecipientsPublicKeys(data) {
    data.forEach(key => {
      kbpgp.KeyManager.import_from_armored_pgp({armored: key}, (err, key) => {
        if (!err) {
          this.recipients.push(key);
        } else {
          console.log(err);
        }
      });
    });
  }

  encrypt(event) {
    if (this.state.rawSecret.trim()) {
      this.setState({invalidSecret: false})

      kbpgp.box({msg: this.state.rawSecret, encrypt_for: this.recipients}, (err, result, buffer) => {
        this.setState({encryptedSecret: result});
      });
    } else {
      this.setState({invalidSecret: true})
    }
  }

  render() {
    if (this.state.encryptedSecret) {
      return <EncryptedSecret
              secretName={this.state.secretName}
              encryptedSecret={this.state.encryptedSecret}
             />
    } else {
      return <RawSecret
              secretName={this.state.secretName}
              rawSecret={this.state.rawSecret}
              invalidSecret={this.state.invalidSecret}
              inputChanged={this.inputChanged}
              encrypt={this.encrypt}
            />
    }
  };
}

class RawSecret extends Component {
  render() {
    let errorMessage;
    if (this.props.invalidSecret) {
      errorMessage = <p className="help is-danger">Please provide some secrets, no need from all that secrecy if you don't have any!</p>;
    } else {
      errorMessage = '';
    }

    return(
      <div className="section">
        <div className="container">
            <div className="field">
              <textarea
                name="rawSecret"
                value={this.props.rawSecret}
                onChange={this.props.inputChanged}
                className={(this.props.invalidSecret) ? 'textarea is-danger' : 'textarea is-primary'}
                required="required"
                placeholder="Paste your secrets here..."
                autoFocus="autofocus"
                cols="80" rows="15">
              </textarea>
              {errorMessage}
            </div>

            <div className="field">
              <div className="control">
                <input
                  name="secretName"
                  value={this.props.secretName}
                  onChange={this.props.inputChanged}
                  className="input"
                  placeholder="Name your secrets, will be used as filename on download (optional)"
                  type="text"
                />
              </div>
            </div>

            <div className="field">
              <div className="control">
                <button className="button is-primary" onClick={this.props.encrypt}>
                  Keep it secret! Keep it safe!
                </button>
              </div>
            </div>
        </div>
      </div>
    )
  }
}

class EncryptedSecret extends Component {
  constructor(props) {
    super(props);

    this.copy = this.copy.bind(this);
    this.download = this.download.bind(this);
  }

  copy(event) {
    const secret = document.getElementById("encrypted-secret");
    const selection = window.getSelection();
    selection.selectAllChildren(secret);
    document.execCommand("copy");
    setTimeout(function(s) { s.removeAllRanges(); }, 500, selection);
  }

  download(event) {
    const file = document.createElement('a');
    file.href = `data:text/plain;charset=utf-8,${encodeURIComponent(this.props.encryptedSecret)}`;
    file.target = '_blank';
    if (this.props.secretName.trim()) {
      file.download = `${this.props.secretName}.gpg`
    } else {
      file.download = 'secret.gpg'
    }
    file.click();
  }

  render() {
    let secretName;

    if (this.props.secretName !== '') {
      secretName = <h4 className="title is-4">{this.props.secretName}</h4>;
    } else {
      secretName = '';
    }

    return (
      <div className="section">
        <div className="container">
          <div className="box">
            {secretName}
            <div className="buttons">
              <span className="button is-light" onClick={this.copy}>
                <span className="icon">
                  <i className="fas fa-clipboard"></i>
                </span>
                <span>Copy</span>
              </span>
              <span className="button is-light" onClick={this.download}>
                <span className="icon">
                  <i className="fas fa-file-download"></i>
                </span>
                <span>Download</span>
              </span>
            </div>
          </div>
          <div className="field">
            <pre id="encrypted-secret">{this.props.encryptedSecret}</pre>
          </div>
        </div>
      </div>
    )
  }
}

export default App;
