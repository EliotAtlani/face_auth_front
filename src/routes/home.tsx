import LogoutButton from "../components/buttons/LogOutBtn";

const Home = () => {
  return (
    <div className="w-full h-screen flex flex-col gap-4 items-center justify-center">
      You're connected !!
      <LogoutButton />
    </div>
  );
};

export default Home;
