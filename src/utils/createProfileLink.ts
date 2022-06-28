export default (
  id: number | string,
  nick?: string
) => {
  if (!nick)
    return `/users/redirect_user/${id}`;

  return `/profil/${encodeURIComponent(nick)}-${id}`;
};