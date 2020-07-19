import React from 'react'
import { Link } from 'react-router-dom'

import SmashLogo from './graphics/logo/black-on-white-smash-ultimate-logo.png'

export function LandingPage() {
  return (
    <>
      <div className="landing-page-background">
        <div className="landing-page">
          <img src={SmashLogo} alt="smash ultimate logo" />
          <h3 className="black-text">Combos</h3>
        </div>
        <Link to="/characters">
          <div className="click-to-start bg-red">
            <h3>Click to continue</h3>
          </div>
        </Link>
      </div>
    </>
  )
}