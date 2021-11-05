import React, { Component } from "react";
import { Router, Switch, Route } from "react-router-dom";
import HomePage from './components/Pages/HomePage';
import CreatePage from "./components/Pages/CreatePage";
import Request from "./components/Pages/Request";
import MemberInform from "./components/Pages/MemberInform";
import RequestList from "./components/Pages/RequestList";
import Upload from "./components/Pages/Upload";
import UploadShare from "./components/Pages/UploadShare";
import PendingList from "./components/Pages/PendingList";
import history from './History';

export default class Routes extends Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route path="/" exact component={HomePage} />
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