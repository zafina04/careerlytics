import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

//All the data
const OCCUPATIONS = [
    'Software Engineer',
    'Data Analyst',
    'Nurse',
    'Teacher',
    'Accountant',
  ]


//this function is the general side panel layout
function SidePanel({ children }) {

    return <div style = {styles.sidePanel}>{children}</div>
      
}

function FilterLabel({ children }) {

    return <div style = {styles.filterLabel}>{children}</div>

}



export default function FindOccupation() {
    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            
            {/*Calling the general side panel here*/}
            <SidePanel>

                

            <p style={{ color: 'white' }}>Side panel content here</p>



          </SidePanel>
          <div>Main content here</div>
        </div>
      )
}



// style (css)

const styles = {

    page: {
        minHeight: 'calc(100vh - 60px)',
        background: '#f8faff',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        padding: '2rem 2.5rem',
      },





}