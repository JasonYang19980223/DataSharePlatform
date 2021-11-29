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
      cooperations:[],
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
      let cooperation = await platform.methods.cooperationID(i).call()
      if(!cooperation.getResult){
        console.log('aaa')
        this.setState({
          cooperations: [...this.state.cooperations, cooperation]
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
              <th scope="col">Cooperation Name</th>
              <th scope="col">Target</th>
              <th scope="col">data</th>
            </tr>
          </thead>
          <tbody id="request">
            { this.state.cooperations.map((cooperation, key) => {
              let result
              if(cooperation.getResult){
                result=<td>
                    <form onSubmit = {(event)=>this.onSubmit(event,cooperation.cooperationID)} >
                      <input type = 'file' onChange = {this.captureFile}/>
                      <br/>
                      <input type = 'submit' />
                    </form>
                  </td>
              }
              else{
                result = <td>Done</td>
              }
              return(
                <tr key={key} style = {{border:"solid"}}>
                  <th scope="row">{cooperation.cooperationID.toString()} </th>
                  {/* <td>
                    <button onClick = {()=>this.load(cooperation.ipfsHash)}>Downlod request</button>
                  </td> */}
                  <td>"cooperation name"</td>
                  <td>{cooperation.target}</td>
                  {/* <td>{cooperation.privacyRequirement.toString()}</td>
                  <td>
                    <button onClick = {()=>this.load(cooperation.ipfsHashShare)}>Downlod share</button>
                  </td>
                  <td>{cooperation.column}</td>
                  <td>{cooperation.privacyRequirement.toString()}</td>
                  {result} */}
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