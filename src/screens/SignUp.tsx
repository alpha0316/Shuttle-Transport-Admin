import { useState } from 'react'
import PrimaryButton from '../Components/PrimaryButton'
import { useNavigate } from 'react-router-dom'

function SignUp() {

  const navigate = useNavigate()

  return (
    <div style={{
      marginBlock: 24,
      marginInline: 54,
      display: 'flex',
      flexDirection: 'column',
      gap: 120
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div className='flex gap-2 items-center'>
          <div className="w-8 h-8 p-1.5 bg-green-600 rounded-lg inline-flex flex-col justify-center items-center gap-2.5">
            <div className="justify-center text-white text-base font-bold ">S</div>
          </div>
          <div className='flex items-center justify-center flex-col'>
            <div className="justify-center">
              <span className="text-green-600 text-sm font-bold p-0">Shuttle</span>
              <span className="text-black/50 text-sm font-bold ">App</span>
            </div>
            <div className="justify-center text-black/50 text-[10px] font-normal p-0">Transport Union</div>
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        flexDirection: 'column'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          gap: 4,
          width: 330
        }}>
          <h1 style={{
            margin: 0,
            fontSize: 24,
            fontWeight: '700',
            textAlign: 'left',
          }}>Welcome To Shuttle Admin</h1>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          gap: 12,
          flexDirection: 'column'
        }}>
          <div style={{ margin: "4px 0", display: "flex", flexDirection: "column", gap: 4, alignItems: 'self-start' }}>
            <label style={{ fontSize: 14, fontWeight: 500, color: "#333" }}>
              Email
            </label>
            <input
              type="text"
              placeholder="Enter Your Email"
              style={{
                padding: "10px 12px",
                fontSize: 14,
                borderRadius: 8,
                border: "1px solid #ccc",
                width: 330
              }}
            />
          </div>
          <div style={{ margin: "4px 0", display: "flex", flexDirection: "column", gap: 4, alignItems: 'self-start' }}>
            <label style={{ fontSize: 14, fontWeight: 500, color: "#333" }}>
              Password
            </label>
            <input
              type="password"
              placeholder="Enter Your Password"
              style={{
                padding: "10px 12px",
                fontSize: 14,
                borderRadius: 8,
                border: "1px solid #ccc",
                width: 330
              }}
            />
          </div>
          
          {/* ✅ Navigate to /app when button clicked */}
          <PrimaryButton title='Sign Up' onClick={() => navigate('/app')} />
        </div>
      </div>
    </div>
  )
}

export default SignUp
