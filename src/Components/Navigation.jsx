import { NavLink } from 'react-router-dom';

export default function Navigation({ navItems }) {
    const activeClassName = 'border-b-2 border-blue-500 text-blue-500';

    return (
        <div className='flex p-2'>
            {navItems.map((item, index) => (
                <NavLink
                    key={index}
                    to={item.path}
                    className={({ isActive }) => `px-3 py-2 ${isActive ? activeClassName : ''}`}
                >
                    {item.label}
                </NavLink>
            ))}
        </div>
    );
}