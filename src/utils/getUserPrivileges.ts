import _API from "@lib/api/Brainly/Legacy";

export type UserPrivilegesDataType = {
  canApprove: boolean;
  canUnapprove: boolean;
  canAccept: boolean;
};

export default async (): Promise<UserPrivilegesDataType> => {
  const me = await _API.GetMe();

  const privileges = me.privileges;

  return {
    canApprove: privileges.includes(146),
    canAccept: !privileges.includes(146),
    canUnapprove: privileges.includes(147)
  };
};