import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminRoutes from './routes/AdminRoutes';
import PrivateRoutes from './routes/PrivateRoutes';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import { configureStore } from './redux/store';

function App() {
  const { store, persistor } = configureStore();
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route exact path='/admin/*' element={<AdminRoutes />} />
          </Route>
        </Routes>
      </PersistGate>
    </Provider>
  );
}

export default App;
