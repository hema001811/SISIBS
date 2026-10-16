import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Alert } from 'react-native';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

// Import Screens
import Login from './Screens/Login.js';
import Main from './Screens/Main.js';
import Main2 from './Screens/Main2.js';
import Profile from './Screens/profile.js';
import cp from './Screens/Academics/cp.js';
import Logout from './Screens/logout.js';
import Login2 from './Screens/Login2.js';
import Courses from './Screens/Academics/cources.js';
import Examshedule from './Screens/Examination/Examshedule.js';
import MyAttPer from './Screens/Academics/Myattper.js';
import MyFaculty from './Screens/Academics/Myfaculty.js';
import Semester from './Screens/Academics/Semester.js';
import Receipts from './Screens/Fee/Receipts.js';
import FeeStructure from './Screens/Fee/Feestucture.js';
import SendNotification from './Screens/SendNotification.js';
import NotificationScreen from './Screens/NotificationScreen.js';
import NotificationList from './Screens/NotificationList.js';
import ReadNotification from './Screens/ReadNotification.js';
import MyRegistrations from './Screens/Academics/MyRegistrations.js';
import CourseWiseAttendance from './Screens/Academics/CourseWiseAttendance.js';
import MyElectives from './Screens/Academics/MyElectives.js';
import Gradesheet from './Screens/Examination/Gradesheet.js';
import AllGrades from './Screens/Academics/AllGrades .js';
import Resources from './Screens/Placements/Resources.js';
import JobPostings from './Screens/Placements/JobPostings.js';
import JobDetails from './Screens/Placements/JobDetails.js';
import Applied from './Screens/Placements/Applied.js';
import PProfile from './Screens/Placements/Profile.js';
import Calendar from './Screens/Placements/Calendar.js';
import SIPIIR from './Screens/SIP/SIPIIR.js';
import SIPProposal from './Screens/SIP/SIPProposal.js';
import ContinualEvaluation from './Screens/Examination/ContinualEvaluation.js';
import MyFeeSchedule from './Screens/Fee/MyFeeSchedule.js';
import SemCal from './Screens/Academics/SemCal.js';
import CoursesOffer from './Screens/Academics/CoursesOffer.js';
import ElectivesOffer from './Screens/Academics/ElectivesOffer.js';
import SIPCompaniesList from './Screens/SIP/SIPCompaniesList.js';
import MyNotices from './Screens/Academics/MyNotices.js';
//import QrScanner from './Screens/Academics/QrScanner.js';

enableScreens();
const Stack = createStackNavigator();

