import { HomePage } from '@pages/HomePage';
import { MapPage } from '@pages/MapPage';
import { FavoritesPage } from '@pages/FavoritesPage';
import { OpportunityPage } from '@pages/OpportunityPage';
import { OpportunityCreatePage } from '@pages/OpportunityCreatePage';
import { OpportunityEditPage } from '@pages/OpportunityEditPage';
import { ResponsesPage } from '@pages/ResponsesPage';
import { VacanciesPage } from '@pages/VacanciesPage';
import { MyOpportunitiesPage } from '@pages/MyOpportunitiesPage';
import { ApplicantsPage } from '@pages/ApplicantsPage';
import { ApplicantEmployerViewPage } from '@pages/ApplicantEmployerViewPage';
import { AuthLoginPage } from '@pages/AuthLoginPage';
import { AuthRegisterPage } from '@pages/AuthRegisterPage';
import { ProfilePage } from '@pages/ProfilePage';
import { RequireAuth } from './providers';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth/login" element={<AuthLoginPage />} />
        <Route path="/auth/register" element={<AuthRegisterPage />} />
        <Route path="/opportunities" element={<VacanciesPage />} />
        <Route path="/opportunities/:id" element={<OpportunityPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route element={<RequireAuth />}>
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/applications" element={<ResponsesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        <Route element={<RequireAuth roles={['company']} />}>
          <Route path="/opportunities/create" element={<OpportunityCreatePage />} />
          <Route path="/opportunities/:id/edit" element={<OpportunityEditPage />} />
          <Route path="/my-opportunities" element={<MyOpportunitiesPage />} />
          <Route path="/applicants" element={<ApplicantsPage />} />
          <Route path="/applicants/candidate/:userId" element={<ApplicantEmployerViewPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
