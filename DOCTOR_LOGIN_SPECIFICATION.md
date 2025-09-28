# Doctor Login Functionality Specification

## Current Issue
When a doctor logs in successfully, the application redirects to the admin dashboard instead of a doctor-specific dashboard. The current routing logic treats both admin and doctor tokens the same way.

## High-Level Requirements

### 1. Authentication Flow
- Doctor should be able to login with their credentials (email/password)
- After successful login, doctor should be redirected to a doctor-specific dashboard
- Doctor should not have access to admin-only features

### 2. Doctor Dashboard Features
The doctor dashboard should include:
- **Doctor Profile Management**: View and edit personal information
- **My Appointments**: View upcoming and past appointments
- **Patient Management**: View patient details for their appointments
- **Availability Management**: Toggle availability status
- **Appointment Actions**: Accept/decline appointments, add notes

### 3. UI/UX Requirements

#### Login Page
```
┌─────────────────────────────────────┐
│           Doctor Login               │
├─────────────────────────────────────┤
│ Email: [________________]           │
│ Password: [________________]         │
│                                     │
│        [Login Button]               │
│                                     │
│ Admin Login? Click Here             │
└─────────────────────────────────────┘
```

#### Doctor Dashboard Layout
```
┌─────────────────────────────────────────────────────────┐
│ [Logo] Doctor Dashboard                    [Profile ▼]  │
├─────────────────────────────────────────────────────────┤
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐         │
│ │ Today's │ │ Total  │ │ Pending │ │ Available│         │
│ │ Appts   │ │ Patients│ │ Appts   │ │ Status  │         │
│ │   5     │ │   120  │ │   3     │ │   ON    │         │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘         │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐ │
│ │              Upcoming Appointments                  │ │
│ │ ┌─────────────────────────────────────────────────┐ │ │
│ │ │ 10:00 AM - John Doe (Cardiology)               │ │ │
│ │ │ 11:30 AM - Jane Smith (General Checkup)       │ │ │
│ │ │ 02:00 PM - Mike Johnson (Follow-up)            │ │ │
│ │ └─────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

#### Doctor Sidebar Navigation
```
┌─────────────────┐
│ 🏠 Dashboard     │
│ 📅 My Appointments│
│ 👥 My Patients   │
│ ⚙️  Profile       │
│ 📊 Reports       │
│ 🚪 Logout        │
└─────────────────┘
```

### 4. Technical Implementation Requirements

#### Routing Logic
- Separate routing for admin vs doctor users
- Doctor users should only see doctor-specific routes
- Admin users should only see admin-specific routes

#### Context Management
- Enhance DoctorContext with doctor-specific functions
- Add doctor dashboard data fetching
- Implement doctor appointment management

#### Security
- Doctor tokens should not grant admin access
- Admin tokens should not grant doctor access
- Proper role-based access control

### 5. API Endpoints Needed
- `GET /api/doctor/dashboard` - Get doctor dashboard data
- `GET /api/doctor/appointments` - Get doctor's appointments
- `PUT /api/doctor/availability` - Update availability status
- `GET /api/doctor/profile` - Get doctor profile
- `PUT /api/doctor/profile` - Update doctor profile

### 6. Database Considerations
- Doctor model should include availability status
- Appointments should be linked to doctors
- Doctor profile information should be accessible

## Implementation Plan

### Phase 1: Fix Routing Logic
1. Update App.jsx to handle different user types
2. Create separate routing for doctors
3. Implement role-based navigation

### Phase 2: Create Doctor Dashboard
1. Create doctor dashboard component
2. Implement doctor-specific sidebar
3. Add doctor context functions

### Phase 3: Backend API Development
1. Create doctor dashboard API endpoint
2. Implement doctor appointment management
3. Add doctor profile management

### Phase 4: Testing & Refinement
1. Test doctor login flow
2. Verify role-based access control
3. Test all doctor-specific features

## Acceptance Criteria
- [ ] Doctor can login with valid credentials
- [ ] Doctor is redirected to doctor dashboard (not admin dashboard)
- [ ] Doctor can view their appointments
- [ ] Doctor can manage their availability
- [ ] Doctor cannot access admin features
- [ ] Admin cannot access doctor features
- [ ] Proper error handling for invalid credentials
- [ ] Responsive design for all doctor pages

## Questions for Clarification
1. Should doctors be able to see all appointments or only their own?
2. Do doctors need to be able to cancel appointments?
3. Should doctors have access to patient medical records?
4. Do you want a separate doctor registration process?
5. Should there be different doctor roles (e.g., senior doctor, junior doctor)?
