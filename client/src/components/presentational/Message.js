const Message = ({message}) => {
    return (                
        <div className = "alert text-center">
            {(message.variant === "success") ? 
                <div className = "alert-success p-2">{message.message}</div>
                :
                <div className = "alert-danger p-2">{message.message}</div>
            }
        </div>
    )
}

export default Message
