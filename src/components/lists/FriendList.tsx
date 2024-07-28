import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const FriendList: React.FC = () => {
  const friends = useSelector((state: RootState) => state.friends.value);

  return (
    <>
      <h2 className="text-center text-2xl">Friends</h2>
      {friends.map((invite, index) => (
        <div
          key={`${invite.id}-${index}`}
          className="bg-slate-600 m-2 py-2 px-4 rounded-full flex justify-between"
        >
          <span>{invite.name}</span>
        </div>
      ))}
    </>
  );
};

export default FriendList;
