import { Switch } from 'react-router-dom';
import { RouteWrapper } from './Route';

import { SignIn } from '../pages/SignIn';
import { SignUp } from '../pages/SignUp';

import { Dashboard } from '../pages/Dashboard';
import { Profile } from '../pages/Profile';
import { Customers } from '../pages/Customers';
import { New } from '../pages/New';

export function Routes(){
    return (
        <Switch>
            <RouteWrapper exact path="/" component={SignIn} />
            <RouteWrapper exact path="/register" component={SignUp} />

            {/* isPrivate = digo que a rota é privada, defini em Route.js */}
            <RouteWrapper exact path="/dashboard" component={Dashboard} isPrivate />
            
            <RouteWrapper exact path="/profile" component={Profile} isPrivate />

            <RouteWrapper exact path="/customers" component={Customers} isPrivate />
            <RouteWrapper exact path="/new" component={New} isPrivate />
        
            <RouteWrapper exact path="/new/:id" component={New} isPrivate />
        </Switch>
    )
}