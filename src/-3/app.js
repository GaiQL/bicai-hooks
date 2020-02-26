// import React from 'react';
// import routerConfig from './router/index'
// import './app.scss';
// import AppCom from '../appCom'
// export default () => {
//     return <AppCom routerConfig={routerConfig}/>
// };
//

import React, { Suspense } from 'react';
import { HashRouter,Switch, Route,Redirect} from 'react-router-dom'
import routerConfig from './router/index'
import './app.scss';
import '../index.css'
// import Store from 'Common/store/store'
import {commonStore} from 'Common/pages/store'

function Wrong() {
    return <div>404</div>
}


export default () => {
    return <HashRouter>
        <Suspense fallback={<div></div>}>
            <Switch>
                <Redirect exact from='/' to="/native"/>
                {
                    routerConfig.config.map((item,ind) =>{
                        return <Route exact={item.exact} key={ind} path={item.path} render={(location)=>{
                            // Store.getHistory({...location})
                            commonStore.getHistory({...location})
                            return <item.component {...location}/>
                        }}/>
                    })
                }
                <Route component={Wrong}/>
            </Switch>
        </Suspense>
    </HashRouter>
};

