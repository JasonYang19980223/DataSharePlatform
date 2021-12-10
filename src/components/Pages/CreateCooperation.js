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
      columns:[{
        index:Math.random(),
        colName:''
      }],
      miningFunction:'',
      target:''
    }    
    this.handleCol = this.handleCol.bind(this);
    this.handleMiningfun = this.handleMiningfun.bind(this);
    this.handleTarget = this.handleTarget.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.show = this.show.bind(this);
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

  handleCol(idx,e) {
    // 1. Make a shallow copy of the items
    let columns = [...this.state.columns];
    // 2. Make a shallow copy of the item you want to mutate
    let col = {...columns[idx]};
    // 3. Replace the property you're intested in
    col.name = e.target.value;
    // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
    columns[idx] = col;
    // 5. Set the state to our new copy
    this.setState({columns});
  }

  handleMiningfun(e) {
    this.setState({miningFunction:e.target.value});
  }

  handleTarget(e) {
    this.setState({target: e.target.value});
  }

  addCol(){
    this.setState(prevState=>({
      columns:[
        ...prevState.columns,
        {
          index:Math.random(),
          colName:''
        }
      ]
    }))
  }

  delCol(index){
    this.setState({
      columns:this.setState.columns.filter(
        (s,sindex)=> index !== sindex
      )
    })
  }

  clickOnDelete(record) {
    this.setState({
      columns: this.state.columns.filter(r => r !== record)
    });
  }

  /***上傳檔案***/
  // captureFile = (event) =>{
  //   event.preventDefault()
  //   //console.log("file capture")
  //   //process file for ipfs
  //   const file = event.target.files[0]
  //   const reader = new window.FileReader()
  //   reader.readAsArrayBuffer(file)
  //   reader.onloadend = () => {
  //     this.setState({buffer:Buffer(reader.result)})
  //     console.log('buffer',Buffer(reader.result))
  //   }
  //   console.log(event.target.files)
  // }


  // onSubmit = async (event) =>{
  //   event.preventDefault()
  //   console.log("submitting the form")
  //   const file=await ipfs.add(this.state.buffer)
  //   console.log("submitting the form")
  //   const ipfsHash = file.path
  //   console.log("submitting the form")
  //   this.setState({ipfsHash})
  //   console.log(this.state.ipfsHash)
  //   platform.events.createCooperationEvent({})
  //     .on('data',async event=>{
  //       let cooperation = event.returnValues;
  //       console.log(cooperation.target)
  //       await platform.methods.uploadDataset(this.state.ipfs,this.state.privacy,cooperation.cooperationID).send({from:this.state.account})
  //     }
  //   )
  //   await platform.methods.createCooperation(this.state.target).send({from:this.state.account})
  //   const key = await platform.methods.cooperationCnt().call();
  //   console.log(key)
  //   await platform.methods.uploadDataset(this.state.ipfs,this.state.privacy,key).send({from:this.state.account})
  // }

  async handleClick(e) {
    await platform.methods.createCooperation(this.state.target,this.state.miningFunction).send({from:this.state.account})
    let cooid = await platform.methods.cooperationCnt().call()
    console.log(cooid)

    await platform.methods.setDataset(cooid-1).send({from:this.state.account})
    console.log(cooid)
    let dataid = await platform.methods.datasetCnt().call()
    console.log(dataid)
    let columns = this.state.columns
    console.log(columns.length)
    for( let i = 0 ;i<columns.length;i++){
      console.log(columns[i]['name'])
      await platform.methods.addColumn(dataid-1,columns[i]['name']).send({from:this.state.account})
    }
  }

  async show(){
    let columns = this.state.columns
    for( let i = 0 ;i<columns.length;i++){
      console.log(columns[i]['name'])
    }
  }

  render() {
    const styleInput={
      border:'2px solid'
    };
    return (
      <div>
        <Nbar account={this.state.account} manager={this.state.manager}/>
        <div>
          <div>
            <h2> Create cooperation </h2>
              <label>
                <input type="text" placeholder="target" style={styleInput} onChange={ this.handleTarget } />
              </label>
              <br/>
              <label>
               <input type="text" placeholder="mining function" style={styleInput} onChange={ this.handleMiningfun } />
              </label>
              <br/>
              <br/>
          </div>    
          <div>
            <h2> Set Column </h2>  
            {this.state.columns.map((val,idx)=>{
              return(
                <div key={val.index}>
                  <div className="col-row" >
                    <label>
                      <input type="text" placeholder="column" style={styleInput} onChange={(event)=>this.handleCol(idx,event)} />
                    </label>
                  </div>
                  <div className ="col p-4">
                    {idx===0?(
                      <button
                        onClick={() => this.addCol(idx)}
                        type="button"
                        className="btn btn-primary text-center"
                      >
                        add column
                      </button>
                      ):(
                        <button
                          className="btn btn-danger"
                          onClick={() => this.clickOnDelete(val)}
                        >
                          delete column
                        </button>
                      )}
                  </div>
                </div>
              )
            })}
            <br/>
            <br/>
            <br/>
        </div>
        <div>
          <h2> Upload To Chain </h2>
          {/* <form onSubmit = {this.onSubmit} >
            <input type = 'file' onChange = {this.captureFile}/>
            <input type = 'submit' />
          </form> */}

          <label>
            <input
              type="button"
              value="confirm"
              style={{cursor:'pointer'}}
              onClick={this.handleClick}
            />
          </label>
          <label>
            <input
              type="button"
              value="show"
              style={{cursor:'pointer'}}
              onClick={this.show}
            />
          </label>
          </div>
        </div>
      </div>
    );
  }
}


export default Request;