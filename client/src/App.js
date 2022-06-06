import React,{useState,createContext} from 'react'
import {BrowserRouter,Route,Switch} from 'react-router-dom';
import Nav from './Component/Nav';
import Register from './Component/Register';
import Login from './Component/login';
import Myprofile from './Component/Myprofile';

export const store = createContext();

const App = () => {
  const [token,setToken] = useState(null);
  return (
    <div>
      <store.Provider value={[token,setToken]}>
      <BrowserRouter>
        <Nav />
        <Switch>
          <Route path='/register' component={Register} />
          <Route path='/' component={Login} />
          <Route path='/myprofile' component={Myprofile} />
        </Switch>
      </BrowserRouter>
      </store.Provider>
    </div>
  )
}

export default App