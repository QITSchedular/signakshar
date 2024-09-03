import { useEffect, useState } from 'react';
import { HomePage, TasksPage, ProfilePage } from './pages';
import { withNavigationWatcher } from './contexts/navigation';
import RegistrationForm from './components/manageUser/registrationForm/RegistrationForm';
import SignInForm from './components/manageUser/registrationForm/SignInForm';
import DashUI from './components/dashBoard/dashUI/DashUI';
import Header from './components/dashBoard/Header2/Header';
import { CreateOrSignDocument, Dashboard, SignatureSetup } from './components';
import UserDashboard from './components/UserDashboard/UserDashboard';
import ViewDetailsPage from './components/UserDashboard/viewDetailsPage/ViewDetailsPage';
import ViewDocumentPage from './components/UserDashboard/viewDocumentPage/ViewDocument';
import PreviewPage from './components/previewPage/PreviewPage';
import RecieverPanel from './components/recieverPanel/RecieverPanel';
import RegOtp from './components/manageUser/registrationForm/RegOtp';
import Profile from './components/profile/Profile';
import LogUI from './pages/LogUI/LogUI';


const routes = [
    {
        path:localStorage.getItem('initialUrl')
    },
    {
        path : '/userdashboard', 
        element: UserDashboard
    },
    {
        path: '/tasks',
        element: TasksPage
    },
    {
        path: '/RegistrationForm',
        element: RegistrationForm
    },
    {
        path: '/SignInForm',
        element: SignInForm
    },
    {
        path: '/dashUI',
        element:DashUI
    },
    // {
    //     path: '/Header',
    //     element:Header
    // },
    {
        path: '/dashboard',
        element: Dashboard
    },
    {
        path: '/myProfile',
        element: Profile
    },
    {
        path: '/home',
        element: HomePage
    },
    {
        path: '/profile',
        element: ProfilePage
    },
    {
        path: '/RegOtp',
        element: RegOtp
    },
    {
        path: '/SignatureSetup',
        element: SignatureSetup
    },
    {
        path: '/CreateOrSignDocument',
        element: CreateOrSignDocument
    },
    {
        path: '/RecieverPanel',
        element: RecieverPanel
    },
    {
        path: '/ViewDetailsPage',
        element: ViewDetailsPage
    },
    {
        path: '/ViewDocumentPage',
        element: ViewDocumentPage
    },
    {
        //rajvi code:
        path : '/PreviewPage',
        element: PreviewPage
    },
    {
        //rajvi code:
        path : '/logui',
        element: LogUI
    }
];

export default routes.map(route => {

    return {
        ...route,
        element: withNavigationWatcher(route.element, route.path)
    };
});