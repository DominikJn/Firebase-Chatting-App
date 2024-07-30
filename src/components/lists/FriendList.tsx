import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import type UserData from "../../types/UserData";
import { arrayRemove, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase-config";

const FriendList: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.value);
  const friends = useSelector((state: RootState) => state.friends.value);

  async function handleFriendDelete(friend: UserData): Promise<void> {
    //update current users's profile
    await updateDoc(doc(db, "users", user.uid), {
      friends: arrayRemove(friend),
    });
    //update deleted friend's profile
    const userAdjustedData = { name: user.name, id: user.uid };
    await updateDoc(doc(db, "users", friend.id), {
      friends: arrayRemove(userAdjustedData),
    });
  }

  return (
    <>
      <h2 className="text-center text-2xl">Friends</h2>
      {friends.map((friend: UserData, index: number) => (
        <div
          key={`${friend.id}-${index}`}
          className="bg-slate-600 rounded-full text-2xl cursor-pointer px-6 py-3 m-2 flex flex-wrap justify-between gap-2"
        >
          <span>{friend.name}</span>
          <button onClick={() => handleFriendDelete(friend)}>x</button>
        </div>
      ))}
    </>
  );
};

export default FriendList;
