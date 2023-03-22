// @ts-ignore
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {Alert, Platform} from 'react-native';
import {
  LOGIN,
  LOGIN_SOCIAL,
  EXIGO_LOGIN,
  EXIGO_REGISTER,
  NEW_RECOVER_PASSWORD,
  REGISTER,
  REGISTER_SOCIAL,
  USER,
} from '../api_helper/Api';
import RNVoipPushNotification from 'react-native-voip-push-notification';
import {useConnection} from '@sendbird/uikit-react-native/src';
import {SendbirdCalls} from '@sendbird/calls-react-native';
import {AxiosGET, GET, POST} from '../api_helper/ApiServices';
import {saveData} from '../res/asyncStorageHelper';
import DeviceInfo from 'react-native-device-info';
import TokenManager from '../libs/TokenManager';
import AuthManager from '../libs/AuthManager';
import {useAuthContext} from './AuthContext';
import {AppLogger} from '../utils/logger';
import jwt_decode from 'jwt-decode';
import CookieManager from '@react-native-cookies/cookies';
// Ory SDK stuff...
import {
  Session as KratosSession,
  SubmitSelfServiceLoginFlowBody,
} from '@ory/kratos-client';
import {newKratosSdk} from '../oryAuth/sdk';
import {handleFormSubmitError} from '../oryAuth/form';
import {OryAuthContext} from './OryAuthContext';
import {EventRegister} from 'react-native-event-listeners';
import AsyncStorage from '@react-native-community/async-storage';
import {
  AccessToken,
  LoginManager,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk-next';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import AsyncStore from '@react-native-community/async-storage';
import Snackbar from 'react-native-snackbar';
import Strings from '../string_key/Strings';
// The session type
export type SessionContext = {
  // The session token
  session_token: string;

  // The session itself
  session: KratosSession;
} | null;

export const AuthContext = createContext(null);

export const ContextProvider = props => {
  const {connect} = useConnection();

  const {setSession, session, sessionToken} = useContext(OryAuthContext);
  const refFlow = useRef(undefined);

  const [isSnooze, setIsSnooze] = useState({
    state: false,
    snoozeText: '',
  });
  const [isDisturb, setIsDisturb] = useState({
    state: false,
    dndText: '',
  });
  const [isLoginPending, setLoginPending] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [isRegistrationPending, setRegistrationPending] = useState(false);
  const [registrationError, setRegistrationError] = useState(null);
  const [userData, setLoginSuccess] = useState(null);
  const [selectedLang, setSelectedLang] = useState('en');
  const [emailError, setEmailError] = useState(null);
  const [emailload, setEmailLoad] = useState(false);
  const {setCurrentUser} = useAuthContext();
  const defaultLogin = success => {
    // setLoginSuccess(jwt_decode(success?.token));
    // console.log('hello ==> ', success);
    setLoginSuccess(success);
  };

  const initializeFlow = () =>
    newKratosSdk()
      // .initializeSelfServiceLoginFlowForBrowsers(false, 'aal1', sessionToken)
      // .initializeSelfServiceRecoveryFlowWithoutBrowser()
      .initializeSelfServiceVerificationFlowWithoutBrowser()
      .then(response => {
        const {data: flow} = response;
        // The flow was initialized successfully, let's set the form data:
        refFlow.current = flow;
      })
      .catch(console.error);

  // When the component is mounted, we initialize a new use login flow:
  useEffect(() => {
    initializeFlow().then();
    return () => {
      refFlow.current = undefined;
    };
  }, []);

  /**
   * This will update the login flow with the user provided input:
   */
  const onOryLogin = (payload: SubmitSelfServiceLoginFlowBody, callBack) =>
    refFlow?.current
      ? newKratosSdk()
          .submitSelfServiceLoginFlow(
            refFlow?.current?.id,
            sessionToken,
            payload,
          )
          .then(({data}) => Promise.resolve(data as SessionContext))
          .then(session => {
            console.log('Hello => ', JSON.stringify(session));
            actionGetUserDetails(session.session_token, (isOk, response) => {
              console.log(
                'user data response (isOk) => ',
                JSON.stringify(response),
              );
              // setSession(session);
              callBack(isOk, session.session_token, response);
            });
          })
          .catch(
            handleFormSubmitError(
              param => {
                setLoginPending(false);
                console.log('e?.message => ', param.message);
                callBack(false, param.message);
              },
              flow => (refFlow.current = flow),
              initializeFlow,
            ),
          )
      : Promise.resolve();

  const registerToken = async () => {
    if (Platform.OS === 'ios') {
      RNVoipPushNotification.addEventListener('register', async voipToken => {
        await Promise.all([
          SendbirdCalls.ios_registerVoIPPushToken(voipToken, true),
          TokenManager.set({value: voipToken, type: 'voip'}),
        ]);
        RNVoipPushNotification.removeEventListener('register');
        console.log('Ios registered token:', TokenManager.token);
        AppLogger.info('Ios registered token:', TokenManager.token);
      });
      RNVoipPushNotification.registerVoipToken();
    }
  };

  const googleLogin = callback =>
    refFlow?.current
      ? newKratosSdk()
          .submitSelfServiceLoginFlow(refFlow?.current?.id, sessionToken, {
            // .submitSelfServiceRegistrationFlow(refFlow?.current?.id, {
            csrf_token: '',
            method: 'oidc',
            provider: 'google',
          })
          // .then(({data}) => Promise.resolve(data as SessionContext))
          .then(redirectUrl => {
            callback(redirectUrl);
            // console.log('Hello => ', JSON.stringify(session));
            // setSession(session);
            // callBack(isOk, session.session_token);
          })
          .catch(
            handleFormSubmitError(
              param => {
                setLoginPending(false);
                console.log('e?.message => ', param.message);
                // callBack(false, param.message);
              },
              flow => (refFlow.current = flow),
              initializeFlow,
            ),
          )
      : Promise.resolve();



  const loginExigo = (email, password, _props) => {

    console.log("Exigo login")
        setLoginPending(true);
        setLoginError(null);
    
        actionLoginForExigo(email, password, (response, error) => {
          if (error) {
            setLoginPending(false);
            setLoginError(response);
            return;
          }
          Snackbar.dismiss();
          console.log('response ===> ', response);

          const res: any = jwt_decode(response?.token);

          console.log('exigo Login (response) ===> ', res);

          //Here we need to add JWT token parser and then we pass the otherdata


          const userProfile = {
            ...res,
            userId: res.id,
            token: 'Bearer ' + response.token,
          };
          setLoginPending(false);
          SendbirdCalls.authenticate({userId: userProfile.id}).then(val => {
            AuthManager.authenticate({userId: userProfile.id}).then(item => {
              registerToken().then(r_val => {
                setCurrentUser(val);
                console.log('userProfile.id ==> ', userProfile.id);
                connect(userProfile.id)
                  .then(user => {
                    console.log('login user');
                    console.log(user);
                  })
                  .catch(err => {});
                setLoginSuccess(userProfile);
                console.log('= userProfile =');
                console.log(userProfile);
                
                // AsyncStorage.setItem('show-last-seen', JSON.stringify(true));
                console.warn("Last seend on simple login MAVRIK",'show-last-seen')
                saveData('company_id', userProfile?.vendorId);
                saveData('userDetails', userProfile);
              });
            });
          });
          setTimeout(() => {
            _props.navigation.replace('Tab');
          }, 150);
        });
      };

  const login = (email, password, _props) => {
    setLoginPending(true);
    setLoginError(null);

    // let payload = {
    //   csrf_token: '',
    //   identifier: email,
    //   password: password,
    //   method: 'password',
    // };

    // @ts-ignore
    // onOryLogin(payload, (isOk, response, profile) => {
    //   if (isOk) {
    //     const userProfile = {...profile, userId: profile.id, token: response};
    //     setLoginPending(false);
    //     SendbirdCalls.authenticate({userId: userProfile.id}).then(val => {
    //       AuthManager.authenticate({userId: userProfile.id}).then(item => {
    //         registerToken().then(r_val => {
    //           setCurrentUser(val);
    //           connect(userProfile.id)
    //             .then(user => {
    //               console.log(user);
    //             })
    //             .catch(err => {});
    //           setLoginSuccess(userProfile);
    //           saveData('userDetails', userProfile);
    //         });
    //       });
    //     });
    //     setTimeout(() => {
    //       props.navigation.replace('Tab');
    //     }, 150);
    //   } else {
    //     setLoginError(response);
    //   }
    // });

    actionLogin(email, password, (response, error) => {
      if (error) {
        setLoginPending(false);
        setLoginError(response);
        return;
      }
      Snackbar.dismiss();
      console.log('response ===> ', response);
      const userProfile = {
        ...response.user,
        userId: response.user.id,
        token: response.sessionToken,
      };
      setLoginPending(false);
      SendbirdCalls.authenticate({userId: userProfile.id}).then(val => {
        AuthManager.authenticate({userId: userProfile.id}).then(item => {
          registerToken().then(r_val => {
            setCurrentUser(val);
            console.log('userProfile.id ==> ', userProfile.id);
            connect(userProfile.id)
              .then(user => {
                console.log('login user');
                console.log(user);
              })
              .catch(err => {});
            setLoginSuccess(userProfile);
            console.log('= userProfile =');
            console.log(userProfile);
            
            // AsyncStorage.setItem('show-last-seen', JSON.stringify(true));
            console.warn("Last seend on simple login MAVRIK",'show-last-seen')
            saveData('company_id', userProfile?.vendorId);
            saveData('userDetails', userProfile);
          });
        });
      });
      setTimeout(() => {
        _props.navigation.replace('Tab');
      }, 150);
    });
  };

  const socialLogin = (
    socialId: string,
    loginType: string,
    _props,
    callback,
  ) => {
    setLoginPending(true);
    setLoginError(null);


   
    const params = {
      socialId: socialId,
      loginType: loginType,
    };
    console.log('params for social login',params);

    actionSocialLogin(params, (response: any, error: any) => {
      if (error) {
        setLoginPending(false);
        if (typeof response === 'string') {
          if (!response.includes('A214')) {
            if (response.includes('A222')) {
              setLoginError(response);
            } else {
              setLoginError(response.includes('A214'));
            }
          }
        }
        callback(response);
        return;
      }

      const res: any = jwt_decode(response?.token);

      console.log('Social Login (response) ===> ', res);
      const userProfile: any = {
        ...res,
        userId: res.id,
        token: 'social-' + response?.token,
      };
      setLoginPending(false);
      SendbirdCalls.authenticate({userId: userProfile.id}).then(val => {
        AuthManager.authenticate({userId: userProfile.id}).then(_item => {
          registerToken().then(_r_val => {
            setCurrentUser(val);
            connect(userProfile.id)
              .then(user => {
                console.log(user);
              })
              .catch(_err => {});
            setLoginSuccess(userProfile);
              // AsyncStorage.setItem('show-last-seen', JSON.stringify(true));
              console.warn("Last seend on SendbirdCalls login MAVRIK",'show-last-seen')
            saveData('userDetails', userProfile);
          });
        });
      });
      setTimeout(() => {
        _props.navigation.replace('Tab');
        // LoginManager.logOut();
      }, 150);
    });
  };

  const socialRegister = (params, _props) => {
    setRegistrationPending(true);
    setRegistrationError(null);
console.log("Calling socialRegister method");
    actionSocialRegister(params, (success, isError) => {
      setRegistrationPending(false);
      if (isError) {
        setRegistrationError(
          success?.code == 'HttpException' ? success?.message : success,
        );
        return;
      }
      const res: any = jwt_decode(success?.token);
      // Alert.alert('Server Returned', 'Account linked successfully.');
      // clear();
      // setTimeout(() => {
      //   _props.navigation.replace('Auth');
      // }, 150);
      const userProfile: any = {
        ...res,
        userId: res.id,
        token: 'social-' + success?.token,
      };
      setLoginPending(false);
      SendbirdCalls.authenticate({userId: userProfile.id}).then(val => {
        AuthManager.authenticate({userId: userProfile.id}).then(_item => {
          registerToken().then(_r_val => {
            setCurrentUser(val);
            connect(userProfile.id)
              .then(user => {
                console.log(user);
              })
              .catch(_err => {});
            setLoginSuccess(userProfile);
            // AsyncStorage.setItem('show-last-seen', JSON.stringify(true));
                          // AsyncStorage.setItem('show-last-seen', JSON.stringify(true));
                          console.warn("Last seend on SendbirdCalls login MAVRIK",'show-last-seen')
            saveData('userDetails', userProfile);
          });
        });
      });
      setTimeout(() => {
        _props.navigation.replace('Tab');
        // LoginManager.logOut();
      }, 150);
    });
  };


  const registerExigo = (params, props) => {
    setRegistrationPending(true);
    setRegistrationError(null);

    console.log("My parmas are here for exigo",params)
    actionRegisterExigo(params, (success, isError) => {
      setRegistrationPending(false);
      if (isError) {
        setRegistrationError(
          success?.code == 'HttpException' ? success?.message : success,
        );
        return;
      }
      console.log('success ===> ', success);
      // Alert.alert('Server Returned', success?.message);

      clear();
      setTimeout(() => {
        // props.navigation.replace('Auth');
        props.navigation.navigate('Welcome');
        setTimeout(() => {
          EventRegister.emit('register-success');
        }, 500);
      }, 150);
    });
  };

  const register = (params, props) => {
    setRegistrationPending(true);
    setRegistrationError(null);

    actionRegister(params, (success, isError) => {
      setRegistrationPending(false);
      if (isError) {
        setRegistrationError(
          success?.code == 'HttpException' ? success?.message : success,
        );
        return;
      }
      console.log('success ===> ', success);
      // Alert.alert('Server Returned', success?.message);

      clear();
      setTimeout(() => {
        // props.navigation.replace('Auth');
        props.navigation.navigate('Welcome');
        setTimeout(() => {
          EventRegister.emit('register-success');
        }, 500);
      }, 150);
    });
  };

  const onforgetPassword = async (email, callback) => {
    setEmailError(null);
    setEmailLoad(true);

    // if (refFlow?.current) {
    //   newKratosSdk()
    //     .initializeSelfServiceRecoveryFlowWithoutBrowser()
    //     .then(response => {
    //       const {data: flow} = response;
    //       // The flow was initialized successfully, let's set the form data:
    //       refFlow.current = flow;
    //       newKratosSdk()
    //         .submitSelfServiceRecoveryFlow(refFlow?.current?.id, sessionToken, {
    //           csrf_token: '',
    //           method: 'code',
    //           email: 'robocop@yopmail.com',
    //         })
    //         .then(({data}) => Promise.resolve(data as SessionContext))
    //         .then(session => {
    //           console.log('Hello => ', JSON.stringify(session));
    //         })
    //         .catch(
    //           handleFormSubmitError(
    //             param => {
    //               setLoginPending(false);
    //               console.log('e?.message => ', param.message);
    //               // callBack(false, param.message);
    //             },
    //             flow => (refFlow.current = flow),
    //             initializeFlow,
    //           ),
    //         );
    //     })
    //     .catch(console.error);
    // } else {
    //   console.log('Error (onforgetPassword)');
    // }
    //
    // return;

    // AxiosGET('https://ory-kratos.onesay.app/self-service/recovery/api', {

    // const getFlowId = async () => {
    //   return AxiosGET(
    //     // 'https://ory-kratos.onesay.app/self-service/recovery/api',
    //     'https://ecstatic-lichterman-gv3xt1scj6.projects.oryapis.com/self-service/recovery/api',
    //     {
    //       headers: {
    //         Accept: 'application/json',
    //         'Content-Type': 'application/json',
    //       },
    //       params: {
    //         email: email,
    //         method: 'code',
    //         csrf_token: '',
    //       },
    //     },
    //   )
    //     .then(res => res.data.id)
    //     .catch(e => {
    //       console.log('Error (message) => ', e.message);
    //     });
    // };

    // try {
    //   const flowId = await getFlowId();
    //   // TODO: Send OTP to email...
    //   console.log('flowId ===> ', flowId);
    //   AxiosGET(
    //     `https://ecstatic-lichterman-gv3xt1scj6.projects.oryapis.com/self-service/recovery/api?flow=${flowId}`,
    //     // `https://ory-kratos.onesay.app/self-service/recovery/api?flow=${flowId}`,
    //     {
    //       headers: {
    //         Accept: 'application/json',
    //         'Content-Type': 'application/json',
    //       },
    //       params: {
    //         email: email,
    //         method: 'code',
    //         csrf_token: '',
    //       },
    //     },
    //   )
    //     .then(res => {
    //       setEmailLoad(false);
    //       // const flowId = res?.data?.id;
    //       console.log('Response (flowId) => ', res);
    //       callback(flowId, 'OTP is sent to your email.');
    //     })
    //     .catch(e => {
    //       setEmailLoad(false);
    //       console.log('Error (message) => ', e.message);
    //     });
    // } catch (e) {
    //   setEmailLoad(false);
    //   console.log('Error (message) => ', e.message)
    // }

    // return;
    actionForgetPassword(email, (res, e) => {
      setEmailLoad(false);
      console.log('res ==> ', res);
      if (!e) {
        callback(res.flowId, res?.message);
        // props.navigation.goBack();
        // setTimeout(() => {
        //   Alert.alert('Success', res?.message, [
        //     {text: 'OK', onPress: () => console.log('OK Pressed')},
        //   ]);
        // }, 150);
      } else {
        setEmailError(res);
      }
    });
  };

  const updateUserData = updateData => {
    setLoginSuccess(prevData => {
      const _profile = {
        ...updateData,
        token: prevData.token,
        userId: userData.userId,
      };
      saveData('userDetails', _profile);
      return _profile;
    });
  };

  const clear = () => {
    setLoginError(null);
    setRegistrationError(null);
    setEmailError(null);
    setLoginSuccess(null);
  };

  const fbLogout = async () => {
    try {
      let tokenObj = await AccessToken.getCurrentAccessToken();
      if (tokenObj) {
        let current_access_token = tokenObj.accessToken.toString();
        let logout = new GraphRequest(
          'me/permissions/',
          {
            accessToken: current_access_token,
            httpMethod: 'DELETE',
          },
          (error, result) => {
            if (error) {
              console.log('Error fetching data: ' + error.toString());
            } else {
              LoginManager.logOut();
              AccessToken.setCurrentAccessToken(null);
              console.log('deleted****');
            }
          },
        );
        new GraphRequestManager().addRequest(logout).start();
        console.log('logout (Facebook)');
      } else {
        console.log('User already logged out (Facebook)');
      }
    } catch (err) {
      console.log('Error while logout (Facebook)', err);
    }
  };

  const logout = () => {
    try {
      fbLogout().then();
    } catch (e) {
      console.log('Facebook logout error', e.message);
    }
    try {
      GoogleSignin.signOut().then();
    } catch (e) {
      console.log('Google logout error', e.message);
    }
    setLoginPending(false);
    setRegistrationPending(false);
    setLoginSuccess(null);
    setLoginError(null);
    setRegistrationError(null);
    saveData('isMembershipSkipped', null);
    saveData('phone-verify-skipped', null);
    // updateSelectedLang('en');
  };
  const updateSelectedLang = val => {
    Strings.setLanguage(val);
    AsyncStorage.setItem('selected-language', val);
    setSelectedLang(val);
  };
  useEffect(() => {
    AsyncStorage.getItem('selected-language').then(value => {
      if (value) {
        console.log('selected-language in contetx', value);
        Strings.setLanguage(value);
        setSelectedLang(value);
      } else {
        Strings.setLanguage('en');
        setSelectedLang('en');
      }
    });
  }, []);
  const updateDND = value => setIsDisturb(() => value);
  const updateSnooze = value => setIsSnooze(() => value);

  return (
    <AuthContext.Provider
      value={{
        state: {
          isSnooze,
          isDisturb,
          isLoginPending,
          isRegistrationPending,
          registrationError,
          userData,
          loginError,
          emailError,
          emailload,
          selectedLang,
        },
        updateDND,
        updateSnooze,
        defaultLogin,
        login,
        socialLogin,
        socialRegister,
        googleLogin,
        register,
        logout,
        onforgetPassword,
        updateUserData,
        clear,
        updateSelectedLang,
        actionLoginForExigo,
        loginExigo,
        registerExigo
      }}>
      {props.children}
    </AuthContext.Provider>
  );
};

// action login
const actionLogin = (email, password, callBack) => {
  let postData = {identifier: email, password: password};
  DeviceInfo.getUniqueId().then(device_d => {
    POST(LOGIN, false, null, device_d, postData, (data, isError) =>
      callBack(data, isError),
    );
  });
};

// action login
const actionLoginForExigo = (email, password, callBack) => {
  let postData = {username: email, password: password};
  DeviceInfo.getUniqueId().then(device_d => {
    POST(EXIGO_LOGIN, false, null, device_d, postData, (data, isError) =>
      callBack(data, isError),
    );
  });
};



// action login
const actionGetUserDetails = (token, callBack) => {
  DeviceInfo.getUniqueId()
    .then(device_d => GET(USER, token, device_d))
    .then(response => {
      const _response: any = response;
      callBack(true, _response?.data);
    })
    .catch(e => {
      callBack(false, e.message);
    });
};

// action social login
const actionSocialLogin = (params, callBack) => {
  DeviceInfo.getUniqueId().then(device_d => {
    POST(LOGIN_SOCIAL, false, null, device_d, params, (data, isError) =>
      callBack(data, isError),
    );
  });
};

// action social register
const actionSocialRegister = (params, callBack) => {
  console.log("action parm ", params);
  DeviceInfo.getUniqueId().then(device_d => {
    POST(REGISTER_SOCIAL, false, null, device_d, params, (data, isError) =>
      callBack(data, isError),
    );
  });
};

// action register
const actionRegister = (params, callBack) => {
  DeviceInfo.getUniqueId().then(device_d => {
    POST(REGISTER, false, null, device_d, params, (data, isError) =>
      callBack(data, isError),
    );
  });
};

const actionRegisterExigo = (params, callBack) => {
  DeviceInfo.getUniqueId().then(device_d => {

    console.log("My parmas are here for exigo WBE URL")
    POST(EXIGO_REGISTER, false, null, device_d, params, (data, isError) =>
      callBack(data, isError),
    );
  });
};

// New password recover
const actionForgetPassword = (email, callBack) => {
  let postData = {identifier: email};
  POST(NEW_RECOVER_PASSWORD, false, null, null, postData, (data, e) =>
    callBack(data, e),
  );
};
