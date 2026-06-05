import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import DesktopView from "./views/DesktopView";
import WelcomeView from "./views/WelcomeView";
import { getSetupStatus } from "./system/setup";

function GuardedRoutes() {
  const location = useLocation();
  const [ready, setReady] = useState(false);
  const [target, setTarget] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      const setup = await getSetupStatus();
      if (cancelled) return;
      if (!setup.reachable) {
        setTarget(null);
        setReady(true);
        return;
      }
      const welcomed = setup.initialized || setup.welcomeSkipped;
      if (!welcomed && location.pathname !== "/welcome") setTarget("/welcome");
      else if (welcomed && location.pathname === "/welcome") setTarget("/");
      else setTarget(null);
      setReady(true);
    }
    setReady(false);
    void run();
    return () => {
      cancelled = true;
    };
  }, [location.pathname]);

  if (!ready) return <div className="h-[100dvh] w-screen bg-[#1a1410]" />;
  if (target) return <Navigate to={target} replace />;

  return (
    <Routes>
      <Route path="/" element={<DesktopView />} />
      <Route path="/welcome" element={<WelcomeView />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return <GuardedRoutes />;
}
