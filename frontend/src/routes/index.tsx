import { Routes, Route } from 'react-router-dom';
import { HomePage } from '../pages/home';
import { Feed } from '@/pages/feed';
import { SignIn } from '@/pages/signin';
import { Signup } from '@/pages/signup';
import { ReadPost } from '@/pages/read-post';
import { Profile } from '@/pages/profile';
import { ForgotPassword } from '@/pages/forgot-password';
import { Loading } from '@/components/ui/loading';
import { RecoveryPassword } from '@/pages/recovery-password';
import { WithEmailVerification } from '@/middleware/withEmailVerification';
import { WithLogginNeeded } from '@/middleware/withLogginNeeded';
import { Error } from '@/pages/error';

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <WithEmailVerification>
            <HomePage>
              <Loading />
            </HomePage>
          </WithEmailVerification>
        }
      />
      <Route
        path="/feed"
        element={
          <WithEmailVerification>
            <Feed>
              {' '}
              <Loading />{' '}
            </Feed>
          </WithEmailVerification>
        }
      />
      <Route
        path="/signin"
        element={
          <WithEmailVerification>
            <SignIn>
              <Loading />
            </SignIn>
          </WithEmailVerification>
        }
      />
      <Route
        path="/signup"
        element={
          <WithEmailVerification>
            <Signup>
              <Loading />
            </Signup>
          </WithEmailVerification>
        }
      />
      <Route path="/feed/post/:id" element={<ReadPost />} />
      <Route
        path="/me/profile"
        element={
          <WithLogginNeeded>
            <Profile>
              <Loading />
            </Profile>
          </WithLogginNeeded>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <ForgotPassword>
            <Loading />
          </ForgotPassword>
        }
      />
      <Route
        path="/recovery-password"
        element={
          <RecoveryPassword>
            <Loading />
          </RecoveryPassword>
        }
      />

      <Route path="*" element={<Error />} />
    </Routes>
  );
}
