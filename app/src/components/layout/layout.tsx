import { FC, ReactNode } from "react";

interface LayoutProps {
    children?: ReactNode | undefined;
    title?: string | undefined;
}

const Layout: FC<LayoutProps> = ({ children, title }) => {
    return (
        <div className="flex h-screen flex-row">
            {title && <h1>{title}</h1>}
            <main>{children}</main>
        </div>
    )
}

export default Layout