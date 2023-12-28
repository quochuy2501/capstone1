import Admin from "../../components/home/admin";
import Owner from "../../components/home/owner";
import User from "../../components/home/user";
import { useGlobalContext } from "../../contexts/GlobalContext";

const HomePage = () => {
  const { user } = useGlobalContext();
  let content;
  if (user.role === "2") content = <Admin />;
  if (user.role === "1") content = <Owner />;
  if (user.role === "0") content = <User />;

  return <div>{content}</div>;
};

export default HomePage;
