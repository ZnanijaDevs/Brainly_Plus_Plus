import ContentLoader from "react-content-loader";

export default function Loader() {
  return <ContentLoader 
    title={locales.loading}
    style={{
      height: "100%",
      width: "100%"
    }}
  />;
}