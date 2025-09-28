import React, { useContext } from 'react'
import Login from './pages/Login'
import { ToastContainer, toast } from 'react-toastify'
import  'react-toastify/dist/ReactToastify.css'
import { AdminContext } from './context/AdminContext'
import Navbar from './components/Navbar'
import DoctorNavbar from './components/DoctorNavbar'
import Sidebar from './components/sidebar'
import { Route, Routes } from 'react-router-dom'
import AllApointments from './pages/Admin/AllApointments'
import AddDoctor from './pages/Admin/AddDoctor'
import DoctorsList from './pages/Admin/DoctorsList'
import Dashboard from './pages/Admin/dashboard'
import { DoctorContext } from './context/DoctorContext'
import DoctorDashboard from './pages/Doctor/DoctorDashboard'
import DoctorSidebar from './components/DoctorSidebar'
import MyAppointments from './pages/Doctor/MyAppointments'
import MyPatients from './pages/Doctor/MyPatients'
import MedicalRecords from './pages/Doctor/MedicalRecords'
import DoctorProfile from './pages/Doctor/DoctorProfile'



const App = () => {

  const { aToken } = useContext(AdminContext)
  const { dToken } = useContext(DoctorContext)

  // Check if user is admin
  const isAdmin = aToken && !dToken
  // Check if user is doctor
  const isDoctor = dToken && !aToken

  return aToken || dToken ? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer />
      {isAdmin && <Navbar />}
      {isDoctor && <DoctorNavbar />}
      <div className='flex items-start'>
        {isAdmin && <Sidebar />}
        {isDoctor && <DoctorSidebar />}
        <Routes>
          {isAdmin && (
            <>
              <Route path='/' element={<></>} />
              <Route path='/admin-dashboard' element={<Dashboard />} />
              <Route path='/all-appointments' element={<AllApointments />} />
              <Route path='/add-doctor' element={<AddDoctor />} />
              <Route path='/doctors-list' element={<DoctorsList />} />
            </>
          )}
          {isDoctor && (
            <>
              <Route path='/' element={<DoctorDashboard />} />
              <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
              <Route path='/my-appointments' element={<MyAppointments />} />
              <Route path='/my-patients' element={<MyPatients />} />
              <Route path='/medical-records' element={<MedicalRecords />} />
              <Route path='/doctor-profile' element={<DoctorProfile />} />
            </>
          )}
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  )
}

export default App
