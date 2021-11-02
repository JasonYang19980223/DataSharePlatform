import React, { Component } from "react";
import { Router, Switch, Route } from "react-router-dom";
import App from './components/App';
import CreatePage from "./components/CreatePage";
import Request from "./components/Request";
import MemberInform from "./components/MemberInform";
import RequestList from "./components/RequestList";
import Upload from "./components/Upload";
import UploadShare from "./components/UploadShare";
import PendingList from "./components/PendingList";
import history from './History';

export default class Routes extends Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route path="/" exact component={App} />
                    <Route path="/CreatePage" component={CreatePage} />
                    <Route path="/Request" component={Request} />
                    <Route path="/MemberInform" component={MemberInform} />
                    <Route path="/RequestList" component={RequestList} />
                    <Route path="/PendingList" component={PendingList} />
                    <Route path="/Upload" component={Upload} />
                    <Route path="/UploadShare" component={UploadShare} />
                </Switch>
            </Router>
        )
    }
}