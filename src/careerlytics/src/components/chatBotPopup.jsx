//ChatBot popup comonent
//This file is to control the popup window for the chatbot, which will be used on all pages of the website. It will allow users to access the chatbot from any page without having to navigate to a specific page for it.


import {useState} from 'react';

//importing the chatbot code
import ChatBot from '../pages/ChatBot';


export default function ChatBotPopup() {

    //This is to keep track if the popup is open or closed
    const [isOpen, setIsOpen] = useState(false);

    return (

        <>
            {/* Only show the popup window if isOpen is true */}
    
            {/*added the feature where if user closes chatbot, chat history will be there when reopening */}
            <div style = {{position: "fixed", bottom: "650px", right: "-10px", width: "580px", height: "30px",zIndex: 1001, transform: "scale(0.65)", display: isOpen ? "block" : "none"}}>

                {/* bring in the existing chatbot*/}
                <ChatBot />

            </div>


            {/* This is the button to open/close the popup */}
            <button onClick = {() => setIsOpen(!isOpen)} 

                style = {{position: "fixed", bottom: "24px", right: "24px", width: "60px", height: "60px", backgroundColor: "#c9a84c", borderRadius: "50%", border: "none", color: "#fff", fontSize: "24px", cursor: "pointer", zIndex: 9999}} 
        
            >

            </button>
    
        </>
    )

}