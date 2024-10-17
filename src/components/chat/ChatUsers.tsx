import React from "react";
import { useGetUsersActivityStatusQuery } from "../../features/api/userApi";
import getTimeDifference from "../../utils/getTimeDifference";
import { Timestamp } from "firebase/firestore";

interface ChatUsersProps {
  userIds: string[];
}

const ChatUsers: React.FC<ChatUsersProps> = ({ userIds }) => {
  const { data: chatUsers } = useGetUsersActivityStatusQuery(userIds);

  return (
    <ul>
      <h4 className="text-2xl">Chat Users</h4>
      {chatUsers?.map((user, index) => {
        return (
          <li
            key={`options-list-${index}`}
            className="flex items-center gap-1 text-lg"
          >
            <div
              data-testid={`list-element-${user.name}`}
              className={`border-solid border-2 border-slate-950 p-2 rounded-full ${
                user!.status!.isActive ? "bg-green-600" : "bg-slate-700"
              }`}
            ></div>
            <span>{user.name}</span>
            {user!.status!.isActive === false && (
              <span
                className="text-slate-500"
                data-testid={`inactive-for-${user.name}`}
              >
                {getTimeDifference(user!.status!.lastOnline as Timestamp)}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default ChatUsers;