// Define navigation types for better TypeScript support
type RootStackParamList = {
  Login: undefined;
  Login2: undefined;
  Main: undefined;
  Main2: undefined;
  Profile: undefined;
  'Program Details': undefined;
  'Semester Details': undefined;
  'Semester Calendar':undefined;
  Logout: undefined;
  Courses: undefined;
  'Courses Offer':undefined;
  'My Exam Schedule': undefined;
  'My Faculty': undefined;
  'My Attendance': undefined;
  'My Receipts': undefined;
  'Fee Structure': undefined;
  'Electives Offer':undefined;
  Notifications: undefined;
  NotificationScreen: { notificationData: any };
  QrScanner: undefined;
  NotificationList:undefined;
  ReadNotification:undefined;
  'My Registrations':undefined;
  'Course Wise Attendance':undefined;
  'My Electives':undefined;
  'Grade sheet':undefined;
  'All Grades':undefined;
  'SIP Companies List':undefined;
  'My Notices':undefined;
  Resources:undefined;
  JobPostings:undefined;
  JobDetails:undefined;
  Applied:undefined;
  PProfile:undefined;
  Calendar:undefined;
  SIPProposal:undefined;
  ContinualEvaluation:undefined;
  MyFeeSchedule:undefined;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        setIsLoggedIn(!!token);
      } catch (error) {
        console.error('Failed to fetch user token from AsyncStorage:', error);
      } finally {
        setLoading(false);
      }
    };

    const handleNotification = async () => {
      // Request notification permissions
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Notification permissions granted.');
        getDeviceToken();
      } else {
        Alert.alert('Permissions required', 'Please allow notification permissions to receive updates.');
      }

      // Handle notifications in the background
      messaging().onNotificationOpenedApp(remoteMessage => {
        if (remoteMessage?.data) {
          navigateToNotificationScreen(remoteMessage.data);
        }
      });

      // Handle notifications in the foreground
      const unsubscribe = messaging().onMessage(async remoteMessage => {
        if (remoteMessage.notification?.body ){
          await AsyncStorage.setItem('hasNewNotifications','1');
        }
        Alert.alert('New Notification', remoteMessage.notification?.body || 'You have a new notification.');
      });

      return unsubscribe;
    };

    const getDeviceToken = async () => {
      try {
        const token = await messaging().getToken();
        console.log('Device token:', token);
        // Optionally, store or send this token to your server
      } catch (error) {
        console.error('Failed to get device token:', error);
      }
    };

    checkLoginStatus();
    handleNotification();
  }, []);

  // Function to navigate to the NotificationScreen
  const navigateToNotificationScreen = (notificationData: any) => {
    if (navigationRef.current) {
      navigationRef.current.navigate('NotificationScreen', { notificationData });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName={isLoggedIn ? 'Main2' : 'Login'}
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0000FF',
          },
          headerTitleStyle: {
            color: '#FFFFFF',
            fontSize: 20,
            fontWeight: 'bold',
          },
          headerTintColor: '#FFFFFF',
        }}
      >
        {/* Define your routes */}
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Login2" component={Login2} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={Main} options={{ headerShown: false }} />
        <Stack.Screen name="Main2" component={Main2} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Program Details" component={cp} />
        <Stack.Screen name="Semester Details" component={Semester} />
        <Stack.Screen name="Semester Calendar" component={SemCal} />
        <Stack.Screen name="Logout" component={Logout} />
        <Stack.Screen name="Courses" component={Courses} />
        <Stack.Screen name="Courses Offer" component={CoursesOffer} />
        <Stack.Screen name="Exam Schedule" component={Examshedule} />
        <Stack.Screen name="My Faculty" component={MyFaculty} />
        <Stack.Screen name="My Attendance" component={MyAttPer} />
        <Stack.Screen name="My Receipts" component={Receipts} />
        <Stack.Screen name="Fee Structure" component={FeeStructure} />
        <Stack.Screen name="Notifications" component={SendNotification} />
        <Stack.Screen name="NotificationScreen" component={NotificationScreen} options={{ title: 'Notification' }} />
        <Stack.Screen name="NotificationList" component={NotificationList} options={{ title: 'Notifications' }} />
        <Stack.Screen name="ReadNotification" component={ReadNotification} options={{ title: 'Read Notification' }} />
        <Stack.Screen name="My Registrations" component={MyRegistrations} />
        <Stack.Screen name="Course Wise Attendance" component={CourseWiseAttendance} options={{ title: 'Session Wise Attendance' }}/>
        <Stack.Screen name="My Electives" component={MyElectives} />
        <Stack.Screen name="Electives Offer" component={ElectivesOffer} />
        <Stack.Screen name="Grade sheet" component={Gradesheet} />
        <Stack.Screen name="All Grades" component={AllGrades} />
        <Stack.Screen name="Resources" component={Resources} />
        <Stack.Screen name="JobPostings" component={JobPostings}/>
        <Stack.Screen name="JobDetails" component={JobDetails}/>
        <Stack.Screen name="Applied" component={Applied}/>
        <Stack.Screen name="PProfile" component={PProfile} options={{ title: 'Placement Profile' }}/>
        <Stack.Screen name="Calendar" component={Calendar}/>
        <Stack.Screen name="SIPIIR" component={SIPIIR} options={{ title: 'SIP IIR' }}/>
        <Stack.Screen name="SIPProposal" component={SIPProposal} options={{ title: 'SIP Proposal' }}/>
        <Stack.Screen name="ContinualEvaluation" component={ContinualEvaluation} options={{ title: 'Continual Evaluation' }}/>
        <Stack.Screen name="MyFeeSchedule" component={MyFeeSchedule} options={{ title: 'My Fee Schedule' }}/>
        <Stack.Screen name="SIP Companies List" component={SIPCompaniesList} options={{ title: 'SIP Companies List' }}/>
        <Stack.Screen name="My Notices" component={MyNotices} options={{ title: 'My Notices' }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
