import React, { Component } from 'react';
import web3 from '../Load/web3.js'
import Nbar from '../Nbar.js';
import platform from '../Load/platform.js'
import { create } from 'ipfs-http-client'


const ipfs=create({host:'ipfs.infura.io',port:'5001',apiPath: '/api/v0'});


class Request extends Component {

  constructor(props){
    super(props)
    this.state = {
      account:'',
      column:'',
      privacy:0,
      discription:'',
      ipfs:''
    }    
    this.handleCol = this.handleCol.bind(this);
    this.handlePrivacy = this.handlePrivacy.bind(this);
    this.handleDiscription = this.handleDiscription.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  async componentWillMount() {
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] })
    const pm = await platform.methods.manager().call();
    console.log(pm);
    if(this.state.account === pm){
      this.setState({manager:true});
    }
    else
      this.setState({manager:false});
  }

  handleCol(e) {
    this.setState({column: e.target.value});
  }

  handlePrivacy(e) {
    this.setState({privacy: parseInt(e.target.value)});
  }

  handleDiscription(e) {
    this.setState({discription: e.target.value});
  }

  captureFile = (event) =>{
    event.preventDefault()
    //console.log("file capture")
    //process file for ipfs
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({buffer:Buffer(reader.result)})
      console.log('buffer',Buffer(reader.result))
    }
    console.log(event.target.files)
  }

//ex:QmWpV82gZgvbjGbwhp6gYdPFALECDKWjqkRe13LVVa2Z4i
  onSubmit = async (event) =>{
    event.preventDefault()
    console.log("submitting the form")
    const file=await ipfs.add(this.state.buffer)
    const ipfsHash = file.path
    this.setState({ipfsHash})
    console.log(this.state.ipfsHash)
  }

  async handleClick(e) {
    await platform.methods.createRequest(this.state.ipfsHash,this.state.column,this.state.privacy,this.state.discription).send({from:this.state.account})
  }

  render() {
    const styleInput={
      border:'2px solid'
    };
    return (
      <div>
        <Nbar account={this.state.account} manager={this.state.manager}/>
        <div style={{margin:'5px'}}>
          <label>
            <input type="text" placeholder="column" style={styleInput} onChange={ this.handleCol } />
          </label>
          <br/>
          <label>
            <input type="text" placeholder="privacy" style={styleInput} onChange={ this.handlePrivacy } />
          </label>
          <br/>
          <label>
            <input type="text" placeholder="discription" style={styleInput} onChange={ this.handleDiscription } />
          </label>
          <br/>
          <br/>
          <div>
            <h2> Upload File </h2>
            <form onSubmit = {this.onSubmit} >
              <input type = 'file' onChange = {this.captureFile}/>
              <input type = 'submit' />
            </form>
          </div>
          <label>
            <input
              type="button"
              value="confirm"
              style={{cursor:'pointer'}}
              onClick={this.handleClick}
            />
          </label>
        </div>
      </div>
    );
  }
}


export default Request;