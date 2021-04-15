import React from 'react'
import { useHistory } from 'react-router';
import { auth, provider } from './firebase';
import { actionTypes } from './reducer';
import { useStateValue } from './StateProvider';

function Login() {
  const [, dispatch] = useStateValue() as any;
  const history = useHistory()
  const signIn = (e: any) => {
    auth.signInWithPopup(provider)
      .then(result => {
        dispatch({
          type: actionTypes.SET_USER,
          user: result.user,
        })
        history.push("/channel/VzXyZUQYievZSkEA2Alm")
      }).catch(error => {
        alert(error.message)
      })
  }

  return (
    <div className="items-center flex flex-col w-full pt-12">
      <img alt="Slack" src="https://a.slack-edge.com/bv1-9/slack_logo-ebd02d1.svg" width="135" title="Slack"></img>
      <h1 className="font-bold tracking-tight text-5xl pt-10">Sign in to your workspace</h1>
      <h1 className="text-lg font-light pt-5">Enter your workspace's Slack URL</h1>
      <input className="p-3 mt-5 w-96 border border-gray-400 rounded-md" placeholder="your-workspace.slack.com" />
      <button onClick={signIn} className="p-2 mt-5 w-96 bg-indigo-900 rounded-md text-white font-bold text-lg">Continue</button>

      <div className="pt-6 w-96 justify-start text-xs space-x-1">
        <span className="font-light">Don't know your workspace URL?</span>
        <span className="text-blue-800">Find your workspaces</span>
      </div>
      <div className="pt-2 w-96 justify-start text-xs space-x-1">
        <span className="font-light">Looking to create a workspace instead?</span>
        <span className="text-blue-800">Create a new workspace</span>
      </div>
    </div>
  )
}

export default Login
