import React from "react";

import Logo from "./Logo";
import TopMenuUnreg from "./TopMenuUnreg";
import TopMenuCompactUnreg from "./TopMenuUnregCompact";

function Header () {
    return (
        <header>
            <Logo />
            <TopMenuCompactUnreg />
            <TopMenuUnreg />
        </header>
    )
}

export default Header;