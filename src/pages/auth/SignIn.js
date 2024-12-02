import { useState } from "react";
import Arrowright from "../../icons/Arrowright";
import { useLogin } from '../../hooks/useAuth';
import Loading from "../../icons/Loading";
import EyeOpen from "../../icons/EyeOpen";
import EyeClose from "../../icons/EyeClose";

export default function SignIn(){
    const { 
        errorLogin, handleKey, handleKeySubmit, handleRememberMe, key, loading, remember_me, successLogin
    } = useLogin();

    const [showKey, setShowKey] = useState(false);

    return(
        <>
            <div className="xui-bg-white xui-bdr-rad-half xui-max-w-500 xui-md-mt-none xui-w-fluid-100 xui-p-1-half xui-pb-3 xui-text-black">
                <h2 className="xui-font-sz-125 xui-w-fluid-80 xui-my-1">Sign In to <span className="psc-text">Ecommerce Admin</span></h2>
                <form className="xui-form" layout="2" onSubmit={handleKeySubmit}>
                    <div className="xui-mb-2 xui-d-inline-flex xui-flex-ai-center xui-w-fluid-100">
                        <input className="xui-font-sz-90" type={showKey ? "text" : "password"} onChange={handleKey} required placeholder="Key"></input>
                        <span className="xui-cursor-pointer" onClick={() => setShowKey(!showKey)}>{showKey ? <EyeOpen width="20" height="20" /> : <EyeClose width="20" height="20" />}</span>
                    </div>
                    <div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-between">
                        <div className="xui-d-inline-flex xui-flex-ai-center">
                            <input type="checkbox" onChange={handleRememberMe} checked={remember_me} id="remember-me" />
                            <label for="remember-me" className="xui-ml-half" style={{ marginBottom: '0' }}>Remember me</label>
                        </div>
                    </div>
                    <div className="xui-form-box xui-d-flex xui-flex-jc-flex-end">
                        <button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-85">
                            <span className="xui-mr-half">Sign In</span>
                            {
                                loading ?
                                    <Loading width="12" height="12" />
                                    : <Arrowright width="12" height="12" />
                            }
                        </button>
                    </div>
                </form>
                <p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorLogin}</span></p>
                <p className="xui-font-sz-100 xui-my-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successLogin}</span></p>
            </div>
        </>
    )
}