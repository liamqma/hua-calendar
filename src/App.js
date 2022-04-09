import { useState, useEffect } from "react";
import {
  getDatabase,
  ref,
  set,
  remove,
  onValue,
  child,
  get,
} from "firebase/database";
import "react-calendar/dist/Calendar.css";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Calendar from "react-calendar";
import { getAuth } from "firebase/auth";
import formatISO from "date-fns/formatISO";
import parseISO from "date-fns/parseISO";
import isSunday from "date-fns/isSunday";
import differenceInDays from "date-fns/differenceInDays";
import List from "@mui/material/List";
import ListSubheader from "@mui/material/ListSubheader";
import ListItem from "@mui/material/ListItem";

import "./App.css";

import Login from "./Login";
import firebase from "./firebase";

const db = getDatabase();
const auth = getAuth(firebase);
const itemsRef = ref(db, "items");

const isDateAvailableByDefaultRule = (date) => {
  const today = new Date();
  if (isSunday(date)) return false;
  if (differenceInDays(date, today) < 7) return false;
  return true;
};

get(child(ref(db), "items")).then((snapshot) => {
  if (snapshot.exists()) {
    const items = snapshot.val();
    if (items) {
      Object.keys(items).forEach((item) => {
        if (!isDateAvailableByDefaultRule(parseISO(item))) {
          remove(ref(db, `items/${item}`));
        }
      });
    }
  }
});

function App() {
  const [user, setUser] = useState(auth.currentUser);
  const [items, setItems] = useState(null);

  function onChange(user) {
    setUser(user);
  }

  useEffect(() => {
    // listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged(onChange);
    // unsubscribe to the listener when unmounting
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      setItems(data || {});
    });
  }, []);

  const itemsArray = items ? Object.keys(items) : [];

  console.log(user);

  return (
    <Box sx={{ width: "100%" }}>
      <Stack spacing={2}>
        {user ? <></> : <Login setUser={setUser} />}
        {items && user ? (
          <Calendar
            onClickDay={(value) => {
              const dateString = formatISO(value, { representation: "date" });
              if (isDateAvailableByDefaultRule(value)) {
                if (itemsArray.includes(dateString)) {
                  remove(ref(db, `items/${dateString}`));
                } else {
                  set(ref(db, `items/${dateString}`), dateString);
                }
              }
            }}
            tileDisabled={({ date }) => {
              return !isDateAvailableByDefaultRule(date);
            }}
            tileClassName={({ date }) => {
              const dateString = formatISO(date, { representation: "date" });
              if (itemsArray.includes(dateString)) return "disabled";
              return null;
            }}
          />
        ) : null}
        {itemsArray.length && user ? (
          <List subheader={<ListSubheader>Unavailable Dates:</ListSubheader>}>
            {itemsArray.map((item, index) => (
              <ListItem key={(item, index)}>{item}</ListItem>
            ))}
          </List>
        ) : null}
      </Stack>
    </Box>
  );
}

export default App;
