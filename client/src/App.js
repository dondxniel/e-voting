import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import NavigationBar from './components/presentational/NavigationBar';
import Footer from './components/presentational/Footer';
import Home from './components/pages/Home';
import AdminLogin from './components/pages/AdminLogin';
import AdminHome from './components/pages/admin/Home';
import StartElection from './components/pages/admin/StartElection';
import Admins from './components/pages/admin/Admins';
import ApprovedParties from './components/pages/admin/ApprovedParties';
import RegisterAsVoter from './components/pages/RegisterAsVoter';
import {  useSelector } from 'react-redux';

function App() {
 
  const adminLoggedIn = useSelector(state => state.adminLoggedIn);
  const adminType = useSelector(state => state.adminType);

  return (
      <Router>
        <NavigationBar />
        <Switch>
          <Route path = "/" exact strict >
            <Home />
          </Route>
          <Route path = "/register" >
            <RegisterAsVoter />
          </Route>
          <Route path = "/login" >
            <AdminLogin />
          </Route>
          <Route path = "/admin/home" >
            { adminLoggedIn ? <AdminHome /> : <Redirect to = "/" /> }
          </Route>
          <Route path = "/admin/start-election" >
            { adminLoggedIn ? <StartElection /> : <Redirect to = "/" /> }
          </Route>
          <Route path = "/admin/admins" >
            { adminLoggedIn ? <Admins /> : <Redirect to = "/" /> }
          </Route>
          <Route path = "/admin/approved-parties" >
            { adminLoggedIn ? <ApprovedParties /> : <Redirect to = "/" /> }
          </Route>
        </Switch>
        <Footer />
      </Router>
  );
}

export default App;
