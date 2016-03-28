/**
 * Created by prism on 3/7/16.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import Login from './componets/Login.jsx';
import Dashboard from './componets/Dashboard.jsx';
import {Router, Route, browserHistory} from 'react-router';



ReactDOM.render(
    <Router history={browserHistory} >
        <Route path="/" component={Login}> </Route>
        <Route path="/dashboard" component={Dashboard}> </Route>
    </Router>,
    document.getElementById('app')
);