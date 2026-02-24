import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

function Admin() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "bookings"));
      setBookings(snapshot.docs.map(doc => doc.data()));
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2>Admin Panel</h2>
      {bookings.map((b, index) => (
        <div key={index}>
          <p>{b.date} - {b.time} - คอร์ท {b.court}</p>
        </div>
      ))}
    </div>
  );
}

export default Admin;