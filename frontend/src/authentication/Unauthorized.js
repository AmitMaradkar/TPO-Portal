import React from 'react'
import { Link } from 'react-router-dom'

const UnAuthorized = () => {
  return (
    <div className="text-center">
      <div className="card text-center">
                    <div className="card-body">
                 <Link to="/" style={{textDecoration:"none",color:"gray"}}>  College TnP Platform </Link>
                    </div>
        </div>
      <h3 className='my-4'>Unauthorized!</h3>
    </div>
  )
}

export default UnAuthorized