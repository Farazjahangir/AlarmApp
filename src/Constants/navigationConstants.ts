import { BottomNavigationObj, NavigationObj } from "../Types/navigationTypes";

import Login from "../Screens/Login";
import Signup from "../Screens/Signup";
import Home from "../Screens/Home";
import Contacts from "../Screens/Contacts";
import AlarmScreen from "../Screens/AlarmScreen";
import CompleteProfile from "../Screens/CompleteProfile";
import TabNavigation from "../Navigation/tabNavigation";
import Profile from "../Screens/Profile";
import ForgotPassword from "../Screens/ForgotPassword";

export enum ScreenNameConstants {
    LOGIN = 'Login',
    SIGNUP = 'Sign Up',
    HOME = 'Home',
    CONTACTS = 'Contacts',
    ALARM_SCREEN = 'Alarm Screen',
    COMPLETE_PROFILE = 'Complete Profile',
    TAB_NAV= 'tabNav',
    PROFILE = 'PROFILE',
    FORGOT_PASSWORD = 'Forgot Password'
}

const defaultNavOptions = {
    headerShown: false,
};

export const authNavigationList: NavigationObj[] = [
    {
        name: ScreenNameConstants.LOGIN,
        component: Login,
        options: defaultNavOptions,
    },
    {
        name: ScreenNameConstants.SIGNUP,
        component: Signup,
        options: defaultNavOptions,
    },
    {
        name: ScreenNameConstants.FORGOT_PASSWORD,
        component: ForgotPassword,
        options: defaultNavOptions,
    }
]

export const appNavigationList: NavigationObj[] = [
    {
        name: ScreenNameConstants.TAB_NAV,
        component: TabNavigation,
        options: defaultNavOptions,
    },
    {
        name: ScreenNameConstants.ALARM_SCREEN,
        component: AlarmScreen,
        options: defaultNavOptions,
    },
    {
        name: ScreenNameConstants.COMPLETE_PROFILE,
        component: CompleteProfile,
        options: defaultNavOptions,
    },
]

export const tabNavigationList: BottomNavigationObj[] = [
    {
        name: ScreenNameConstants.HOME,
        component: Home,
        options: defaultNavOptions,
    },
    {
        name: ScreenNameConstants.CONTACTS,
        component: Contacts,
        options: defaultNavOptions,
    },
    {
        name: ScreenNameConstants.PROFILE,
        component: Profile,
        options: defaultNavOptions,
    },
];  