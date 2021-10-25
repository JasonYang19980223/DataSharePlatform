import React, { Component } from "react";
import { Router, Switch, Route } from "react-router-dom";
import App from './components/App';
import Create from "./components/Create";
import Request from "./components/Request";
import history from './History';

export default class Routes extends Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route path="/" exact component={App} />
                    <Route path="/Create" component={Create} />
                    <Route path="/Request" component={Request} />
                </Switch>
            </Router>
        )
    }
}