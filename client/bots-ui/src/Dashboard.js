import React from 'react'
import Documentation from './Documentation';
import Arena from './Arena';
import './Dashboard.css'
import { RobotOutlined } from '@ant-design/icons';
import { BookOutlined } from '@ant-design/icons';
import { useEffect } from 'react'

export default function Dashboard(props) {
  let toDoc = () => {
    props.setDashboardState('doc');
    props.setHeaderState('doc');
  }

  let toArena = () => {
    props.setDashboardState('arena');
    props.setHeaderState('arena');
  }

  // cancel initial scroll
  window.scrollTo(0, 0);

  return(
    <div id = "dashboard">
      {props.dashboardState === 'start' &&
        <section id = "About">
          <div className = "wrapper">
            <h2> Who we are </h2>
            <p id = "motto"> We are the ones who conquer IP </p>
          </div>
        </section> 
      }
      
      {props.dashboardState === 'start' &&
        <section id = "doc-section">
          <div className = "wrapper">
            <button className = "btn" onClick = {toDoc}>
              <BookOutlined className="book"/>
              <div id = "doc">Documentation</div>
            </button>
            </div>
        </section> 
      }
      
      {props.dashboardState === 'start' &&
        <section id = "arena-section">
          <div className = "wrapper">
            <button className = "btn" onClick = {toArena}>
              <RobotOutlined className="robot"/>
              <div id = "arena">Arena</div>
            </button>
          </div>
        </section>
      }

      {/* if Documentation button was clicked */}
      {props.dashboardState === 'doc' && 
            <Documentation/>
      }

      {/* if Arena button was clicked */}
      {props.dashboardState === 'arena' && 
            <Arena/>
      }
    </div>
  );
}