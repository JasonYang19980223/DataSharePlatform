import React, { Component } from 'react';
import web3 from './web3.js'
import { create } from 'ipfs-http-client'
import Nbar from './Nbar.js';
import platform from './contract/platform.js'

const ipfs=create({host:'ipfs.infura.io',port:'5001',apiPath: '/api/v0'});

class Upload extends Component {

  async componentWillMount() {
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const pm = await platform.methods.manager().call();
    if(this.state.account === pm){
      this.setState({manager:true});
    }
    else
      this.setState({manager:false});
  }

  constructor(props){
    super(props);
    this.state ={
      account :'',
      buffer:null,
      ipfsHash:""
    };
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
    console.log(file.path)
    await platform.methods.uploadRequestFile(this.props.location.state.requestID,ipfsHash).send({from:this.state.account}).then((r)=>{
      this.setState({ipfsHash})
    })
  }

  load=()=>{
    fetch(`https://ipfs.infura.io/ipfs/${this.state.ipfsHash}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/csv',
        },
      })
      .then((response) => response.blob())
      .then((blob) => {
        // Create blob link to download
        const url = window.URL.createObjectURL(
          new Blob([blob]),
        );
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
          'download',
          `FileName.csv`,
        );

        // Append to html link element page
        document.body.appendChild(link);

        // Start download
        link.click();

        // Clean up and remove the link
        link.parentNode.removeChild(link);
      });
  }

  render() {
    return (
      <div>
        <Nbar account={this.state.account} manager ={this.state.manager}/>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <p>&nbsp;</p>
                <h2> Upload File </h2>
                <form onSubmit = {this.onSubmit} >
                  <input type = 'file' onChange = {this.captureFile}/>
                  <input type = 'submit' />
                </form>
                <button onClick = {this.load}>Download</button>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default Upload;
