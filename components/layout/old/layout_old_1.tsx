
import { ReactNode } from "react";
import { useAuth } from '@contexts/auth';
import { signOutUser } from '@lib/firebase_db/firebase_auth';
import Link from 'next/link';
import {HOME_PAGE_INDEX,SIGNUP_PAGE_INDEX,LOGIN_PAGE_INDEX} from '@utils/constants/layout_constants';

const Layout = ({ children,childType }:{ children: ReactNode,childType:number}) => {
  const {user} = useAuth();

  return (
    <div>
      <nav>
        <span>
          <Link href="/">
            BonMarche
          </Link>
        </span>

        {user && (
          <span>
            {'  '}
            <button onClick={() => signOutUser()}>Sign Out</button>
          </span>
        )}

        {user===null && childType!==SIGNUP_PAGE_INDEX && (
          <span>
            {'  '}
            <Link href="/auth/signup">
              Sign Up
            </Link>
          </span>
        )}
        <p>---------------------------------------------------------------------</p>
      </nav>

      <main>{children}</main>

    </div>
  );
};

export default Layout;
