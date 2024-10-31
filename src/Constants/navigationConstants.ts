import { NavigationObj } from "../Types/navigationTypes";

import Login from "../Screens/Login";
import Signup from "../Screens/Signup";
import Home from "../Screens/Home";
import Contacts from "../Screens/Contacts";
import AlarmScreen from "../Screens/AlarmScreen";
import CompleteProfile from "../Screens/CompleteProfile";

export enum ScreenNameConstants {
    LOGIN = 'Login',
    SIGNUP = 'Sign Up',
    HOME = 'Home',
    CONTACTS = 'Contacts',
    ALARM_SCREEN = 'Alarm Screen',
    COMPLETE_PROFILE = 'Complete Profile'
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
    }
]

export const appNavigationList: NavigationObj[] = [
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

