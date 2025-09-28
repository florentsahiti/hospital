import React, { useContext } from 'react'
import { DoctorContext } from '../context/DoctorContext'
import { NavLink } from 'react-router-dom'

const DoctorSidebar = () => {
  
  const { dToken } = useContext(DoctorContext)
  
  return (
    <div>
      <div className='min-h-screen bg-white border-r'>
        {
          dToken && <ul className='text-[#515151] mt-5'>

            <NavLink 
              className={({isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`} 
              to={'/doctor-dashboard'}
            >
              <p>Dashboard</p>
            </NavLink>

            <NavLink 
              className={({isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`} 
              to={'/my-appointments'}
            >
              <p>My Appointments</p>
            </NavLink>
            
            <NavLink 
              className={({isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`} 
              to={'/my-patients'}
            >
              <p>My Patients</p>
            </NavLink>
            
            <NavLink 
              className={({isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''}`} 
              to={'/doctor-profile'}
            >
              <p>Profile</p>
            </NavLink>

          </ul>
        }
      </div>
    </div>
  )
}

export default DoctorSidebar
