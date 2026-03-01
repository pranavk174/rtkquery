import React from 'react'

const Modal = ({ open, onClose }: any) => {
    return (
        <div className={`h-screen w-full  fixed inset-0 flex justify-center items-center
     ${open ? 'visible' : 'invisible'}
    `}>
            <div className='fixed inset-0 bg-black/50'> </div>
            <div style={{ transform: `translateX(-${open ? 0 : 300}%)` }} className='fixed  bg-red-500 w-full transition-all duration-400 ease-in-out max-w-[500px] h-[400px] '>
                Modal content
                <button className='text-white bg-blue-500' onClick={onClose}>
                    Close
                </button>
            </div>




        </div>
    )
}

export default Modal