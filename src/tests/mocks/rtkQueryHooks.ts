//mocked data
import { testUserDocData } from "../mocks/testUserDocData";
import { testUsersArray } from "../mocks/testUsersArray";
import { testGroupChatData, testSingleChatData } from "./testChatData";
//rtk query hooks
import {
  useAddChatMutation,
  useDeleteChatMutation,
  useGetChatByIdQuery,
  useGetUserChatsQuery,
  useUpdateChatNameMutation,
} from "../../features/api/chatApi";
import {
  useAcceptInviteMutation,
  useDeleteFriendMutation,
  useGetUserQuery,
  useGetUsersActivityStatusQuery,
  useRejectInviteMutation,
  useSendInviteMutation,
  useUpdateUserMutation,
} from "../../features/api/userApi";
import {
  useGetChatMessagesQuery,
  useSendMessageMutation,
  useUpdateUnseenByMutation,
  useUploadFileMutation,
} from "../../features/api/messageApi";
import { spammedTestMessages } from "./testMessages";

//REMEMBER YOU CAN'T MOCK PATHS HERE

export const setupRtkQueryMocks = ({
  addChat = vi.fn(),
  updateUser = vi.fn(),
  sendMessage = vi.fn(),
  uploadFile = vi.fn(),
  updateUnseenBy = vi.fn(),
  updateChatName = vi.fn(),
  deleteChat = vi.fn(),
  deleteFriend = vi.fn(),
  acceptInvite = vi.fn(),
  rejectInvite = vi.fn(),
  sendInvite = vi.fn(),
} = {}) => {
  const file = new File(["hello"], "hello.png", { type: "image/png" });

  useGetUserChatsQuery.mockReturnValue({
    data: [testGroupChatData, testSingleChatData],
  });
  useGetUserQuery.mockReturnValue({ data: testUserDocData });
  useGetUsersActivityStatusQuery.mockReturnValue({ data: testUsersArray });
  useGetChatByIdQuery.mockReturnValue({ data: testGroupChatData });
  useGetChatMessagesQuery.mockReturnValue({ data: spammedTestMessages });

  sendMessage.mockResolvedValue({ data: { message: "She is muh queen!!" } });
  uploadFile.mockResolvedValue({ data: { file } });

  useAddChatMutation.mockImplementation(() => [addChat]);
  useUpdateUserMutation.mockImplementation(() => [updateUser]);
  useSendMessageMutation.mockImplementation(() => [sendMessage]);
  useUploadFileMutation.mockImplementation(() => [uploadFile]);
  useUpdateUnseenByMutation.mockImplementation(() => [updateUnseenBy]);
  useUpdateChatNameMutation.mockImplementation(() => [updateChatName]);
  useDeleteChatMutation.mockImplementation(() => [deleteChat]);
  useDeleteFriendMutation.mockImplementation(() => [deleteFriend]);
  useAcceptInviteMutation.mockImplementation(() => [acceptInvite]);
  useRejectInviteMutation.mockImplementation(() => [rejectInvite]);
  useSendInviteMutation.mockImplementation(() => [sendInvite]);
};
