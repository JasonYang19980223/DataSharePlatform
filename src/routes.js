import React, { Component } from "react";
import { Router, Switch, Route } from "react-router-dom";
import HomePage from './components/Pages/HomePage';
import CreatePage from "./components/Pages/CreatePage";
import CreateCooperation from "./components/Pages/CreateCooperation";
import MemberInform from "./components/Pages/MemberInform";
import CooperationList from "./components/Pages/CooperationList";
import Upload from "./components/Pages/Upload";
import JoinCooperation from "./components/Pages/JoinCooperation";
import PendingList from "./components/Pages/PendingList";
import CooperationInform from "./components/Pages/CooperationInform";
import MemberCols from "./components/Pages/MemberCols";
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
                    <Route path="/JoinCooperation" component={JoinCooperation} />
                    <Route path="/CooperationInform" component={CooperationInform} />
                    <Route path="/MemberCols" component={MemberCols} />
                </Switch>
            </Router>
        )
    }
}