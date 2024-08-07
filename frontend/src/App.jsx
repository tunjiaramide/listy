import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './utils/Protected';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import AddProperty from './pages/AddProperty';
import UpdateProperty from './pages/UpdateProperty';
import PropertyListing from './pages/PropertyListing';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/addproperty" element={<AddProperty />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/updateproperty/:id" element={<UpdateProperty />} />
        </Route>
        <Route element={<ProtectedRoute />}>
            <Route path="/listproperty" element={<PropertyListing />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
