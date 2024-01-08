import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Footer from './components/Footer';
import Header from './components/Header';
import WelcomePage from './components/WelcomePage';
import FormPage from './components/FormPage';
import Login from './components/Login';
import MenuList from './components/MenuList';
import ViewMenu from './components/ViewMenu';
import WelcomeNtr from './components/WelcomeNtr';
import Admin from './components/Admin';
import UserMenus from './components/UserMenus';
import SearchNutritionists from './components/SearchNutritionists';
import Register from './components/Register';
import WriteMenu from './components/WriteMenu';
import MenuUserView from './components/MenuUserView';
import 'bootstrap/dist/css/bootstrap.min.css';
function App() {
  return (
    <div>
      <Router>
        <Header/>
          <div className="main-content">
            <Routes>
              <Route path ="/" exact element = {<Login/>}/>
              <Route path ="/welcome" element = {<WelcomePage/>}/>
              <Route path ="/admin" element = {<Admin/>}/>
              <Route path ="/formpage" element = {<FormPage/>}/>
              <Route path ="/viewpage" element = {<MenuList/>}/>
              <Route path ="/view-menu" element = {<ViewMenu/>}/>
              <Route path ="/view-menu-user" element = {<MenuUserView/>}/>
              <Route path ="/welcome-nutritionist" element = {<WelcomeNtr/>}/>
              <Route path='/user-menus' element = {<UserMenus/>}/>
              <Route path='/viewntr' element = {<SearchNutritionists/>}/>
              <Route path='/register' element = {<Register/>}/>
              <Route path='/formmenu' element = {<WriteMenu/>}/>
            </Routes>
          </div>
        <Footer/>
      </Router>
    </div>
  );
}

export default App;
