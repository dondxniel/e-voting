const Footer = () => {
    return (
        <div className = "text-center justify-content-center py-5 mt-5 bg-light">
            <p className="py-5">
                Copyright &copy; {(new Date()).getFullYear()}
            </p>
        </div>
    )
}

export default Footer
