import React from 'react';
import ReactDOM from 'react-dom';
import { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import Modal from 'react-modal';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './AuthContext';
import LearningCourse from './LearningCourse';
import Login from './Login';
import SignUp from './SignUp';
import Reset from './Reset';
import NewPassword from './NewPassword';
import Courses from './Courses';
import { Content } from './types';
import CourseDetail from './CourseDetail';
import CourseContent from './CourseContent';
import Movies from './Movies';
import { pdfjs } from 'react-pdf';
import PlayMovie from './PlayMovie';
import Profile from './Profile';
import Members from './Members';
import MemberDetail from './MemberDetail';
import Plans from './Plans';
import Subscribe from './Subscribe';
import Invite from './Invite';
import Terms from './Terms';
import PrivacyPolicy from './PrivacyPolicy';
import Regulation from './Regulation';
import Usage from './Usage';
import Constitution from './Constitution';
// tslint:disable-next-line:no-var-requires
pdfjs.GlobalWorkerOptions.workerSrc = require("pdfjs-dist/build/pdf.worker.entry");
// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PK ?? "ERROR!");

const App = () => {
  const [ contents, setContents ] = useState<Content[]>([]);
  const [ progress, setProgress ] = useState<any[]>([]);
  const [ plan, setPlan ] = useState("FREE");
  const [ content, setContent ] = useState<number>(0);
  const [ detail, setDetail ] = useState<number>(0);
  const [ movie, setMovie ] = useState<string | undefined>(undefined);
  const [ user, setUser ] = useState<any>(undefined);
  return (
    <AuthProvider>
      <Elements stripe={stripePromise}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LearningCourse setPlan={setPlan} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/reset" element={<Reset />} />
            <Route path="/newpassword" element={<NewPassword />} />
            <Route path="/courses/view" element={<Courses plan={plan} setProgress={setProgress} contents={contents} setContents={setContents} setContent={setContent} />} />
            <Route path="/courses" element={<LearningCourse setPlan={setPlan} />} />
            <Route path="/courses/details" element={<CourseDetail plan={plan} contents={contents} content={content} setDetail={setDetail} />} />
            <Route path="/courses/content" element={<CourseContent plan={plan} content={content} detail={detail} progress={progress} setProgress={setProgress} contents={contents} setContents={setContents} />} />
            <Route path="/movies" element={<Movies setMovie={setMovie} />} />
            <Route path="/movies/play" element={<PlayMovie movie={movie} />} />
            <Route path="/members" element={<Members setMember={setUser} />} />
            <Route path="/members/detail" element={<MemberDetail member={user} />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/subscribe" element={<Subscribe />} />
            <Route path="/invite" element={<Invite />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacypolicy" element={<PrivacyPolicy />} />
            <Route path="/regulation" element={<Regulation />} />
            <Route path="/usage" element={<Usage />} />
            <Route path="/usage/constitution" element={<Constitution />} />
          </Routes>
        </BrowserRouter>
      </Elements>
    </AuthProvider>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
