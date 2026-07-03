import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Forgot from './pages/Forgot'
import Packages from './pages/Packages'
import Trainers from './pages/Trainers'
import Services from './pages/Services'
import Contact from './pages/Contact'
import Profile from './pages/Profile'
import HomeMember from './pages/member/HomeMember'
import CheckIn from './pages/member/Checkin'
import Schedule from './pages/member/Schedule'
import TrainerDetail from './pages/TrainerDetail'
import MyPackage from './pages/member/MyPackage'
import MyService from './pages/member/MyService'
import MyTrainerPackage from './pages/member/MyTrainerPackage'
import PTBooking from './pages/member/PTBooking'
import Payment from './pages/Payment'
import PaymentSuccess from './pages/PaymentSuccess'

import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Checkout from './pages/Checkout'
import Checkin from './pages/employee/Checkin'
import SellPackage from './pages/employee/SellPackage'
import EmployeeSuccess from './pages/employee/EmployeeSuccess'
import RenewPackage from './pages/employee/RenewPackage'
import GuestRoute from './routes/GuestRoute'
import ProtectedLogin from './routes/ProtectedLogin'
import MemberRoute from './routes/MemberRoute'
import RoleRoute from './routes/RoleRoute'
import Members from './pages/employee/Members'
import MemberDetail from './pages/employee/MemberDetail'
import EmployeeServices from './pages/employee/Services'
import Dashboard from './pages/employee/Dashboard'
import EmployeeProfile from './pages/employee/EmployeeProfile'
import TrainerDashboard from './pages/trainer/TrainerDashboard'
import TrainerSchedule from './pages/trainer/TrainerSchedule'
import TrainerMembers from './pages/trainer/TrainerMembers'
import TrainerProfile from './pages/trainer/TrainerProfile'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<GuestRoute/>}>
            <Route path='/login' element={<Login/>}></Route>
            <Route path='/register' element={<Register/>}></Route>
            <Route path='/forgot' element={<Forgot/>}></Route>
        </Route>
        
        <Route path='/' element={<Home/>}></Route>
        
        <Route path='/packages' element={<Packages/>}></Route>
        <Route path='/trainers' element={<Trainers/>}></Route>
        <Route path='/trainers/:id' element={<TrainerDetail/>}></Route>
        <Route path='/services' element={<Services/>}></Route>
        <Route path='/contact' element={<Contact/>}></Route>

        <Route element={<ProtectedLogin/>}>
            <Route path='/profile' element={<Profile/>}></Route>
            <Route path='/payment' element={<Payment/>}></Route>
            <Route path='/payment-success' element={<PaymentSuccess/>}></Route>
            <Route path='/checkout/:paymentId' element={<Checkout/>}></Route>
        </Route>
        
        <Route element={<MemberRoute/>}>
            <Route path='/member' element={<HomeMember/>}></Route>
            <Route path='/member/checkin' element={<CheckIn/>}></Route>
            <Route path='/member/schedule' element={<Schedule/>}></Route>
            <Route path='/member/trainers' element={<Trainers/>}></Route>
            <Route path='/member/trainers/:id' element={<TrainerDetail/>}></Route>
            <Route path='/member/my-package' element={<MyPackage/>}></Route>
            <Route path='/member/my-service' element={<MyService/>}></Route>
            <Route path='/member/my-trainer-package' element={<MyTrainerPackage/>}></Route>
            <Route path='/member/pt-booking/:id' element={<PTBooking/>}></Route>
        </Route>
        
        <Route element={<RoleRoute roles={[2]}/>}>
            <Route path='/employee' element={<Dashboard/>}></Route>
            <Route path='/employee/checkin' element={<Checkin/>}></Route>
            <Route path='/employee/sell-package' element={<SellPackage/>}></Route>
            <Route path='/employee/payment-success/:paymentId' element={<EmployeeSuccess/>}></Route>
            <Route path='/employee/renew-package' element={<RenewPackage/>}></Route>
            <Route path='/employee/members' element={<Members/>}></Route>
            <Route path='/employee/members/:id' element={<MemberDetail/>}></Route>
            <Route path='/employee/services' element={<EmployeeServices/>}></Route>
            <Route path='/employee/profile' element={<EmployeeProfile/>}></Route>
            
        </Route>

        <Route element={<RoleRoute roles={[3]}/>}>
            <Route path='/trainer' element={<TrainerDashboard/>}></Route>
            <Route path='/trainer/schedules' element={<TrainerSchedule/>}></Route>
            <Route path='/trainer/members' element={<TrainerMembers/>}></Route>
            <Route path='/trainer/profile' element={<TrainerProfile/>}></Route>
        </Route>

      </Routes>
      <ToastContainer/>
    </BrowserRouter>
  )
}

export default App
