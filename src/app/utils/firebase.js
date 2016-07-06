import firebase from 'firebase/app';
import firebase_auth from 'firebase/auth';
import { FIREBASE_CONFIG } from '../config';
import { currentUserPromise, fetchUserObject } from './localstorage';


firebase.initializeApp(FIREBASE_CONFIG);

var FireBaseTools = {

    getProvider: (provider) => {

        switch (provider) {
            case "facebook":
                return new firebase.auth.FacebookAuthProvider();
                break;
            case "twitter":
                return new firebase.auth.TwitterAuthProvider();
                break;
            default:

        }
    },
    loginWithProvider: (p) => {

        return new Promise((resolve, reject) => {

            let provider = FireBaseTools.getProvider(p);

            firebase.auth().signInWithRedirect(provider).then(function(result) {
                if(result.credential) {
                let token = result.credential.accessToken;
              }
                let user = result.user;
                fetchUserObject(user).then(user => {
                    resolve(user);
                })


            }).catch(function(error) {
                let email = error.email;
                let credential = error.credential;

                reject({
                    errorCode: error.code,
                    errorMessage: error.message
                })

            });


        })

    },


    registerUser: (user) => {

        return new Promise((resolve, reject) => {

            firebase.auth().createUserWithEmailAndPassword(user.email, user.password).then(user => {

                // save user to localstorage
                fetchUserObject(user).then(user => {
                    resolve(user);
                })

            }).catch(error => {

                reject({
                    errorCode: error.code,
                    errorMessage: error.message
                })

            });

        })

    },

    logoutUser: (user) => {

        return new Promise((resolve, reject) => {
            firebase.auth().signOut().then(function() {
                // Sign-out successful and clear data.
                localStorage.clear();
                resolve({
                    success: 1,
                    message: "logout"
                });
            });
        });
    },

    fetchUser: () => {
        return new Promise((resolve, reject) => {

            currentUserPromise().then(user => {
                if (user) {
                    resolve(user)
                };
            })

            firebase.auth().onAuthStateChanged(user => {
                //resolve(firebase.auth().currentUser);
                if (user) {
                    fetchUserObject(firebase.auth().currentUser).then(user => {
                        resolve(user);
                    })
                } else {
                    resolve(null)
                }


            });
        });

    },

    loginUser: (user) => {
        return new Promise((resolve, reject) => {

            firebase.auth().signInWithEmailAndPassword(user.email, user.password).then(user => {
                // save user to localstorage
                fetchUserObject(user).then(user => {

                    resolve(user);
                })

            }).catch(error => {
                reject({
                    errorCode: error.code,
                    errorMessage: error.message
                })

            });

        })
    },

    updateUser: (u) => {
        return new Promise((resolve, reject) => {

            var user = firebase.auth().currentUser;
            if (user) {
                // ensure we have current user
                var user = firebase.auth().currentUser;
                user.updateProfile({
                    displayName: u.displayName,
                    photoUrl: '' // field for photo url
                }).then(data => {

                    // renew user
                    fetchUserObject(firebase.auth().currentUser).then(user => {
                        resolve(user);
                    })

                }, error => {
                    reject({
                        errorCode: error.code,
                        errorMessage: error.message
                    })
                })
            } else {
                resolve(null)
            }

        })
    },

    resetPasswordEmail: (email) => {

        return new Promise((resolve, reject) => {

            var auth = firebase.auth();
            auth.sendPasswordResetEmail(email).then((data) => {
                resolve({
                    message: 'Email sent',
                    errorCode: null
                })
            }, error => {
                // An error happened.
                reject({
                    errorCode: error.code,
                    errorMessage: error.message
                })
            });

        });
    },

    changePassword: (newPassword) => {
        return new Promise((resolve, reject) => {

            var user = firebase.auth().currentUser;

            user.updatePassword(newPassword).then(() => {
                // renew user
                fetchUserObject(user).then(user => {
                    resolve(user);
                })

            }, error => {

                reject({
                    errorCode: error.code,
                    errorMessage: error.message
                })
            });

        })
    }

}

export default FireBaseTools;
