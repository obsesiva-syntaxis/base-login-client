import './Loader.scss';

const Loader = () => {
    return (
        <div className="loader" data-testid="loader">
            <div className="loader__ellipsis">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    )
}

export default Loader;