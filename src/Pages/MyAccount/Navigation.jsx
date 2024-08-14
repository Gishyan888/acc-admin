import { NavLink } from 'react-router-dom'

export default function Navigation() {
    const activeClassName = 'border-b-2 border-primary text-primary';

    return (
        <div className='flex p-2'>
            <NavLink
                to='account-details'
                end={true}
                className={({ isActive }) =>
                    `rounded-none border-b-2 border-transparent bg-transparent text-foreground hover:bg-transparent hover:text-primary px-3 py-2 ${
                        isActive ? activeClassName : ''
                    }`
                }
            >
                Account Details
            </NavLink>
            <NavLink
                to='update-password'
                end={true}
                className={({ isActive }) =>
                    `rounded-none border-b-2 border-transparent bg-transparent text-foreground hover:bg-transparent hover:text-primary px-3 py-2 ${
                        isActive ? activeClassName : ''
                    }`
                }
            >
                Update Password
            </NavLink>
        </div>
    )
}