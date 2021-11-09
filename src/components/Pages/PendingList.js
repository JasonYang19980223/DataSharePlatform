import React, { Component } from 'react';
import web3 from '../Load/web3.js'
import Nbar from '../Nbar.js';
import platform from '../Load/platform.js'
import { create } from 'ipfs-http-client'


const ipfs=create({host:'ipfs.infura.io',port:'5001',apiPath: '/api/v0'});

class PendingList extends Component {
  
  constructor(props){
    super(props)
    this.state = {
      account: '',
      requests:[],
      isLogIn:'',
      manager:true
    }
    this.load = this.load.bind(this);
  }

  async componentWillMount() {
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const pm = await platform.methods.manager().call();

    if(this.state.account === pm){
      this.setState({manager:true});
      console.log("HI")
    }
    else
      this.setState({manager:false});

    await this.getInit()
  }

  async getInit(){
    let reqLen=0;
    console.log(reqLen)
    reqLen = await platform.methods.datasetCnt().call()
    console.log(reqLen)

    for (var i = 1; i <= reqLen; i++) {
      let request = await platform.methods.requestsID(i).call()
      let reqInf = await platform.methods.reqInformID(i).call()
      if(request.ipfsHashShare!==''){
        console.log('aaa')
        this.setState({
          requests: [...this.state.requests, [request,reqInf]]
        })
      }
    }
  }

  load(ipfs){
    fetch(`https://ipfs.infura.io/ipfs/${ipfs}`, {
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
  onSubmit = async (event,rid) =>{
    event.preventDefault()
    console.log("submitting the form")
    const file=await ipfs.add(this.state.buffer)
    const ipfsHash = file.path
    this.setState({ipfsHash})
    console.log(this.state.ipfsHash)
    await platform.methods.uploadResultFile(rid,ipfsHash).send({ from: this.state.account })
  }

  render() {
    return (
      <div>
        <Nbar account={this.state.account} manager ={this.state.manager}/>
        <h3>Account: {this.state.account}</h3>
        <br/>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Requester file</th>
              <th scope="col">column</th>
              <th scope="col">privacy</th>
              <th scope="col">Sharer file</th>
              <th scope="col">Upload result</th>
            </tr>
          </thead>
          <tbody id="request">
            { this.state.requests.map((request, key) => {
              return(
                <tr key={key} style = {{border:"solid"}}>
                  <th scope="row">{request[0].ID.toString()} </th>
                  <td>
                    <button onClick = {()=>this.load(request[0].ipfsHash)}>Downlod file</button>
                  </td>
                  <td>{request[1].column}</td>
                  <td>{request[1].privacyRequirement.toString()}</td>
                  <td>
                    <button onClick = {()=>this.load(request[0].ipfsHashShare)}>Downlod file</button>
                  </td>
                  <td>
                    <form onSubmit = {(event)=>this.onSubmit(event,request[0].ID)} >
                      <input type = 'file' onChange = {this.captureFile}/>
                      <br/>
                      <input type = 'submit' />
                    </form>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <br/>
      </div>
    );
  }
}


export default PendingList;