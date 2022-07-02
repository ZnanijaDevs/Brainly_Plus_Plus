import GetUserProfile from "@lib/api/Brainly/GetUserProfile";
import { useEffect } from "react";
import AdaptiveButton from "../common/AdaptiveButton";

export default function UserProfilePreviewSection(props: {
  userId: number;
}) {
  useEffect(() => {
    GetUserProfile(props.userId)
      .then(user => console.debug(user));
  }, []);

  return (
    <AdaptiveButton
      size="xs"
      icon={{ type: "profile_view", color: "icon-white" }}
      type="facebook"
      data-user-id={props.userId}
      title={MESSAGES.viewUserProfile}
    />
  );
}