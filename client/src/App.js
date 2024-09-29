import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./ErrorBoundary";
import NotFound from "./error/NotFound";
import AddCrop from "./market/add-crops";
import CropList from "./market/manage-crop";

const Home = lazy(() => import("./main/home"));
const LoginComponent = lazy(() => import('./login-register/login'));
const RegisterComponent = lazy(() => import('./login-register/register'));

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/:userId?" element={<Home />} />
            <Route path="/login" element={<LoginComponent />} />
            <Route path="/register" element={<RegisterComponent />} />
            <Route path="/addCrops/:userId" element={<AddCrop />} />
            <Route path="/manageCrops/:userId" element={<CropList />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
