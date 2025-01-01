import storage from "@/app/local/local-storage";
import ServiceAuth from "@/app/service/service-auth";
import Buttons from "@/components/Buttons";
import { set } from "@/redux/login-user-store";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [type, setType] = useState(storage.loginedType.get() || "A");

  const doLogin = async (e) => {
    e.preventDefault();

    try {
      const saveData = {
        id: email,
        password: pwd,
        type,
      };
      const res = await ServiceAuth.login(saveData);
      dispatch(set({ id: res.id, name: res.name, token: res.token, type }));

      storage.loginedId.set(res.id);
      storage.loginedName.set(res.name);
      storage.loginedType.set(type);
      storage.loginedToken.set(res.token);

      if (type === "T") navigate("/teacher");
      else navigate("/operator", { replace: true });
    } catch (error) {
      if (/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(error.response.data.message))
        alert(error.response.data.message);
    }
  };

  return (
    <div className="login-page-wrap">
      <div className="login-page-inner">
        <div className="login-page-visual">
          <div className="ui-logo">
            <div>
              <div className="title">English Channel</div>
              <div className="desc">1:1 language Clinic</div>
            </div>
          </div>
        </div>
        <form onSubmit={doLogin}>
          <div className="login-inputs">
            <div className="login-box">
              <div className="login-box-title">
                <strong className="title">LMS</strong>
                <span className="desc">(Learning Management System)</span>
              </div>

              <div className="ui-input-wrap">
                <div className="inner">
                  <i className="fas fa-user txt-grey700"></i>
                  <input
                    type="text"
                    autoFocus
                    placeholder="User ID"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="ui-input-wrap">
                <div className="inner">
                  <i className="fas fa-lock txt-grey700"></i>
                  <input
                    type="password"
                    placeholder="Password"
                    value={pwd}
                    onChange={(e) => setPwd(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <div className="ui-radio-group">
                <div>
                  <input
                    type="radio"
                    id="teacher"
                    value="teacher"
                    checked={type === "T"}
                    onChange={() => setType("T")}
                  />
                  <label htmlFor="teacher">강사(instructor)</label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="operator"
                    value="operator"
                    checked={type === "A"}
                    onChange={() => setType("A")}
                  />
                  <label htmlFor="operator">운영자(system operator)</label>
                </div>
              </div>

              <div className="flex">
                <div className="ml-auto">
                  <Buttons type="submit" className="ui-button primary large">
                    Login
                  </Buttons>
                </div>
              </div>

              <div className="flexYCenter gap ml-auto size-bodyS">
                <i className="fas fa-info-circle txt-secondary"></i>
                <a href="mailto:desk@englishchannel.co.kr" className="ui-link">
                  desk@englishchannel.co.kr
                </a>
              </div>
            </div>

            <div className="ui-copyright">Copyright 2024. English Channel All rights reserved.</div>
          </div>
        </form>
      </div>
      {/*deferredPrompt && (
        <div>
          <Buttons onClick={handleInstallClick}>설치하기</Buttons>
          <Buttons onClick={handleCancelClick}>취소</Buttons>
        </div>
      )*/}
    </div>
  );
};

export default LoginPage;
