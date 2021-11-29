import React, { Component } from "react";
import { Router, Switch, Route } from "react-router-dom";
import HomePage from './components/Pages/HomePage';
import CreatePage from "./components/Pages/CreatePage";
import CreateCooperation from "./components/Pages/CreateCooperation";
import MemberInform from "./components/Pages/MemberInform";
import CooperationList from "./components/Pages/CooperationList";
import Upload from "./components/Pages/Upload";
import UploadShare from "./components/Pages/UploadShare";
import PendingList from "./components/Pages/PendingList";
import CooperationInform from "./components/Pages/CooperationInform";
import history from './History';

export default class Routes extends Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route path="/" exact component={HomePage} />
                    <Route path="/CreatePage" component={CreatePage} />
                    <Route path="/CreateCooperation" component={CreateCooperation} />
                    <Route path="/MemberInform" component={MemberInform} />
                    <Route path="/CooperationList" component={CooperationList} />
                    <Route path="/PendingList" component={PendingList} />
                    <Route path="/Upload" component={Upload} />
                    <Route path="/UploadShare" component={UploadShare} />
                    <Route path="/CooperationInform" component={CooperationInform} />
                </Switch>
            </Router>
        )
    }
}