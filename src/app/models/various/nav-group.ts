import { NavLink } from 'src/app/models/various/nav-link';

export interface NavGroup extends NavLink {
    navLinks: NavLink[];
}