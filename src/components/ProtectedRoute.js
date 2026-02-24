import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

function ProtectedRoute({ children }) {
  const [user, setUser] = useState(undefined); // undefined = กำลังโหลด

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  
  if (user === undefined) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  
  if (!user) {
    return <Navigate to="/login" />;
  }

  // ✅ login แล้ว
  return children;
}

export default ProtectedRoute;