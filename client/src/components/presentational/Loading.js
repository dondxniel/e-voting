const Loading = ({variant}) => {
    if(variant === "sm"){
        return (
            <img src="/images/loading.svg" alt="Loading..." className = "loading sm-loading" />
        )
    }else if(variant === "lg"){
        return (
            <div className = "text-center">
                <img src="/images/loading.svg" alt="Loading..." className = "loading lg-loading" />
            </div>
        )
    }
}

Loading.defaultProps = {
    variant: 'sm'
}

export default Loading
