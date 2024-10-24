import { NavigationObj } from "../Types/navigationTypes";

import Login from "../Screens/Login";
import Signup from "../Screens/Signup";
import Home from "../Screens/Home";
import Contacts from "../Screens/Contacts";
import AlarmScreen from "../Screens/AlarmScreen";

export enum ScreenNameConstants {
 LOGIN = 'Login',
 SIGNUP = 'Sign Up',
 HOME = 'Home',
 CONTACTS = 'Contacts',
 ALARM_SCREEN = 'Alarm Screen'
}

export const authNavigationList: NavigationObj[] = [
    {
        name: ScreenNameConstants.LOGIN,
        component: Login
    },
    {
        name: ScreenNameConstants.SIGNUP,
        component: Signup
    }
]

export const appNavigationList: NavigationObj[] = [
    {
        name: ScreenNameConstants.HOME,
        component: Home
    },
    {
        name: ScreenNameConstants.CONTACTS,
        component: Contacts
    },
    {
        name: ScreenNameConstants.ALARM_SCREEN,
        component: AlarmScreen
    }
]

