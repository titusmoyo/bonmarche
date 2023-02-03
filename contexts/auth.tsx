
import { ReactNode } from "react";
import { createContext, useState, useEffect, useContext } from 'react';
import { ObserverOnAuthStateChanged,ObserverDbUSersState } from '@lib/firebase_db/firebase_auth';


const AuthContext = createContext({ user: null, userLoading: true,dbuser:null, userId:null});


export const AuthProvider = ({ children }:{ children: ReactNode}) => {

  const [userLoading, setUserLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userId,setUserId] = useState(null);
  const [dbuser, setDbuser] = useState(null);

  /*
  useEffect(() => {
    return onAuthStateChanged((res) => {
      setUser(res);
      setUserLoading(false);
    });
  }, []);*/
  useEffect(() =>{
       const unlisten = ObserverOnAuthStateChanged(
           (res: any | null) => {
            res ? setUser(res) : setUser(null);
            setUserLoading(false);
            //console.log("**AuthStateChanged");
            if(res){
              //let usr=res.email.split("@")[0];
              setUserId(res.uid);
              if(dbuser===null){
                console.log("**AuthStateChanged - observer");
                ObserverDbUSersState(res.uid,dbuser,setDbuser);
              }
            }else{
              setUserId(null);
              setDbuser(null);
            }
          },
       );
       return () => {
           unlisten;
       }
  }, []);

  return (
    <AuthContext.Provider value={{user, userLoading,dbuser,userId}} >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
