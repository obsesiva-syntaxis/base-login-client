import './Menu.scss';

const Menu = () => {
    return (
        <div className="menu">
            <div className="menu__logout">
                <div className="menu__logout-btn">
                    <i className="fas fa-power-off" />
                </div>
            </div>
            <div className="menu__nav">
                <div className="menu__nav-bar">
                    <div className="menu__nav-bar-item">
                        <i className="fas fa-yin-yang"></i>
                    </div>
                    <div className="menu__nav-bar-item">
                        <i className="fas fa-yin-yang"></i>
                    </div>
                    <div className="menu__nav-bar-item">
                        <i className="fas fa-yin-yang"></i>
                    </div>
                    <div className="menu__nav-bar-item">
                        <i className="fas fa-yin-yang"></i>
                    </div>
                    <div className="menu__nav-bar-item">
                        <i className="fas fa-yin-yang"></i>
                    </div>
                    
                </div>

            </div>
            <div className="menu__user">
                <div className="menu__user-info">
                    <div className="menu__user-info-name">Miguel Gonzalez Sierralta</div>
                    <div className="menu__user-info-email">mgonzalez@ucclog.com</div>
                </div>

                <div className="menu__user-avatar">

                </div>
            </div>
        </div>
    )
}

export default Menu;