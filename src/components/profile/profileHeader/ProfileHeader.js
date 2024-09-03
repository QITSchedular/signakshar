import React from 'react'
import './ProfileHeader.scss'
import { Button } from 'devextreme-react/button';
import leftIcon from '../svg/arrow-left-s-line.svg'
import { useNavigate } from 'react-router-dom';

export default function ProfileHeader() {
  const navigate = useNavigate();

  const handleClick = () =>{
    navigate('/userdashboard');
  }
  return (
    <React.Fragment>
      <header className='profile-header'>
        <div className='headerName'>Sign-akshar</div>
        <div className='profileBack'>
        <Button icon={leftIcon}
                text="Go Back"
                onClick={handleClick}
               />
        </div>
      </header>
    </React.Fragment>
  )
}
