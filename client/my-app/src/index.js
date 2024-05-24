import React from 'react';
import { render } from 'react-dom';

import App from  './components/App';


// import pages components
import Landing from './components/pages/Landing';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import OnRegister from './components/pages/OnRegister';
import OnEmailVerify from './components/pages/OnEmailVerify';
import BasicInfo from './components/pages/BasicInfo';
import MainHoc from './components/pages/MainHOC';

// 404 page
import FourOFour from './components/pages/FourOFour';

// router dependencies
import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';


import store from './store';





const router = (
    <Provider store={store}>
        <BrowserRouter>
          
          <Route path="/" component={App}>
              <Switch>
                  <Route exact path="/" component={Landing}/>
                  <Route exact path="/login" component={Login}/>
                  <Route exact path="/register" component={Register}/>
                  <Route exact path="/complete-registeration/email-verification/:token" component={OnEmailVerify} />
                  <Route exact path="/registeration-first-step-complete/:prelims" component={OnRegister} />
                  <Route path="/(student|recruiter|employer)/basicInfo" component={BasicInfo}/>
                  <Route path="/(s|e|r)" component={MainHoc}/>
                  <Route component={FourOFour}/>
              </Switch>
          </Route>

        </BrowserRouter>
    </Provider>
)

render(router, document.getElementById('root'));